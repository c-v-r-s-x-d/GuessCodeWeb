import React, { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 15;
      const y = (e.clientY / window.innerHeight) * 15;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-all duration-500
      ${theme === 'dark' ? 'grayscale' : ''}`}>
      {/* Background with parallax effect */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url("/home.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
          transition: 'transform 0.2s ease-out',
          width: '100vw',
          height: '100vh',
        }}
      />

      {/* Dark overlay */}
      <div className={`fixed inset-0 -z-10 transition-colors duration-200
        ${theme === 'dark' ? 'bg-black/70' : 'bg-black/40'}`} 
      />

      {/* Content */}
      <div className="flex-grow flex flex-col z-10">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
} 