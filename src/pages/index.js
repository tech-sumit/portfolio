import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import { useGradient } from '../context/GradientContext';

const IndexPage = () => {
  const { selectedGradient, isLoading } = useGradient();

  if (isLoading || !selectedGradient) {
    return <Layout><div>Loading...</div></Layout>;
  }
  return (
    <Layout>
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
          <div className="logo-background-fixed" style={{
            position: 'relative'
          }}>
            {/* Dynamic gradient background */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: selectedGradient?.gradient || 'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #667eea 100%)',
              borderRadius: '50%',
              animation: 'rotateGradient 8s linear infinite',
              zIndex: -2
            }} />
            <StaticImage
              src="../images/logo.png"
              alt="Sumit Agrawal Portfolio"
              placeholder="blurred"
              layout="constrained"
              width={550}
              height={550}
              style={{ 
                borderRadius: '50%',
                filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))'
              }}
            />
          </div>
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
              Portfolio
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
              Welcome to
            </span><br />
            <span style={{
              background: selectedGradient?.textGradient || 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: selectedGradient?.colors?.[1] || '#f093fb' // Fallback color
            }}>
              Sumit Agrawal's
            </span><br />
            <span style={{
              background: selectedGradient?.textGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: selectedGradient?.colors?.[0] || '#667eea' // Fallback color
            }}>
              Portfolio
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
            Building innovative digital solutions.
          </p>
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '4rem',
            color: 'var(--text-tertiary)',
            textAlign: 'left',
            fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            lineHeight: '1.5'
          }}>
            Explore my work and get in touch to see how we can create something amazing together.
          </p>
          

        </div>
      </div>
      
      {/* Dynamic styles with gradient */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        /* Button hover effects */
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          filter: brightness(1.1) contrast(1.1) saturate(1.2) !important;
        }
        
        .btn-primary:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-width: 2px !important;
        }
        
        /* Keyframe animations for rotating gradient */
        @keyframes rotateGradient {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes lensFlare {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.2);
          }
        }
        
        /* Logo background with animated gradients and lens effects */
        .logo-background-fixed {
          position: relative !important;
          box-shadow: 
            0 30px 60px rgba(88, 28, 135, 0.3),
            0 15px 40px rgba(124, 58, 237, 0.25),
            0 0 50px rgba(139, 92, 246, 0.2);
          border-radius: 50% !important;
          padding: 2.5rem !important;
          isolation: isolate !important;
          backdrop-filter: blur(15px);
          overflow: hidden;
        }
        
        /* Enhanced lens flare effect for glass-like appearance */
        .logo-background-fixed::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            /* Main top-left highlight */
            radial-gradient(
              ellipse 45% 35% at 30% 25%,
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 255, 255, 0.3) 40%,
              transparent 80%
            ),
            /* Secondary bottom-right reflection */
            radial-gradient(
              ellipse 30% 25% at 70% 70%,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 255, 255, 0.15) 50%,
              transparent 90%
            ),
            /* Subtle rim light */
            radial-gradient(
              ellipse 100% 100% at 50% 50%,
              transparent 85%,
              rgba(255, 255, 255, 0.1) 95%,
              transparent 100%
            );
          border-radius: 50%;
          animation: lensFlare 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        
        /* Light theme gradient styling */
        body.light-theme .logo-background-fixed {
          box-shadow: 
            0 30px 60px rgba(139, 92, 246, 0.15),
            0 15px 40px rgba(124, 58, 237, 0.2),
            0 0 50px rgba(168, 162, 255, 0.2);
        }
        
        /* Light theme - Enhanced lens effects */
        body.light-theme .logo-background-fixed::after {
          background: 
            /* Main top-left highlight - brighter for light theme */
            radial-gradient(
              ellipse 45% 35% at 30% 25%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.4) 40%,
              transparent 80%
            ),
            /* Secondary bottom-right reflection */
            radial-gradient(
              ellipse 30% 25% at 70% 70%,
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 255, 255, 0.2) 50%,
              transparent 90%
            ),
            /* Subtle rim light */
            radial-gradient(
              ellipse 100% 100% at 50% 50%,
              transparent 85%,
              rgba(255, 255, 255, 0.15) 95%,
              transparent 100%
            );
        }
        
        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column !important;
            text-align: center !important;
            padding: 1rem !important;
            min-height: 100vh !important;
            gap: 2rem !important;
          }
          .image-container {
            flex: none !important;
            margin-bottom: 2rem !important;
          }
          .image-container > div {
            padding: 1rem !important;
          }
          .content-container {
            padding-left: 0 !important;
          }
          .content-container h1 {
            font-size: 2.5rem !important;
            text-align: center !important;
            margin-bottom: 1.5rem !important;
          }
          .content-container p {
            text-align: center !important;
            font-size: 1.2rem !important;
          }
          .nav-container {
            justify-content: center !important;
          }
        }
        
        @media (max-width: 480px) {
          .content-container h1 {
            font-size: 2rem !important;
          }
          .content-container p {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default IndexPage;
