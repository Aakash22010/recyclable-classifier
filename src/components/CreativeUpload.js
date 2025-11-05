// src/components/CreativeUpload.js
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Cloud, Zap } from 'lucide-react';
import { classifyImage } from '../services/api';

const CreativeUpload = ({ onPredictions, onLoading, onError, onImageSelect, resetResults }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = async (file) => {
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

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const predictions = await classifyImage(formData);
      onPredictions(predictions);
    } catch (error) {
      onError(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <motion.div 
      className="creative-upload-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!previewUrl ? (
        <motion.div
          className={`upload-zone ${isDragging ? 'upload-zone-dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
            animate={isDragging ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
          >
            <motion.div 
              className="upload-icon-container"
              animate={{ rotate: isDragging ? 5 : 0 }}
            >
              <Cloud size={64} className="upload-cloud" />
              <Upload size={32} className="upload-arrow" />
            </motion.div>
            
            <h3>Drop Your Image Here</h3>
            <p>Or click to browse your files</p>
            
            <div className="upload-features">
              <div className="feature">
                <Zap size={16} />
                <span>AI Powered</span>
              </div>
              <div className="feature">
                <Image size={16} />
                <span>Multiple Formats</span>
              </div>
            </div>
          </motion.div>

          <div className="upload-glow"></div>
        </motion.div>
      ) : (
        <motion.div 
          className="image-preview-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="preview-image-wrapper">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <button 
                onClick={() => {
                  setPreviewUrl(null);
                  resetResults();
                }}
                className="change-image-btn"
              >
                Change Image
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="upload-guidance"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4>🎯 Best Practices</h4>
        <div className="guidance-grid">
          <div className="guidance-item">
            <div className="guidance-icon">☀️</div>
            <span>Good Lighting</span>
          </div>
          <div className="guidance-item">
            <div className="guidance-icon">🎨</div>
            <span>Clear Background</span>
          </div>
          <div className="guidance-item">
            <div className="guidance-icon">📷</div>
            <span>Focus on Material</span>
          </div>
          <div className="guidance-item">
            <div className="guidance-icon">⚡</div>
            <span>High Quality</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreativeUpload;