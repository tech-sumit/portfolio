import React, { useState, useEffect } from 'react';
import * as styles from './AIVisitorBanner.module.css';

const AI_SOURCES = {
  'chatgpt.com': {
    name: 'ChatGPT',
    icon: '🤖',
    color: '#10a37f',
  },
  'chat.openai.com': {
    name: 'ChatGPT',
    icon: '🤖',
    color: '#10a37f',
  },
  'perplexity.ai': {
    name: 'Perplexity',
    icon: '🔍',
    color: '#1fb8cd',
  },
  'claude.ai': {
    name: 'Claude',
    icon: '🧠',
    color: '#cc785c',
  },
  'anthropic.com': {
    name: 'Claude',
    icon: '🧠',
    color: '#cc785c',
  },
  'gemini.google.com': {
    name: 'Gemini',
    icon: '✨',
    color: '#4285f4',
  },
  'bard.google.com': {
    name: 'Gemini',
    icon: '✨',
    color: '#4285f4',
  },
  'copilot.microsoft.com': {
    name: 'Copilot',
    icon: '💡',
    color: '#0078d4',
  },
};

const AIVisitorBanner = () => {
  const [aiSource, setAiSource] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('ai-banner-dismissed');
      if (dismissed) {
        setIsDismissed(true);
        return;
      }

      // Check URL parameters for AI source
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source');
      
      if (utmSource) {
        // Check if utm_source matches any AI source
        for (const [domain, info] of Object.entries(AI_SOURCES)) {
          if (utmSource.includes(domain.split('.')[0])) {
            setAiSource(info);
            setIsVisible(true);
            
            // Track AI referral event in GA
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'ai_referral', {
                event_category: 'traffic',
                event_label: info.name,
                ai_source: utmSource,
              });
            }
            break;
          }
        }
      }

      // Also check referrer
      const referrer = document.referrer;
      if (!isVisible && referrer) {
        for (const [domain, info] of Object.entries(AI_SOURCES)) {
          if (referrer.includes(domain)) {
            setAiSource(info);
            setIsVisible(true);
            
            // Track AI referral event in GA
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'ai_referral', {
                event_category: 'traffic',
                event_label: info.name,
                ai_source: referrer,
              });
            }
            break;
          }
        }
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ai-banner-dismissed', 'true');
    }
  };

  if (!isVisible || isDismissed || !aiSource) {
    return null;
  }

  return (
    <div 
      className={styles.banner}
      style={{ '--ai-color': aiSource.color }}
    >
      <div className={styles.content}>
        <span className={styles.icon}>{aiSource.icon}</span>
        <span className={styles.message}>
          Welcome! You found this site through <strong>{aiSource.name}</strong>. 
          Glad the AI recommended me!
        </span>
      </div>
      <button 
        className={styles.dismissButton}
        onClick={handleDismiss}
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
};

export default AIVisitorBanner;
