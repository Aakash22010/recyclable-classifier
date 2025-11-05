// src/components/CreativeUpload.js (Enhanced)
import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, Cloud, Zap, X } from 'lucide-react';
import { classifyImage } from '../services/api';

const CreativeUpload = ({ onPredictions, onLoading, onError, onImageSelect, resetResults }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  }, []);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  }, []);

  const simulateProgress = useCallback(() => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    return interval;
  }, []);

  const processImage = useCallback(async (file) => {
    if (!file.type.startsWith('image/')) {
      onError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError('Image size should be less than 10MB');
      return;
    }

    resetResults();
    onLoading(true);
    
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    onImageSelect(imageUrl);

    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const predictions = await classifyImage(formData);
      setUploadProgress(100);
      setTimeout(() => {
        onPredictions(predictions);
      }, 500);
    } catch (error) {
      onError(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        onLoading(false);
        setUploadProgress(0);
      }, 1000);
    }
  }, [onPredictions, onLoading, onError, onImageSelect, resetResults, simulateProgress]);

  const clearImage = useCallback(() => {
    setPreviewUrl(null);
    resetResults();
    setUploadProgress(0);
  }, [resetResults]);

  return (
    <motion.div 
      className="creative-upload-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {!previewUrl ? (
          <motion.div
            key="upload-zone"
            className={`upload-zone ${isDragging ? 'upload-zone-dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input-hidden"
            />
            
            <motion.div 
              className="upload-content"
              animate={isDragging ? { y: [0, -8, 0] } : {}}
              transition={{ duration: 0.6, repeat: isDragging ? Infinity : 0 }}
            >
              <motion.div 
                className="upload-icon-container"
                animate={{ rotate: isDragging ? [0, -5, 5, 0] : 0 }}
                transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
              >
                <Cloud size={64} className="upload-cloud" />
                <Upload size={32} className="upload-arrow" />
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Drop Your Image Here
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Or click to browse your files
              </motion.p>
              
              <motion.div 
                className="upload-features"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="feature">
                  <Zap size={16} />
                  <span>AI Powered</span>
                </div>
                <div className="feature">
                  <Image size={16} />
                  <span>Multiple Formats</span>
                </div>
              </motion.div>
            </motion.div>

            <div className="upload-glow"></div>
          </motion.div>
        ) : (
          <motion.div 
            key="preview"
            className="image-preview-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="preview-image-wrapper">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              
              {/* Upload Progress Bar */}
              {uploadProgress > 0 && (
                <motion.div 
                  className="upload-progress"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                >
                  <motion.div 
                    className="progress-bar-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: uploadProgress / 100 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </motion.div>
              )}
              
              <motion.div 
                className="preview-overlay"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button 
                  onClick={clearImage}
                  className="change-image-btn magnetic-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                  Change Image
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="upload-guidance"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h4>🎯 Best Practices</h4>
        <motion.div 
          className="guidance-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: '☀️', text: 'Good Lighting' },
            { icon: '🎨', text: 'Clear Background' },
            { icon: '📷', text: 'Focus on Material' },
            { icon: '⚡', text: 'High Quality' }
          ].map((item, index) => (
            <motion.div
              key={item.text}
              className="guidance-item enhanced-hover"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="guidance-icon">{item.icon}</div>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(CreativeUpload);