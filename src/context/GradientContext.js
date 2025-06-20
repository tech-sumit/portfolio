import React, { createContext, useContext, useState, useEffect } from 'react';

// Beautiful gradient combinations from Coolors.co
const gradientCombinations = [
  // Pink to Blue
  {
    name: 'Pink to Blue',
    gradient: 'linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%)',
    colors: ['#dd83ad', '#c3e1fc'],
    textGradient: 'linear-gradient(45deg, #dd83ad, #c3e1fc)',
    cssVars: {
      '--gradient-primary': '#dd83ad',
      '--gradient-secondary': '#c3e1fc',
      '--gradient-bg': 'linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%)',
      '--gradient-text': 'linear-gradient(45deg, #dd83ad, #c3e1fc)'
    }
  },
  // Purple to Pink
  {
    name: 'Purple to Pink',
    gradient: 'linear-gradient(90deg, hsla(266, 100%, 75%, 1) 0%, hsla(320, 100%, 85%, 1) 100%)',
    colors: ['#b366ff', '#ffb3e6'],
    textGradient: 'linear-gradient(45deg, #b366ff, #ffb3e6)',
    cssVars: {
      '--gradient-primary': '#b366ff',
      '--gradient-secondary': '#ffb3e6',
      '--gradient-bg': 'linear-gradient(90deg, hsla(266, 100%, 75%, 1) 0%, hsla(320, 100%, 85%, 1) 100%)',
      '--gradient-text': 'linear-gradient(45deg, #b366ff, #ffb3e6)'
    }
  },
  // Blue to Cyan
  {
    name: 'Blue to Cyan',
    gradient: 'linear-gradient(90deg, hsla(220, 100%, 70%, 1) 0%, hsla(180, 100%, 80%, 1) 100%)',
    colors: ['#4d94ff', '#66ffff'],
    textGradient: 'linear-gradient(45deg, #4d94ff, #66ffff)',
    cssVars: {
      '--gradient-primary': '#4d94ff',
      '--gradient-secondary': '#66ffff',
      '--gradient-bg': 'linear-gradient(90deg, hsla(220, 100%, 70%, 1) 0%, hsla(180, 100%, 80%, 1) 100%)',
      '--gradient-text': 'linear-gradient(45deg, #4d94ff, #66ffff)'
    }
  },
  // Orange to Pink
  {
    name: 'Orange to Pink',
    gradient: 'linear-gradient(90deg, hsla(25, 100%, 70%, 1) 0%, hsla(340, 100%, 75%, 1) 100%)',
    colors: ['#ff8533', '#ff4d94'],
    textGradient: 'linear-gradient(45deg, #ff8533, #ff4d94)',
    cssVars: {
      '--gradient-primary': '#ff8533',
      '--gradient-secondary': '#ff4d94',
      '--gradient-bg': 'linear-gradient(90deg, hsla(25, 100%, 70%, 1) 0%, hsla(340, 100%, 75%, 1) 100%)',
      '--gradient-text': 'linear-gradient(45deg, #ff8533, #ff4d94)'
    }
  },
  // Green to Blue
  {
    name: 'Green to Blue',
    gradient: 'linear-gradient(90deg, hsla(160, 70%, 60%, 1) 0%, hsla(220, 80%, 70%, 1) 100%)',
    colors: ['#4dd9a6', '#5c85ff'],
    textGradient: 'linear-gradient(45deg, #4dd9a6, #5c85ff)',
    cssVars: {
      '--gradient-primary': '#4dd9a6',
      '--gradient-secondary': '#5c85ff',
      '--gradient-bg': 'linear-gradient(90deg, hsla(160, 70%, 60%, 1) 0%, hsla(220, 80%, 70%, 1) 100%)',
      '--gradient-text': 'linear-gradient(45deg, #4dd9a6, #5c85ff)'
    }
  },
  // Yellow to Orange
  {
    name: 'Yellow to Orange',
    gradient: 'linear-gradient(90deg, hsla(50, 100%, 70%, 1) 0%, hsla(20, 100%, 65%, 1) 100%)',
    colors: ['#ffdb33', '#ff6633'],
    textGradient: 'linear-gradient(45deg, #ffdb33, #ff6633)',
    cssVars: {
      '--gradient-primary': '#ffdb33',
      '--gradient-secondary': '#ff6633',
      '--gradient-bg': 'linear-gradient(90deg, hsla(50, 100%, 70%, 1) 0%, hsla(20, 100%, 65%, 1) 100%)',
      '--gradient-text': 'linear-gradient(45deg, #ffdb33, #ff6633)'
    }
  },
  // Teal to Purple
  {
    name: 'Teal to Purple',
    gradient: 'linear-gradient(90deg, hsla(180, 60%, 60%, 1) 0%, hsla(280, 70%, 65%, 1) 100%)',
    colors: ['#4dc7c7', '#b366d9'],
    textGradient: 'linear-gradient(45deg, #4dc7c7, #b366d9)',
    cssVars: {
      '--gradient-primary': '#4dc7c7',
      '--gradient-secondary': '#b366d9',
      '--gradient-bg': 'linear-gradient(90deg, hsla(180, 60%, 60%, 1) 0%, hsla(280, 70%, 65%, 1) 100%)',
      '--gradient-text': 'linear-gradient(45deg, #4dc7c7, #b366d9)'
    }
  },
  // Red to Orange
  {
    name: 'Red to Orange',
    gradient: 'linear-gradient(90deg, hsla(350, 80%, 65%, 1) 0%, hsla(30, 90%, 70%, 1) 100%)',
    colors: ['#e6527a', '#ff9966'],
    textGradient: 'linear-gradient(45deg, #e6527a, #ff9966)',
    cssVars: {
      '--gradient-primary': '#e6527a',
      '--gradient-secondary': '#ff9966',
      '--gradient-bg': 'linear-gradient(90deg, hsla(350, 80%, 65%, 1) 0%, hsla(30, 90%, 70%, 1) 100%)',
      '--gradient-text': 'linear-gradient(45deg, #e6527a, #ff9966)'
    }
  }
];

const GradientContext = createContext();

export const GradientProvider = ({ children }) => {
  // Initialize with a random gradient immediately
  const [selectedGradient, setSelectedGradient] = useState(() => {
    const randomIndex = Math.floor(Math.random() * gradientCombinations.length);
    return gradientCombinations[randomIndex];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Apply CSS variables to document root immediately
    if (typeof window !== 'undefined' && selectedGradient) {
      const root = document.documentElement;
      Object.entries(selectedGradient.cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
    
    setIsLoading(false);
  }, [selectedGradient]);

  const changeGradient = (index) => {
    if (index >= 0 && index < gradientCombinations.length) {
      const gradient = gradientCombinations[index];
      setSelectedGradient(gradient);
      
      // Update CSS variables
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        Object.entries(gradient.cssVars).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
      }
    }
  };

  const randomizeGradient = () => {
    const randomIndex = Math.floor(Math.random() * gradientCombinations.length);
    changeGradient(randomIndex);
  };

  const value = {
    selectedGradient,
    gradientCombinations,
    changeGradient,
    randomizeGradient,
    isLoading
  };

  return (
    <GradientContext.Provider value={value}>
      {children}
    </GradientContext.Provider>
  );
};

export const useGradient = () => {
  const context = useContext(GradientContext);
  if (!context) {
    throw new Error('useGradient must be used within a GradientProvider');
  }
  return context;
};

export default GradientContext; 