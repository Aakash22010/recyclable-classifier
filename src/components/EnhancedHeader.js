// src/components/EnhancedHeader.js - UPDATED
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Recycle, Leaf, Zap, Earth, Menu } from 'lucide-react';

const EnhancedHeader = ({ isMobile, isTablet, onMobileMenuToggle }) => {
  const [currentTip, setCurrentTip] = useState(0);
  
  const ecoTips = [
    "Recycling one aluminum can saves enough energy to run a TV for 3 hours!",
    "Glass can be recycled endlessly without loss in quality",
    "Plastic recycling saves twice as much energy as burning it",
    "Paper recycling saves trees and reduces water consumption"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % ecoTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header 
      className={`enhanced-header ${isMobile ? 'mobile-header' : ''} ${isTablet ? 'tablet-header' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="header-background">
        <div className="header-pattern"></div>
        <div className="header-glow"></div>
      </div>
      
      <div className="creative-container">
        <motion.div 
          className={`header-main ${isMobile ? 'mobile-header-main' : ''}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="logo-container">
            {isMobile && (
              <button 
                className="mobile-menu-btn"
                onClick={onMobileMenuToggle}
              >
                <Menu size={24} />
              </button>
            )}
            <motion.div 
              className="logo-orb"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Recycle className="logo-icon" />
            </motion.div>
            <div className="logo-text">
              <h1 className={isMobile ? 'mobile-logo' : ''}>EcoClassify</h1>
              {!isMobile && <p>AI Material Recognition</p>}
            </div>
          </div>

          {!isMobile && (
            <motion.div 
              className={`eco-stats ${isTablet ? 'tablet-stats' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="stat-item">
                <Zap size={20} />
                <span>Fast Analysis</span>
              </div>
              <div className="stat-item">
                <Leaf size={20} />
                <span>Eco-Friendly</span>
              </div>
              <div className="stat-item">
                <Earth size={20} />
                <span>Planet Positive</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {!isMobile && (
          <motion.div 
            className="eco-tips-carousel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="tip-icon">💡</div>
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {ecoTips[currentTip]}
            </motion.p>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default EnhancedHeader;