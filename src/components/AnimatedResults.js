// src/components/AnimatedResults.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Info, TrendingUp, Award, Sparkles } from 'lucide-react';

const AnimatedResults = ({ predictions, image, onReset }) => {
  const [selectedTab, setSelectedTab] = useState('summary');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);

  const materialIcons = {
    plastic: '♳',
    paper: '📄',
    metal: '🔩',
    glass: '🍷'
  };

  const recyclingTips = {
    plastic: 'Rinse plastic containers before recycling. Check local guidelines for accepted types.',
    paper: 'Keep paper dry and clean. Remove any non-paper components like plastic windows.',
    metal: 'Rinse cans and containers. Separate aluminum and steel if required.',
    glass: 'Rinse glass containers. Sort by color if required. Do not include broken glass.'
  };

  const getConfidenceClass = (confidence) => {
    if (confidence > 0.85) return 'confidence-high';
    if (confidence > 0.70) return 'confidence-medium';
    return 'confidence-low';
  };

  const topPrediction = predictions.reduce((prev, current) => 
    prev.confidence > current.confidence ? prev : current
  );

  return (
    <motion.div 
      className="animated-results-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="results-header-creative">
        <h2>Analysis Results</h2>
        <motion.button 
          onClick={onReset} 
          className="reset-button-creative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={16} />
          New Analysis
        </motion.button>
      </div>

      {image && (
        <motion.div 
          className="result-image-preview-creative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img src={image} alt="Analyzed" />
        </motion.div>
      )}

      {/* Summary Card */}
      <motion.div 
        className="summary-card-creative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="prediction-badge-creative">
          <motion.div 
            className="material-icon-large-creative"
            animate={{ 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.5 }}
          >
            {materialIcons[topPrediction.class]}
          </motion.div>
          <div className="prediction-info-creative">
            <h3 className="prediction-class-creative">{topPrediction.class}</h3>
            <div className={`confidence-badge-creative ${getConfidenceClass(topPrediction.confidence)}`}>
              <Award size={16} />
              {Math.round(topPrediction.confidence * 100)}% confidence
            </div>
          </div>
        </div>

        {topPrediction.confidence >= confidenceThreshold && (
          <motion.div 
            className="recycling-tip-creative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Info size={20} />
            <p>{recyclingTips[topPrediction.class]}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="results-tabs-creative">
        <button 
          className={`tab-creative ${selectedTab === 'summary' ? 'tab-creative-active' : ''}`}
          onClick={() => setSelectedTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`tab-creative ${selectedTab === 'details' ? 'tab-creative-active' : ''}`}
          onClick={() => setSelectedTab('details')}
        >
          Detailed View
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'details' && (
          <motion.div 
            className="detailed-results-creative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="confidence-control-creative">
              <label>Confidence Threshold: {Math.round(confidenceThreshold * 100)}%</label>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold * 100}
                onChange={(e) => setConfidenceThreshold(e.target.value / 100)}
                className="slider-creative"
              />
            </div>

            <div className="confidence-bars-creative">
              {predictions.map((pred, index) => (
                <motion.div 
                  key={index} 
                  className="confidence-item-creative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="material-row-creative">
                    <span className="material-emoji-creative">{materialIcons[pred.class]}</span>
                    <span className="material-name-creative">{pred.class}</span>
                    <span className="confidence-percent-creative">
                      {Math.round(pred.confidence * 100)}%
                    </span>
                  </div>
                  <div className="confidence-bar-container-creative">
                    <motion.div 
                      className={`confidence-bar-creative ${getConfidenceClass(pred.confidence)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.confidence * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Section */}
      <motion.div 
        className="feedback-section-creative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h4>Was this prediction accurate?</h4>
        <div className="feedback-buttons-creative">
          <motion.button 
            className="feedback-btn yes"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👍 Yes
          </motion.button>
          <motion.button 
            className="feedback-btn no"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👎 No
          </motion.button>
          <motion.button 
            className="feedback-btn unsure"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🤔 Unsure
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedResults;