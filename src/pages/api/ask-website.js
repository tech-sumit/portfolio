import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
const apiKey = process.env.GOOGLE_AI_API_KEY;
const modelName = "gemini-1.5-flash-latest";

// --- Helper Function to read Markdown Files ---
async function getWebsiteContext() {
  const contentDir = path.resolve(process.cwd(), 'src/content');
  const resumeDir = path.join(contentDir, 'resume');
  const pagesDir = path.join(contentDir, 'pages');
  const postsDir = path.join(contentDir, 'posts');

  const staticFilePaths = {
    experience: path.join(resumeDir, 'experience.md'),
    skills: path.join(resumeDir, 'skills.md'),
    projects: path.join(pagesDir, 'projects.md'),
    about: path.join(pagesDir, 'about.md'),
  };

  let context = "";
  const errors = [];

  // Read static files
  for (const [key, filePath] of Object.entries(staticFilePaths)) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      context += `\n\n--- Content from ${key} ---\n\n${content}`;
    } catch (error) {
      console.error(`Error reading static file ${filePath}:`, error.message);
      errors.push(`Could not read content for ${key}.`);
    }
  }

  // Read blog posts
  try {
    const postFiles = await fs.readdir(postsDir);
    context += `\n\n--- Blog Posts ---`;
    for (const filename of postFiles) {
      if (filename.endsWith('.md')) {
        const filePath = path.join(postsDir, filename);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          context += `\n\n--- Blog Post: ${filename} ---\n\n${content}`;
        } catch (error) {
          console.error(`Error reading blog post ${filePath}:`, error.message);
          errors.push(`Could not read blog post ${filename}.`);
        }
      }
    }
  } catch (error) {
      console.error(`Error reading posts directory ${postsDir}:`, error.message);
      errors.push(`Could not read blog posts directory.`);
  }

  if (!context && errors.length > 0) {
      throw new Error("Could not read any website content files.");
  }

  return context.trim();
}

// --- Gatsby Server-Side API Handler ---
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Check Method and API Key
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  if (!apiKey) {
    console.error('GOOGLE_AI_API_KEY is not set in the environment.');
    return res.status(500).json({ error: 'AI service not configured.' });
  }

  // 2. Get User Question from Request Body
  const { question } = req.body;
  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'Invalid question provided.' });
  }

  try {
    // 3. Initialize AI Client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // 4. Get Website Content
    const websiteContext = await getWebsiteContext();

    // 5. Construct Prompt
    const prompt = `You are a helpful assistant knowledgeable about Sumit Agrawal based *only* on the provided website content.
Answer the following user question strictly based on the information given below.
Do not make assumptions or use external knowledge. If the answer is not found in the text, say so.

--- WEBSITE CONTENT START ---
${websiteContext}
--- WEBSITE CONTENT END ---

User Question: ${question}

Answer:`;

    // 6. Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 7. Return Response
    return res.status(200).json({ answer: text.trim() });

  } catch (error) {
    console.error('Error processing chatbot request:', error);
    let errorMessage = 'An error occurred while processing your request.';
    if (error.message.includes('Could not read any website content files')) {
        errorMessage = 'Error reading website content on the server.';
    } else if (error.message.includes('generateContent')) {
        errorMessage = 'Error communicating with the AI service.';
    }
    return res.status(500).json({ error: errorMessage });
  }
} 