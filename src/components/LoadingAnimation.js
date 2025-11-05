// src/components/LoadingAnimation.js
import React from 'react';
import { motion } from 'framer-motion';
import { Recycle, Scan, Cpu } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <motion.div 
      className="loading-animation-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-content">
        <motion.div 
          className="loading-orb"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Recycle className="loading-icon" size={40} />
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Analyzing Material
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Our AI is identifying the recyclable material...
        </motion.p>

        <div className="loading-features">
          <motion.div 
            className="feature-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Scan size={16} />
            <span>Scanning Image</span>
          </motion.div>
          <motion.div 
            className="feature-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Cpu size={16} />
            <span>AI Processing</span>
          </motion.div>
        </div>

        <div className="loading-dots-creative">
          <motion.span
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>

        <motion.div 
          className="loading-progress"
          initial={{ width: 0 }}
          animate={{ width: "80%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div className="progress-bar"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;