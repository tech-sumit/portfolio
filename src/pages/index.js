import React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Layout from "../components/Layout";
// import Seo from "../components/seo"; // Optional: Import SEO component if you have one

const IndexPage = () => {
  return (
    <Layout>
      {/* Optional: Add SEO component here <Seo title="Home" /> */}
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
          <div className="logo-background-fixed">
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
              color: 'var(--accent-primary)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
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
            fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome to<br />
            <span style={{ 
              color: 'var(--accent-primary)',
              WebkitTextFillColor: 'var(--accent-primary)'
            }}>
              Sumit Agrawal's
            </span><br />
            Portfolio
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
          
          <nav style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'flex-start'
          }}>
            <Link to="/about" style={{ 
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}>
              About Me
            </Link>
            <Link to="/projects" style={{ 
              padding: '0.75rem 1.5rem',
              border: '2px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>
              Projects
            </Link>
            <Link to="/skills" style={{ 
              padding: '0.75rem 1.5rem',
              border: '2px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>
              Skills
            </Link>
            <Link to="/experience" style={{ 
              padding: '0.75rem 1.5rem',
              border: '2px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>
              Experience
            </Link>
            <Link to="/blog" style={{ 
              padding: '0.75rem 1.5rem',
              border: '2px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>
              Blog
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Google Fonts and responsive styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
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
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(300%) translateY(300%) rotate(45deg);
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
        
        /* Animated gradient background - Pink to Blue */
        .logo-background-fixed::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%);
          background: -moz-linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%);
          background: -webkit-linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%);
          border-radius: 50%;
          animation: rotateGradient 8s linear infinite;
          z-index: -2;
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
        
        /* Light theme - Same pink to blue gradient */
        body.light-theme .logo-background-fixed::before {
          background: linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%);
          background: -moz-linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%);
          background: -webkit-linear-gradient(90deg, hsla(332, 57%, 69%, 1) 0%, hsla(208, 90%, 88%, 1) 100%);
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

// Optional: If you want to keep the Head API for SEO
// export const Head = () => <Seo title="Home" />
