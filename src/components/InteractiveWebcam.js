// src/components/InteractiveWebcam.js - UPDATED
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Camera, Circle, Scan, Zap } from 'lucide-react';
import { classifyImage } from '../services/api';

const InteractiveWebcam = ({ 
  onPredictions, 
  onLoading, 
  onError, 
  onImageSelect, 
  resetResults,
  isMobile,
  isTablet 
}) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(true);

  const videoConstraints = {
    width: isMobile ? 640 : 1280,
    height: isMobile ? 480 : 720,
    facingMode: "environment"
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      setIsCaptured(true);
      setIsWebcamActive(false);
      onImageSelect(imageSrc);
    }
  }, [webcamRef, onImageSelect]);

  const retake = () => {
    setImgSrc(null);
    setIsCaptured(false);
    setIsWebcamActive(true);
    resetResults();
  };

  const analyzeCapture = async () => {
    if (!imgSrc) return;

    onLoading(true);
    try {
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });

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
      className={`interactive-webcam-container ${isMobile ? 'mobile-webcam' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!isCaptured ? (
        <div className="webcam-interface">
          {isWebcamActive ? (
            <motion.div
              className="webcam-preview-creative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="webcam-frame">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="webcam-feed-creative"
                  screenshotQuality={isMobile ? 0.7 : 0.9}
                />
                <div className="scanning-overlay">
                  <div className="scan-line"></div>
                  <div className="corner-tl"></div>
                  <div className="corner-tr"></div>
                  <div className="corner-bl"></div>
                  <div className="corner-br"></div>
                </div>
              </div>
              
              <motion.button 
                onClick={capture} 
                className="capture-button-creative"
                whileHover={{ scale: isMobile ? 1 : 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`capture-ring ${isMobile ? 'mobile-capture' : ''}`}>
                  <Circle size={isMobile ? 60 : 72} className="capture-circle" />
                  <Camera size={isMobile ? 24 : 32} className="camera-icon" />
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <div className="webcam-permission">
              <Scan size={isMobile ? 48 : 64} />
              <h3>Camera Access Required</h3>
              <p>Please allow camera access to use this feature</p>
              <button onClick={() => setIsWebcamActive(true)} className="btn-primary">
                Enable Camera
              </button>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          className="capture-review-creative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="captured-image-container">
            <img src={imgSrc} alt="Captured" className="captured-image-creative" />
            <div className={`capture-actions-creative ${isMobile ? 'mobile-actions' : ''}`}>
              <button onClick={retake} className="btn-secondary-creative">
                Retake Photo
              </button>
              <button onClick={analyzeCapture} className="btn-primary-creative">
                <Zap size={20} />
                Analyze Image
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="webcam-tips-creative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4>📷 Camera Tips</h4>
        <div className={`tips-grid ${isMobile ? 'mobile-tips' : ''}`}>
          <div className="tip-item">
            <div className="tip-icon">☀️</div>
            <span>Good Lighting</span>
          </div>
          <div className="tip-item">
            <div className="tip-icon">📐</div>
            <span>Steady Hands</span>
          </div>
          <div className="tip-item">
            <div className="tip-icon">🎯</div>
            <span>Focus on One Item</span>
          </div>
          <div className="tip-item">
            <div className="tip-icon">🖼️</div>
            <span>Clear View</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveWebcam;