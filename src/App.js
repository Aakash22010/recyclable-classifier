// src/App.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedHeader from './components/EnhancedHeader';
import CreativeUpload from './components/CreativeUpload';
import InteractiveWebcam from './components/InteractiveWebcam';
import AnimatedResults from './components/AnimatedResults';
import LoadingAnimation from './components/LoadingAnimation';
import AnimatedBackground from './components/creative/AnimatedBackground';
import FloatingParticles from './components/creative/FloatingParticles';
import { Recycle, Sparkles } from 'lucide-react';
import './styles/CreativeApp.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handlePredictions = (data) => {
    setPredictions(data);
    setError(null);
    // Show celebration for high confidence predictions
    const topConfidence = Math.max(...data.map(p => p.confidence));
    if (topConfidence > 0.85) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleLoading = (loading) => {
    setIsLoading(loading);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setPredictions(null);
  };

  const resetResults = () => {
    setPredictions(null);
    setSelectedImage(null);
    setError(null);
    setShowCelebration(false);
  };

  return (
    <div className="creative-app">
      <AnimatedBackground />
      <FloatingParticles />
      
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <Sparkles className="sparkle-icon" />
            <h3>Great Recycling!</h3>
            <p>High confidence detection! ♻️</p>
          </div>
        </div>
      )}

      <EnhancedHeader />
      
      <main className="creative-main">
        <div className="creative-container">
          {/* Animated Tab Navigation */}
          <motion.div 
            className="creative-tabs-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="creative-tabs">
              <button
                className={`creative-tab ${activeTab === 'upload' ? 'creative-tab-active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <div className="tab-icon">
                  <div className="icon-orb upload-orb"></div>
                </div>
                <span>Upload Image</span>
                <div className="tab-glow"></div>
              </button>
              
              <button
                className={`creative-tab ${activeTab === 'camera' ? 'creative-tab-active' : ''}`}
                onClick={() => setActiveTab('camera')}
              >
                <div className="tab-icon">
                  <div className="icon-orb camera-orb"></div>
                </div>
                <span>Live Camera</span>
                <div className="tab-glow"></div>
              </button>
            </div>
          </motion.div>

          {/* Error Display with Animation */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="creative-error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="error-shake">
                  <span className="error-emoji">⚡</span>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          <div className="creative-content-grid">
            {/* Input Section */}
            <motion.div 
              className="creative-input-section"
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'upload' ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <CreativeUpload
                      onPredictions={handlePredictions}
                      onLoading={handleLoading}
                      onError={handleError}
                      onImageSelect={setSelectedImage}
                      resetResults={resetResults}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <InteractiveWebcam
                      onPredictions={handlePredictions}
                      onLoading={handleLoading}
                      onError={handleError}
                      onImageSelect={setSelectedImage}
                      resetResults={resetResults}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results Section */}
            <motion.div 
              className="creative-results-section"
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {isLoading ? (
                <LoadingAnimation />
              ) : predictions ? (
                <AnimatedResults 
                  predictions={predictions} 
                  image={selectedImage}
                  onReset={resetResults}
                />
              ) : (
                <CreativePlaceholder />
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <CreativeFooter />
    </div>
  );
}

// Creative Placeholder Component
const CreativePlaceholder = () => (
  <motion.div 
    className="creative-placeholder"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <div className="placeholder-animation">
      <Recycle className="recycle-spin" size={80} />
      <div className="floating-materials">
        <span className="material-float plastic">♳</span>
        <span className="material-float paper">📄</span>
        <span className="material-float metal">🔩</span>
        <span className="material-float glass">🍷</span>
      </div>
    </div>
    <h3>Ready to Classify!</h3>
    <p>Upload an image or use camera to identify recyclable materials</p>
    <div className="creative-material-showcase">
      <div className="material-card" data-material="plastic">
        <div className="material-3d">♳</div>
        <span>Plastic</span>
      </div>
      <div className="material-card" data-material="paper">
        <div className="material-3d">📄</div>
        <span>Paper</span>
      </div>
      <div className="material-card" data-material="metal">
        <div className="material-3d">🔩</div>
        <span>Metal</span>
      </div>
      <div className="material-card" data-material="glass">
        <div className="material-3d">🍷</div>
        <span>Glass</span>
      </div>
    </div>
  </motion.div>
);

// Creative Footer Component
const CreativeFooter = () => (
  <motion.footer 
    className="creative-footer"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1 }}
  >
    <div className="footer-wave"></div>
    <div className="footer-content">
      <div className="footer-grid">
        <div className="footer-section">
          <h4>♻️ Eco Impact</h4>
          <p>Helping create a cleaner planet through AI-powered recycling</p>
        </div>
        <div className="footer-section">
          <h4>🌍 Sustainable Future</h4>
          <p>Every correct classification contributes to better waste management</p>
        </div>
        <div className="footer-section">
          <h4>🤖 AI for Good</h4>
          <p>Using technology to solve environmental challenges</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Recyclable Material Classifier • Built with React & Passion for the Planet</p>
      </div>
    </div>
  </motion.footer>
);

export default App;