import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useStaticQuery, graphql } from 'gatsby';
import * as styles from './ChatbotWidget.module.css'; // We'll create this CSS module next
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi'; // Example icons

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! Ask me anything about Sumit based on this website's content." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // To scroll to bottom

  // Get website content using Gatsby's GraphQL
  const data = useStaticQuery(graphql`
    query ChatbotContentQuery {
      allMarkdownRemark {
        nodes {
          fields {
            slug
            sourceInstanceName
          }
          rawMarkdownBody
          frontmatter {
            title
          }
        }
      }
    }
  `);

  // Process and format website content
  const websiteContent = React.useMemo(() => {
    let content = '';
    
    data.allMarkdownRemark.nodes.forEach(node => {
      const { slug, sourceInstanceName } = node.fields;
      const title = node.frontmatter?.title || slug;
      const body = node.rawMarkdownBody;
      
      content += `\n\n--- ${sourceInstanceName}/${slug} (${title}) ---\n\n${body}`;
    });
    
    return content || 'Website content not available.';
  }, [data]);

  // Initialize Google AI
  const genAI = process.env.GATSBY_GOOGLE_AI_API_KEY 
    ? new GoogleGenerativeAI(process.env.GATSBY_GOOGLE_AI_API_KEY)
    : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]); // Scroll when messages change or widget opens

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
        // Reset messages if reopening after closing (optional)
        // setMessages([{ sender: 'ai', text: "Hi! Ask me anything..." }]);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage || isLoading) return;

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!genAI) {
        throw new Error('AI service not configured. Please set GATSBY_GOOGLE_AI_API_KEY environment variable.');
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const prompt = `You are a helpful assistant knowledgeable about Sumit Agrawal based *only* on the provided website content.
Answer the following user question strictly based on the information given below.
Do not make assumptions or use external knowledge. If the answer is not found in the text, say so.
Be friendly and conversational in your responses.

--- WEBSITE CONTENT START ---
${websiteContent}
--- WEBSITE CONTENT END ---

User Question: ${userMessage}

Answer:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { sender: 'ai', text: text.trim() }]);

    } catch (error) {
      console.error("Chatbot error:", error);
      let errorMessage = "Sorry, I encountered an error. ";
      
      if (error.message.includes('not configured')) {
        errorMessage += "The AI service is not properly configured.";
      } else if (error.message.includes('API key')) {
        errorMessage += "Please check the API key configuration.";
      } else if (error.message.includes('quota')) {
        errorMessage += "API quota exceeded. Please try again later.";
      } else {
        errorMessage += "Please try again later.";
      }
      
      setMessages(prev => [...prev, { sender: 'ai', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span>Ask Sumit's AI Assistant</span>
            <button onClick={toggleOpen} className={styles.closeButton} aria-label="Close chat">
              <FiX />
            </button>
          </div>
          <div className={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.ai} ${styles.loading}`}>
                <span>.</span><span>.</span><span>.</span> {/* Simple loading indicator */}
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Target for scrolling */}          </div>
          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask a question..."
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
              <FiSend />
            </button>
          </form>
        </div>
      )}
      <button onClick={toggleOpen} className={styles.toggleButton} aria-label={isOpen ? "Close chat" : "Open chat"}>
        {isOpen ? <FiX /> : <FiMessageSquare />}
      </button>
    </div>
  );
};

export default ChatbotWidget; 