import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises'; // Use promises version of fs
import path from 'path';

// --- Configuration ---
// Ensure the API key is loaded from environment variables server-side
// IMPORTANT: Set GOOGLE_AI_API_KEY in your hosting environment (Netlify, Vercel, etc.)
const apiKey = process.env.GOOGLE_AI_API_KEY;
const modelName = "gemini-1.5-flash-latest"; // Or another suitable model

// --- Helper Function to read Markdown Files ---
async function getWebsiteContext() {
  const contentDir = path.resolve(process.cwd(), 'src/content');
  const resumeDir = path.join(contentDir, 'resume');
  const pagesDir = path.join(contentDir, 'pages');
  const postsDir = path.join(contentDir, 'posts'); // Define posts directory

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
          // Optional: Extract title from frontmatter if needed, for now just add content
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
      // Decide if failure to read the posts dir is critical
  }


  if (!context && errors.length > 0) {
      // Check if context is still empty even after trying all reads
      throw new Error("Could not read any website content files.");
  }

  console.log("Website context length (including blogs):", context.length); // Log context length

  return context.trim();
}


// --- Main Handler Function (Gatsby Convention) ---
export default async function handler(req, res) {
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
    // Basic prompt - can be refined significantly
    const prompt = `You are a helpful assistant knowledgeable about Sumit Agrawal based *only* on the provided website content.
Answer the following user question strictly based on the information given below.
Do not make assumptions or use external knowledge. If the answer is not found in the text, say so.

--- WEBSITE CONTENT START ---
${websiteContext}
--- WEBSITE CONTENT END ---

User Question: ${question}

Answer:`;

    // 6. Call Gemini API
    console.log("Sending request to Gemini API..."); // Server-side log
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Received response from Gemini API."); // Server-side log

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
    // Consider more specific error handling based on potential API errors
    return res.status(500).json({ error: errorMessage });
  }
} 