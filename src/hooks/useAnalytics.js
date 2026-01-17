import { useEffect, useCallback, useRef } from 'react';

/**
 * Enhanced analytics hook for comprehensive user tracking
 * Automatically captures: all clicks, scroll depth, time on page, referrer data, chat events
 * No manual event tracking needed - everything is captured automatically
 */
export const useAnalytics = () => {
  const startTimeRef = useRef(Date.now());
  const trackedScrollRef = useRef(new Set());
  const trackedTimeRef = useRef(new Set());

  // Helper to safely call gtag
  const trackEvent = useCallback((eventName, params = {}) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...params,
        page_path: window.location.pathname,
        page_title: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  // Get element identifier for tracking
  const getElementIdentifier = useCallback((element) => {
    // Priority: data-track > aria-label > id > text content > tag
    const trackName = element.getAttribute('data-track');
    if (trackName) return trackName;

    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const id = element.id;
    if (id) return id;

    const text = element.textContent?.trim().slice(0, 50);
    if (text) return text;

    return element.tagName.toLowerCase();
  }, []);

  // Get element location (navbar, footer, main, etc.)
  const getElementLocation = useCallback((element) => {
    const header = element.closest('header, nav, [role="navigation"]');
    if (header) return 'navbar';

    const footer = element.closest('footer');
    if (footer) return 'footer';

    const sidebar = element.closest('aside, [role="complementary"]');
    if (sidebar) return 'sidebar';

    const modal = element.closest('[role="dialog"], .modal');
    if (modal) return 'modal';

    const chatWidget = element.closest('[class*="chatbot"], [class*="chat-widget"]');
    if (chatWidget) return 'chat_widget';

    return 'main_content';
  }, []);

  // Track ALL clicks - links, buttons, and interactive elements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e) => {
      const target = e.target;
      
      // Find the clickable element
      const link = target.closest('a');
      const button = target.closest('button, [role="button"]');
      const clickable = link || button;

      if (!clickable) return;

      const elementType = link ? 'link' : 'button';
      const elementName = getElementIdentifier(clickable);
      const location = getElementLocation(clickable);
      const href = link?.getAttribute('href') || '';

      // Determine if external
      const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
      const isInternal = href.startsWith('/') || href.includes(window.location.hostname);
      const isAnchor = href.startsWith('#');
      const isMail = href.startsWith('mailto:');
      const isPhone = href.startsWith('tel:');

      // Classify click type
      let clickType = 'button';
      if (isExternal) clickType = 'external_link';
      else if (isInternal) clickType = 'internal_link';
      else if (isAnchor) clickType = 'anchor_link';
      else if (isMail) clickType = 'email_link';
      else if (isPhone) clickType = 'phone_link';

      // Track the click
      trackEvent('click', {
        event_category: 'interaction',
        event_label: elementName,
        element_type: elementType,
        click_type: clickType,
        location: location,
        href: href || undefined,
        link_domain: isExternal ? new URL(href).hostname : undefined,
      });

      // Additional specific event for navbar clicks
      if (location === 'navbar') {
        trackEvent('navbar_click', {
          event_category: 'navigation',
          event_label: elementName,
          destination: href || 'action',
        });
      }

      // Track external links separately for easy filtering
      if (isExternal) {
        trackEvent('outbound_click', {
          event_category: 'outbound',
          event_label: href,
          link_url: href,
          link_domain: new URL(href).hostname,
        });
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [trackEvent, getElementIdentifier, getElementLocation]);

  // Track chat widget open/close
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use MutationObserver to detect chat widget state changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          const classList = target.className;
          
          // Detect chat widget visibility changes
          if (classList.includes('chat') || classList.includes('widget')) {
            const isOpen = classList.includes('open') || classList.includes('visible') || classList.includes('active');
            trackEvent('chat_widget', {
              event_category: 'engagement',
              event_label: isOpen ? 'opened' : 'closed',
              action: isOpen ? 'open' : 'close',
            });
          }
        }

        // Track when chat elements are added/removed
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && (node.className?.includes?.('chat') || node.className?.includes?.('widget'))) {
              trackEvent('chat_widget', {
                event_category: 'engagement',
                event_label: 'opened',
                action: 'open',
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [trackEvent]);

  // Track scroll depth (25%, 50%, 75%, 100%)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scrollThresholds = [25, 50, 75, 100];

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      scrollThresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !trackedScrollRef.current.has(threshold)) {
          trackedScrollRef.current.add(threshold);
          trackEvent('scroll_depth', {
            event_category: 'engagement',
            event_label: `${threshold}%`,
            value: threshold,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);

  // Track time on page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeThresholds = [30, 60, 120, 300]; // seconds

    const checkTime = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      timeThresholds.forEach((threshold) => {
        if (elapsedSeconds >= threshold && !trackedTimeRef.current.has(threshold)) {
          trackedTimeRef.current.add(threshold);
          trackEvent('time_on_page', {
            event_category: 'engagement',
            event_label: `${threshold}s`,
            value: threshold,
          });
        }
      });
    };

    const interval = setInterval(checkTime, 5000);
    
    // Track total time when leaving
    const handleUnload = () => {
      const totalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      trackEvent('page_exit', {
        event_category: 'engagement',
        event_label: 'total_time',
        value: totalTime,
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [trackEvent]);

  // Track page view on mount (for SPA navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    trackEvent('page_view', {
      event_category: 'navigation',
      event_label: window.location.pathname,
      referrer: document.referrer || 'direct',
    });

    // Reset scroll and time tracking for new page
    trackedScrollRef.current = new Set();
    trackedTimeRef.current = new Set();
    startTimeRef.current = Date.now();
  }, [trackEvent]);

  // Track referrer and UTM params on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const referrer = document.referrer;

    // Capture all UTM parameters
    const utmParams = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content'),
    };

    // Filter out null values
    const activeUtmParams = Object.fromEntries(
      Object.entries(utmParams).filter(([, v]) => v !== null)
    );

    // Track session start with full context
    if (Object.keys(activeUtmParams).length > 0 || referrer) {
      trackEvent('session_start', {
        event_category: 'acquisition',
        referrer: referrer || 'direct',
        referrer_domain: referrer ? new URL(referrer).hostname : 'direct',
        landing_page: window.location.pathname,
        ...activeUtmParams,
      });
    }

    // Detect AI referrals specifically
    const aiSources = ['chatgpt', 'perplexity', 'claude', 'gemini', 'copilot', 'openai', 'anthropic'];
    const source = params.get('utm_source') || '';
    const isAiReferral = aiSources.some(ai => 
      source.toLowerCase().includes(ai) || 
      referrer.toLowerCase().includes(ai)
    );

    if (isAiReferral) {
      trackEvent('ai_referral', {
        event_category: 'ai_traffic',
        event_label: source || new URL(referrer).hostname,
        ai_source: source || referrer,
        landing_page: window.location.pathname,
      });
    }
  }, [trackEvent]);

  // Track visibility changes (tab switching)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      trackEvent('visibility_change', {
        event_category: 'engagement',
        event_label: document.hidden ? 'tab_hidden' : 'tab_visible',
        action: document.hidden ? 'hide' : 'show',
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackEvent]);

  // Track form interactions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFocus = (e) => {
      const input = e.target;
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(input.tagName)) return;

      trackEvent('form_focus', {
        event_category: 'form',
        event_label: input.name || input.id || input.placeholder || 'unnamed_field',
        field_type: input.type || input.tagName.toLowerCase(),
      });
    };

    const handleSubmit = (e) => {
      const form = e.target;
      if (form.tagName !== 'FORM') return;

      trackEvent('form_submit', {
        event_category: 'form',
        event_label: form.name || form.id || 'unnamed_form',
        form_action: form.action,
      });
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('submit', handleSubmit);
    
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [trackEvent]);

  return { trackEvent };
};

/**
 * Track specific user actions manually (rarely needed now)
 */
export const trackCustomEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  }
};

export default useAnalytics;
