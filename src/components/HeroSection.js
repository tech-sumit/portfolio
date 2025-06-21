import React from 'react';
import { useGradient } from '../context/GradientContext';

const HeroSection = ({ 
  imageComponent, 
  subtitle, 
  title, 
  description, 
  additionalDescription
}) => {
  const { selectedGradient } = useGradient();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      minHeight: '90vh',
      padding: '2rem',
      gap: '4rem'
    }}>
      {/* Left side - Image (45% of screen) */}
      <div style={{ 
        flex: '0 0 45%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        {imageComponent}
      </div>
      
      {/* Right side - Content (55% of screen) */}
      <div style={{ 
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '3rem'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: selectedGradient?.colors?.[0] || '#667eea' // Fallback color
          }}>
            {subtitle}
          </span>
        </div>
        <h1 style={{ 
          fontSize: '4.5rem', 
          marginBottom: '2rem',
          fontWeight: '900',
          textAlign: 'left',
          lineHeight: '1.1',
          fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }}>
          <span style={{
            background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: selectedGradient?.colors?.[0] || '#667eea' // Fallback color
          }}>
            {title}
          </span>
        </h1>
        <p style={{ 
          fontSize: '1.6rem', 
          marginBottom: '1.5rem',
          color: 'var(--text-secondary)',
          textAlign: 'left',
          fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          {description}
        </p>
        {additionalDescription && (
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '4rem',
            color: 'var(--text-tertiary)',
            textAlign: 'left',
            fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            lineHeight: '1.5'
          }}>
            {additionalDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroSection; 