import { useState, useEffect } from 'react';

export const useScrollHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Much lower threshold to trigger sooner
      const threshold = 80; // Fixed threshold of 80px
      
      // Add hysteresis to prevent jumping
      if (!isScrolled && scrollTop > threshold) {
        setIsScrolled(true);
      } else if (isScrolled && scrollTop < threshold - 30) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return isScrolled;
}; 