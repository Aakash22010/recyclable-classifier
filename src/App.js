// src/App.js - ENHANCED WITH RESPONSIVE HOOKS
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import EnhancedHeader from './components/EnhancedHeader';
import CreativeUpload from './components/CreativeUpload';
import InteractiveWebcam from './components/InteractiveWebcam';
import AnimatedResults from './components/AnimatedResults';
import LoadingAnimation from './components/LoadingAnimation';
import AnimatedBackground from './components/creative/AnimatedBackground';
import FloatingParticles from './components/creative/FloatingParticles';
import { Recycle, Sparkles, Menu, X } from 'lucide-react';
import './styles/CreativeApp.css';
import './styles/SmoothAnimations.css';
import './styles/Responsive.css';

// Custom hook for responsive design
const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      // Determine device type
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width >= 768 && width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  };
};

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const shouldReduceMotion = useReducedMotion();

  // Memoized handlers
  const handlePredictions = useCallback((data) => {
    setPredictions(data);
    setError(null);
    const topConfidence = Math.max(...data.map(p => p.confidence));
    if (topConfidence > 0.85) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, []);

  const handleLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  const handleError = useCallback((errorMsg) => {
    setError(errorMsg);
    setPredictions(null);
  }, []);

  const resetResults = useCallback(() => {
    setPredictions(null);
    setSelectedImage(null);
    setError(null);
    setShowCelebration(false);
  }, []);

  const handleTabSwitch = useCallback((tab) => {
    setActiveTab(tab);
    resetResults();
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [resetResults, isMobile]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Memoized tab content
  const tabContent = useMemo(() => {
    return activeTab === 'upload' ? (
      <CreativeUpload
        onPredictions={handlePredictions}
        onLoading={handleLoading}
        onError={handleError}
        onImageSelect={setSelectedImage}
        resetResults={resetResults}
        isMobile={isMobile}
        isTablet={isTablet}
      />
    ) : (
      <InteractiveWebcam
        onPredictions={handlePredictions}
        onLoading={handleLoading}
        onError={handleError}
        onImageSelect={setSelectedImage}
        resetResults={resetResults}
        isMobile={isMobile}
        isTablet={isTablet}
      />
    );
  }, [activeTab, handlePredictions, handleLoading, handleError, resetResults, isMobile, isTablet]);

  return (
    <motion.div 
      className={`creative-app smooth-scrollbar ${isMobile ? 'mobile-view' : ''} ${isTablet ? 'tablet-view' : ''}`}
      initial="initial"
      animate="in"
      exit="out"
      variants={shouldReduceMotion ? {} : {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
        out: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.55, 0.085, 0.68, 0.53] } }
      }}
    >
      <AnimatedBackground />
      <FloatingParticles />
      
      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="mobile-menu-container"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-menu-header">
                <h3>Navigation</h3>
                <button 
                  className="close-menu-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mobile-tabs">
                <button
                  className={`mobile-tab ${activeTab === 'upload' ? 'mobile-tab-active' : ''}`}
                  onClick={() => handleTabSwitch('upload')}
                >
                  <div className="mobile-tab-icon">📁</div>
                  <span>Upload Image</span>
                </button>
                <button
                  className={`mobile-tab ${activeTab === 'camera' ? 'mobile-tab-active' : ''}`}
                  onClick={() => handleTabSwitch('camera')}
                >
                  <div className="mobile-tab-icon">📷</div>
                  <span>Use Camera</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showCelebration && (
          <motion.div 
            className="celebration-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="celebration-content">
              <Sparkles className="sparkle-icon" />
              <h3>Great Recycling!</h3>
              <p>High confidence detection! ♻️</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EnhancedHeader 
        isMobile={isMobile}
        isTablet={isTablet}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      
      <main className="creative-main">
        <div className="creative-container">
          {/* Responsive Tabs - Different layout for mobile */}
          {!isMobile ? (
            <motion.div 
              className="creative-tabs-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <div className={`creative-tabs ${isTablet ? 'tablet-tabs' : ''}`}>
                <motion.button
                  className={`creative-tab magnetic-button smooth-focus ${
                    activeTab === 'upload' ? 'creative-tab-active' : ''
                  }`}
                  onClick={() => handleTabSwitch('upload')}
                  whileHover={{ scale: isTablet ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="tab-icon">
                    <div className="icon-orb upload-orb"></div>
                  </div>
                  <span>Upload Image</span>
                  <div className="tab-glow"></div>
                </motion.button>
                
                <motion.button
                  className={`creative-tab magnetic-button smooth-focus ${
                    activeTab === 'camera' ? 'creative-tab-active' : ''
                  }`}
                  onClick={() => handleTabSwitch('camera')}
                  whileHover={{ scale: isTablet ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="tab-icon">
                    <div className="icon-orb camera-orb"></div>
                  </div>
                  <span>Live Camera</span>
                  <div className="tab-glow"></div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Mobile Tab Indicator
            <motion.div 
              className="mobile-tab-indicator"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button 
                className="mobile-menu-trigger"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
                <span>{
                  activeTab === 'upload' ? 'Upload Image' : 'Use Camera'
                }</span>
              </button>
            </motion.div>
          )}

          {/* Smooth Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="creative-error"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div className="error-shake">
                  <span className="error-emoji">⚡</span>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Responsive Content Grid */}
          <motion.div 
            className={`creative-content-grid ${
              isMobile ? 'mobile-layout' : 
              isTablet ? 'tablet-layout' : 
              'desktop-layout'
            }`}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.6 }}
          >
            {/* Input Section */}
            <motion.div 
              className="creative-input-section smooth-transform"
              layout="position"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === 'upload' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === 'upload' ? 20 : -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {tabContent}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Results Section - Hidden on mobile when no results */}
            <motion.div 
              className={`creative-results-section smooth-transform ${
                isMobile && !predictions && !isLoading ? 'mobile-hidden' : ''
              }`}
              layout="position"
            >
              {isLoading ? (
                <LoadingAnimation isMobile={isMobile} isTablet={isTablet} />
              ) : predictions ? (
                <AnimatedResults 
                  predictions={predictions} 
                  image={selectedImage}
                  onReset={resetResults}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              ) : (
                <CreativePlaceholder isMobile={isMobile} isTablet={isTablet} />
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>

      <CreativeFooter isMobile={isMobile} isTablet={isTablet} />
    </motion.div>
  );
}

// Enhanced CreativePlaceholder with responsive props
const CreativePlaceholder = React.memo(({ isMobile, isTablet }) => (
  <motion.div 
    className={`creative-placeholder smooth-loading ${isMobile ? 'mobile-placeholder' : ''}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
  >
    <div className="placeholder-animation">
      <Recycle className="recycle-spin" size={isMobile ? 60 : 80} />
      <div className="floating-materials">
        <motion.span 
          className="material-float plastic"
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >♳</motion.span>
        <motion.span 
          className="material-float paper"
          animate={{ y: [0, -15, 0], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >📄</motion.span>
        <motion.span 
          className="material-float metal"
          animate={{ y: [0, -25, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >🔩</motion.span>
        <motion.span 
          className="material-float glass"
          animate={{ y: [0, -18, 0], rotate: [0, -6, 6, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >🍷</motion.span>
      </div>
    </div>
    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      Ready to Classify!
    </motion.h3>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      {isMobile ? 'Tap menu to start' : 'Upload an image or use camera to identify recyclable materials'}
    </motion.p>
    <motion.div 
      className={`creative-material-showcase ${isMobile ? 'mobile-showcase' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
    >
      {['plastic', 'paper', 'metal', 'glass'].map((material, index) => (
        <motion.div 
          key={material}
          className={`material-card enhanced-hover smooth-focus ${isMobile ? 'mobile-material-card' : ''}`}
          data-material={material}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + index * 0.1 }}
          whileHover={{ 
            scale: isMobile ? 1 : 1.05,
            y: isMobile ? 0 : -5,
            transition: { type: "spring", stiffness: 400, damping: 17 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`material-3d ${isMobile ? 'mobile-material-3d' : ''}`}>
            {{
              plastic: '♳',
              paper: '📄',
              metal: '🔩',
              glass: '🍷'
            }[material]}
          </div>
          <span>{material.charAt(0).toUpperCase() + material.slice(1)}</span>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
));

// Enhanced Footer with responsive props
const CreativeFooter = React.memo(({ isMobile, isTablet }) => (
  <motion.footer 
    className={`creative-footer ${isMobile ? 'mobile-footer' : ''}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
  >
    <div className="footer-wave"></div>
    <div className="footer-content">
      <motion.div 
        className={`footer-grid ${isMobile ? 'mobile-footer-grid' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {!isMobile && (
          <>
            <motion.div 
              className="footer-section enhanced-hover"
              whileHover={{ y: -2 }}
            >
              <h4>♻️ Eco Impact</h4>
              <p>Helping create a cleaner planet through AI-powered recycling</p>
            </motion.div>
            <motion.div 
              className="footer-section enhanced-hover"
              whileHover={{ y: -2 }}
            >
              <h4>🌍 Sustainable Future</h4>
              <p>Every correct classification contributes to better waste management</p>
            </motion.div>
            <motion.div 
              className="footer-section enhanced-hover"
              whileHover={{ y: -2 }}
            >
              <h4>🤖 AI for Good</h4>
              <p>Using technology to solve environmental challenges</p>
            </motion.div>
          </>
        )}
      </motion.div>
      <motion.div 
        className={`footer-bottom ${isMobile ? 'mobile-footer-bottom' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p>Recyclable Material Classifier • Built with React & Passion for the Planet</p>
      </motion.div>
    </div>
  </motion.footer>
));

export default App;