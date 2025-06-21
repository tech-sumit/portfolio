import React from 'react';
import { useGradient } from '../context/GradientContext';

const GradientText = ({ 
  children, 
  as: Component = 'span',
  fontSize = '2.5rem', 
  fontWeight = '800',
  textAlign = 'center',
  marginBottom = '1rem',
  style = {} 
}) => {
  const { selectedGradient } = useGradient();

  const gradientStyle = {
    fontSize,
    fontWeight,
    textAlign,
    marginBottom,
    background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: selectedGradient?.colors?.[0] || '#667eea', // Fallback color
    fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    ...style
  };

  return (
    <Component style={gradientStyle}>
      {children}
    </Component>
  );
};

export default GradientText; 