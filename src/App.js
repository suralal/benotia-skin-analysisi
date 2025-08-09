import React, {useRef, useEffect, useState, useCallback} from 'react';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import {load, SupportedPackages} from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import {drawMesh} from "./utilities";

function App() {
  //setup references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  
  //state
  const [net, setNet] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [faceCapture, setFaceCapture] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  //Load facemesh
  const runFacemesh = async () => {
    try {
      // Initialize TensorFlow.js backend
      await tf.ready();
      console.log("TensorFlow.js backend initialized");
      
      // Load model with 0.0.3 API
      const model = await load(SupportedPackages.mediapipeFacemesh);
      console.log("Face mesh model loaded");
      
      setNet(model);
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  //detect function
  const detect = useCallback(async () => {
    if(net && 
       webcamRef.current && 
       webcamRef.current.video &&
       webcamRef.current.video.readyState === 4) {
      
      //Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      //Get canvas context (dimensions will be set later based on displayed video size)
      const ctx = canvasRef.current.getContext("2d");

      //Make detections with 0.0.3 API
      const faces = await net.estimateFaces({input: video});

      //Draw mesh if faces detected
      if (faces.length > 0) {
        // Force canvas to exactly match container dimensions
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
        
        // Calculate scale from video resolution to fixed display size
        const scaleX = 640 / videoWidth;
        const scaleY = 480 / videoHeight;
        
        console.log(`Video: ${videoWidth}x${videoHeight}, Canvas: 640x480, Scale: ${scaleX}x${scaleY}`);
        console.log("First mesh point:", faces[0].scaledMesh[0]);
        console.log("Scaled point:", [faces[0].scaledMesh[0][0] * scaleX, faces[0].scaledMesh[0][1] * scaleY]);
        
        // Clear canvas
        ctx.clearRect(0, 0, 640, 480);
        
        drawMesh(faces, ctx, scaleX, scaleY);
      }
    }
  }, [net]);

  // Take photo function
  const takePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    
    // Flash effect
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 150);
    
    // Create combined canvas with webcam + face mesh
    const video = webcamRef.current.video;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Draw webcam video
    ctx.drawImage(video, 0, 0, 640, 480);
    
    // Draw face mesh overlay
    if (canvasRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0);
    }
    
    // Convert to photo
    const photoDataUrl = canvas.toDataURL('image/png');
    const newPhoto = {
      id: Date.now(),
      dataUrl: photoDataUrl,
      timestamp: new Date().toLocaleString()
    };
    
    setCapturedPhotos(prev => [newPhoto, ...prev]);
  }, []);

  // Analyze skin for acne and hyperpigmentation
  const analyzeSkin = useCallback(async (canvas) => {
    setIsAnalyzing(true);
    
    try {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let redSpots = 0;
      let darkSpots = 0;
      let totalPixels = 0;
      let avgBrightness = 0;
      
      // Analyze pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const brightness = (r + g + b) / 3;
        avgBrightness += brightness;
        
        // Detect potential acne (reddish areas)
        if (r > g + 20 && r > b + 20 && brightness > 80) {
          redSpots++;
        }
        
        // Detect hyperpigmentation (darker spots)
        if (brightness < avgBrightness * 0.7 && (r + g + b) < 150) {
          darkSpots++;
        }
        
        totalPixels++;
      }
      
      avgBrightness = avgBrightness / totalPixels;
      
      const acnePercentage = (redSpots / totalPixels) * 100;
      const hyperpigmentationPercentage = (darkSpots / totalPixels) * 100;
      
      // Generate scores and recommendations
      const acneScore = Math.min(100, acnePercentage * 10);
      const hyperpigmentationScore = Math.min(100, hyperpigmentationPercentage * 15);
      const overallScore = Math.max(0, 100 - (acneScore + hyperpigmentationScore) / 2);
      
      setAnalysisResult({
        acne: {
          score: Math.round(acneScore),
          severity: acneScore < 20 ? 'Minimal' : acneScore < 40 ? 'Mild' : acneScore < 60 ? 'Moderate' : 'Severe',
          spots: Math.round(redSpots / 100)
        },
        hyperpigmentation: {
          score: Math.round(hyperpigmentationScore),
          severity: hyperpigmentationScore < 15 ? 'Minimal' : hyperpigmentationScore < 30 ? 'Mild' : hyperpigmentationScore < 50 ? 'Moderate' : 'Severe',
          spots: Math.round(darkSpots / 100)
        },
        overall: {
          score: Math.round(overallScore),
          grade: overallScore > 80 ? 'Excellent' : overallScore > 60 ? 'Good' : overallScore > 40 ? 'Fair' : 'Needs Attention'
        },
        avgBrightness: Math.round(avgBrightness)
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Capture face from mesh for analysis
  const captureFaceFromMesh = useCallback(async () => {
    if (!webcamRef.current || !net) return;
    
    const video = webcamRef.current.video;
    const faces = await net.estimateFaces({input: video});
    
    if (faces.length > 0) {
      const face = faces[0];
      const keypoints = face.scaledMesh;
      
      // Find face boundaries
      const xs = keypoints.map(point => point[0]);
      const ys = keypoints.map(point => point[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      
      // Add padding
      const padding = 20;
      const faceX = Math.max(0, minX - padding);
      const faceY = Math.max(0, minY - padding);
      const faceWidth = Math.min(640 - faceX, maxX - minX + 2 * padding);
      const faceHeight = Math.min(480 - faceY, maxY - minY + 2 * padding);
      
      // Create canvas for face capture
      const canvas = document.createElement('canvas');
      canvas.width = faceWidth;
      canvas.height = faceHeight;
      const ctx = canvas.getContext('2d');
      
      // Calculate scale factors
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const scaleX = videoWidth / 640;
      const scaleY = videoHeight / 480;
      
      // Draw face region from video
      ctx.drawImage(
        video,
        faceX * scaleX, faceY * scaleY, faceWidth * scaleX, faceHeight * scaleY,
        0, 0, faceWidth, faceHeight
      );
      
      const faceDataUrl = canvas.toDataURL('image/png');
      setFaceCapture({
        dataUrl: faceDataUrl,
        timestamp: new Date().toLocaleString(),
        boundaries: { x: faceX, y: faceY, width: faceWidth, height: faceHeight }
      });
      
      // Start analysis
      analyzeSkin(canvas);
    }
  }, [net, analyzeSkin]);

  // Photo capture with countdown
  const capturePhoto = useCallback(() => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    let count = 3;
    setCountdown(count);
    
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(countdownInterval);
        setCountdown(null);
        
        // Capture the photo
        setTimeout(() => {
          takePhoto();
          setIsCapturing(false);
        }, 500);
      }
    }, 1000);
  }, [isCapturing, takePhoto]);

  // Delete photo
  const deletePhoto = useCallback((photoId) => {
    setCapturedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  }, []);

  // Download photo
  const downloadPhoto = useCallback((photo) => {
    const link = document.createElement('a');
    link.download = `face-mesh-${photo.id}.png`;
    link.href = photo.dataUrl;
    link.click();
  }, []);

  // Initialize model on component mount
  useEffect(() => {
  runFacemesh();
  }, []);

  // Start detection loop when model is ready
  useEffect(() => {
    let interval;
    if (net) {
      interval = setInterval(detect, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [net, detect]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      {/* Flash Effect */}
      {flashEffect && (
        <div className="fixed inset-0 bg-white z-50 opacity-80 pointer-events-none animate-pulse" />
      )}
      
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          📸 AI Face Mesh Studio
        </h1>
        <p className="text-blue-200 text-lg">
          Capture your face with AI-powered landmark detection
        </p>
        {capturedPhotos.length > 0 && (
          <p className="text-green-300 text-sm mt-2">
            ✨ {capturedPhotos.length} photo{capturedPhotos.length !== 1 ? 's' : ''} captured
          </p>
        )}
      </div>

      {/* Main Content Container - Two Column Layout */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 max-w-full">
        {/* Left Column - Camera */}
        <div className="flex flex-col gap-6">
          {/* Camera Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl" style={{ width: 'fit-content', margin: '0 auto' }}>
            <div className="rounded-xl overflow-hidden border-4 border-white/30 shadow-xl" style={{ width: '640px', height: '480px', position: 'relative' }}>
            <Webcam 
              ref={webcamRef} 
              width={640}
              height={480}
              style={{ 
                width: '640px', 
                height: '480px',
                objectFit: 'cover',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none"
              width={640}
              height={480}
              style={{ 
                width: '640px', 
                height: '480px',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 10
              }}
            />
            
            {/* Countdown Overlay */}
            {countdown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <div className="text-8xl font-bold text-white animate-bounce">
                  {countdown}
                </div>
              </div>
            )}
          </div>
          
          {/* Camera Controls */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={capturePhoto}
                disabled={isCapturing || !net}
                className={`
                  px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105
                  ${isCapturing || !net
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isCapturing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Get Ready...
                  </span>
                ) : !net ? (
                  'Loading AI Model...'
                ) : (
                  '📸 Capture Photo'
                )}
              </button>
              
              <button
                onClick={captureFaceFromMesh}
                disabled={!net || isAnalyzing}
                className={`
                  px-6 py-3 rounded-full font-bold text-base transition-all duration-300 transform hover:scale-105
                  ${!net || isAnalyzing
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Skin...
                  </span>
                ) : !net ? (
                  'Loading AI Model...'
                ) : (
                  '🔬 Analyze Face Skin'
                )}
              </button>
            </div>
            
            <p className="text-white/80 text-sm text-center">
              {!net ? 'AI model is loading...' : 'Capture full photo or analyze skin for acne & pigmentation'}
            </p>
          </div>
          </div>
        </div>

        {/* Face Analysis Panel */}
        {(faceCapture || analysisResult) && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl w-full max-w-lg mx-auto">
            {faceCapture && (
              <>
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  🔍 Captured Face
                </h3>
                <div className="rounded-xl overflow-hidden border-2 border-emerald-400/50 shadow-lg mb-4">
                  <img 
                    src={faceCapture.dataUrl} 
                    alt="Captured Face"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-white/70 text-sm text-center mb-4">
                  Captured: {faceCapture.timestamp}
                </p>
              </>
            )}

            {analysisResult && (
              <>
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  📊 Skin Analysis Results
                </h3>
                
                {/* Overall Score */}
                <div className="mb-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {analysisResult.overall.score}/100
                  </div>
                  <div className={`text-lg font-semibold ${
                    analysisResult.overall.score > 80 ? 'text-green-400' :
                    analysisResult.overall.score > 60 ? 'text-yellow-400' :
                    analysisResult.overall.score > 40 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {analysisResult.overall.grade}
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="space-y-4">
                  {/* Acne Analysis */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">🔴 Acne Analysis</span>
                      <span className={`font-bold ${
                        analysisResult.acne.score < 20 ? 'text-green-400' :
                        analysisResult.acne.score < 40 ? 'text-yellow-400' :
                        analysisResult.acne.score < 60 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {analysisResult.acne.severity}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          analysisResult.acne.score < 20 ? 'bg-green-400' :
                          analysisResult.acne.score < 40 ? 'bg-yellow-400' :
                          analysisResult.acne.score < 60 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.min(100, analysisResult.acne.score)}%` }}
                      ></div>
                    </div>
                    <p className="text-white/70 text-sm">
                      Score: {analysisResult.acne.score}/100 • Spots: {analysisResult.acne.spots}
                    </p>
                  </div>

                  {/* Hyperpigmentation Analysis */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">🟤 Hyperpigmentation</span>
                      <span className={`font-bold ${
                        analysisResult.hyperpigmentation.score < 15 ? 'text-green-400' :
                        analysisResult.hyperpigmentation.score < 30 ? 'text-yellow-400' :
                        analysisResult.hyperpigmentation.score < 50 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {analysisResult.hyperpigmentation.severity}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          analysisResult.hyperpigmentation.score < 15 ? 'bg-green-400' :
                          analysisResult.hyperpigmentation.score < 30 ? 'bg-yellow-400' :
                          analysisResult.hyperpigmentation.score < 50 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.min(100, analysisResult.hyperpigmentation.score)}%` }}
                      ></div>
                    </div>
                    <p className="text-white/70 text-sm">
                      Score: {analysisResult.hyperpigmentation.score}/100 • Dark spots: {analysisResult.hyperpigmentation.spots}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30">
                    <h4 className="text-white font-semibold mb-2">💡 Recommendations</h4>
                    <div className="text-white/80 text-sm space-y-1">
                      {analysisResult.acne.score > 40 && (
                        <p>• Consider salicylic acid or benzoyl peroxide for acne</p>
                      )}
                      {analysisResult.hyperpigmentation.score > 30 && (
                        <p>• Use vitamin C serum and broad-spectrum sunscreen</p>
                      )}
                      {analysisResult.overall.score > 80 && (
                        <p>• Great skin! Maintain your current routine</p>
                      )}
                      <p>• Always consult a dermatologist for personalized advice</p>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setFaceCapture(null);
                    setAnalysisResult(null);
                  }}
                  className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  🔄 New Analysis
                </button>
              </>
            )}
          </div>
        )}

        {/* Instructions Panel */}
        {!faceCapture && !analysisResult && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3 text-center">
              🎯 Face Skin Analysis
            </h3>
            <div className="text-white/70 text-sm space-y-2">
              <p>1. Position your face in the camera view</p>
              <p>2. Wait for the blue face mesh to appear</p>
              <p>3. Click "Analyze Face Skin" button</p>
              <p>4. Get detailed acne and pigmentation analysis</p>
              <p className="text-yellow-400/80 text-xs mt-3">
                ⚠️ This is for educational purposes. Consult a dermatologist for medical advice.
              </p>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {capturedPhotos.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              📱 Photo Gallery
            </h3>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {capturedPhotos.map((photo) => (
                <div key={photo.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <img
                    src={photo.dataUrl}
                    alt={`Captured ${photo.timestamp}`}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="text-white/70 text-xs mb-2">{photo.timestamp}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadPhoto(photo)}
                      className="flex-1 bg-green-500/80 hover:bg-green-500 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      ⬇️ Download
                    </button>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="flex-1 bg-red-500/80 hover:bg-red-500 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-blue-300 text-sm">
          Powered by TensorFlow.js & MediaPipe • Face Mesh Studio
        </p>
      </div>
    </div>
  );
}

export default App;
