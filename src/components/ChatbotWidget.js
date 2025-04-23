import React, { useState, useRef, useEffect } from 'react';
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
      const response = await fetch('/api/ask-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);

    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: `Sorry, I encountered an error: ${error.message}` }]);
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