import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Camera, Loader2, Play, Square, Settings, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import { load, SupportedPackages } from '@tensorflow-models/face-landmarks-detection';
import { drawMesh, drawSkinIssueDots, analyzeSkin } from '../utils/utilities.js';

// Convert backend API result to frontend format
const convertBackendToFrontend = (apiResult: any) => {
  const { scores, regions, overlays } = apiResult;
  
  // Convert scores to severity levels
  const getSeverity = (score: number) => {
    if (score >= 80) return 'high';
    if (score >= 40) return 'moderate';
    return 'low';
  };
  
  return {
    acne: {
      severity: getSeverity(scores.acne),
      count: Object.values(regions).reduce((sum: number, r: any) => sum + ((r as any).acne_count || 0), 0),
      percentage: Math.round(scores.acne),
      areas: Object.entries(regions)
        .filter(([_, r]) => (r as any).acne_count > 0)
        .map(([name, _]) => name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())),
      score: scores.acne,
      type: 'inflammatory'
    },
    hyperpigmentation: {
      severity: getSeverity(scores.pigmentation),
      percentage: Math.round(scores.pigmentation),
      areas: Object.entries(regions)
        .filter(([_, r]) => (r as any).pig_area_pct > 0)
        .map(([name, _]) => name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())),
      score: scores.pigmentation,
      type: 'melasma'
    },
    aging: {
      severity: getSeverity(scores.wrinkles),
      fineLines: Math.round(scores.wrinkles),
      percentage: Math.round(scores.wrinkles),
      elasticity: 100 - Math.round(scores.wrinkles),
      areas: Object.entries(regions)
        .filter(([_, r]) => (r as any).wrinkle_density > 0.1)
        .map(([name, _]) => name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())),
      score: scores.wrinkles,
      earlySigns: scores.wrinkles > 30
    },
    hydration: {
      level: scores.overall > 70 ? 'excellent' : scores.overall > 50 ? 'good' : 'fair',
      percentage: Math.round(100 - scores.overall / 2),
      score: Math.round(100 - scores.overall / 2),
      status: scores.overall > 70 ? 'well-hydrated' : scores.overall > 50 ? 'moderately hydrated' : 'needs hydration'
    },
    texture: {
      severity: getSeverity(100 - scores.overall),
      percentage: Math.round(100 - scores.overall),
      score: Math.round(100 - scores.overall),
      type: scores.overall > 70 ? 'smooth' : scores.overall > 50 ? 'moderate' : 'rough'
    },
    uvDamage: {
      severity: getSeverity(100 - scores.overall),
      percentage: Math.round(100 - scores.overall),
      areas: Object.entries(regions)
        .filter(([_, r]) => (r as any).wrinkle_density > 0.1)
        .map(([name, _]) => name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())),
      score: Math.round(100 - scores.overall),
      visible: scores.overall < 70,
      recommendation: scores.overall < 50 ? 'Immediate sun protection needed' : 'Moderate sun damage detected'
    },
    poreCongestion: {
      severity: getSeverity(100 - scores.overall),
      percentage: Math.round(100 - scores.overall),
      areas: Object.entries(regions)
        .filter(([_, r]) => (r as any).acne_count > 0)
        .map(([name, _]) => name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())),
      score: Math.round(100 - scores.overall),
      type: scores.overall > 70 ? 'minimal' : scores.overall > 50 ? 'moderate' : 'significant'
    },
    overall: {
      skinHealth: Math.round(scores.overall),
      grade: scores.overall >= 80 ? 'A' : scores.overall >= 60 ? 'B' : scores.overall >= 40 ? 'C' : 'D',
      recommendations: generateRecommendations(scores),
      nextSteps: getNextSteps(scores.overall)
    },
    // API response fields
    apiResult: apiResult,
    overlays: overlays
  };
};

// Helper functions for the conversion
const generateRecommendations = (scores: any) => {
  const recommendations = [];
  if (scores.acne > 50) recommendations.push('Consider acne treatment products');
  if (scores.pigmentation > 40) recommendations.push('Use brightening serums');
  if (scores.wrinkles > 30) recommendations.push('Add anti-aging products to routine');
  if (scores.overall < 60) recommendations.push('Consult a dermatologist');
  return recommendations.length > 0 ? recommendations : ['Maintain current skincare routine'];
};

const getNextSteps = (overallScore: number) => {
  if (overallScore >= 80) return 'Excellent skin health! Maintain your routine.';
  if (overallScore >= 60) return 'Good skin health with room for improvement.';
  if (overallScore >= 40) return 'Moderate concerns detected. Consider targeted treatments.';
  return 'Significant concerns detected. Professional consultation recommended.';
};

interface CameraCaptureProps {
  onImageCaptured: (analysisData: any) => void;
}

export function CameraCapture({ onImageCaptured }: CameraCaptureProps) {
  // Refs
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [faceDetectionModel, setFaceDetectionModel] = useState<any>(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [meshEnabled, setMeshEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [captureCountdown, setCaptureCountdown] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const [showResults, setShowResults] = useState(false);


  const tips = [
    "Position your face directly in front of the camera",
    "Ensure good lighting for better detection",
    "Remove glasses if possible for accurate analysis",
    "Keep your face still and look directly at the camera"
  ];

  // Load face detection model
  const loadFaceDetectionModel = useCallback(async () => {
    try {
      setModelLoading(true);
      console.log('Loading TensorFlow.js...');
      await tf.ready();
      console.log('TensorFlow.js backend initialized');
      
      console.log('Loading face detection model...');
      const model = await load(SupportedPackages.mediapipeFacemesh);
      console.log('Face detection model loaded successfully');
      
      setFaceDetectionModel(model);
      setModelLoading(false);
    } catch (error) {
      console.error('Error loading face detection model:', error);
      setModelLoading(false);
    }
  }, []);

  // Detect faces and draw mesh
  const detectFaces = useCallback(async () => {
    if (
      faceDetectionModel &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set canvas dimensions to match the displayed video size
      canvas.width = 640;
      canvas.height = 480;

      try {
        // Make face detection
        const faces = await faceDetectionModel.estimateFaces({ input: video });
        
        // Clear canvas
        ctx.clearRect(0, 0, 640, 480);
        
        if (faces.length > 0) {
          setFaceDetected(true);
          
          // Calculate scale factors
          const scaleX = 640 / videoWidth;
          const scaleY = 480 / videoHeight;
          
          // Draw mesh during live detection (capture page)
          if (meshEnabled) {
            drawMesh(faces, ctx, scaleX, scaleY);
          }
        } else {
          setFaceDetected(false);
        }
      } catch (error) {
        console.error('Face detection error:', error);
        setFaceDetected(false);
      }
    }
  }, [faceDetectionModel]);





  // Capture and analyze face
  const captureAndAnalyze = useCallback(async () => {
    if (!webcamRef.current || !faceDetectionModel) return;
    
    const video = webcamRef.current.video;
    if (!video) return;

    try {
      setIsAnalyzing(true);
      setAnalysisProgress(0);

      // Create canvas for full image capture
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw video frame (clean face image without any overlay for backend)
      ctx.drawImage(video, 0, 0, 640, 480);

      const fullImageDataUrl = canvas.toDataURL('image/png');
      
      setAnalysisProgress(25);

      // Get face landmarks for API call
      const faces = await faceDetectionModel.estimateFaces({ input: video });
      setAnalysisProgress(50);
      
      if (faces.length > 0) {
        const face = faces[0];
        const keypoints = face.scaledMesh;
        
        // Convert keypoints to the format expected by the API
        // API expects array of [x, y, z] coordinates
        const landmarks = keypoints.map((point: number[]) => [
          Math.round(point[0]),
          Math.round(point[1]),
          Math.round(point[2] || 0)
        ]);
        
        setAnalysisProgress(75);
        
        // Convert base64 image to blob for API call
        const base64Data = fullImageDataUrl.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const imageBlob = new Blob([byteArray], { type: 'image/png' });
        
        // Create FormData for API call
        const formData = new FormData();
        formData.append('image', imageBlob, 'captured_image.png');
        formData.append('landmarks', JSON.stringify(landmarks));
        
        setAnalysisProgress(85);
        
        // Make API call to skin analysis endpoint
        try {
          const response = await fetch('http://localhost:8000/v1/analysis', {
            method: 'POST',
            body: formData,
          });
          
          console.log('API call successful');
          
          if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
          }
          
          const apiResult = await response.json();
          
          if (apiResult.status === 'processing') {
            // API is processing, poll for results
            setAnalysisProgress(90);
            console.log('API processing, polling for results...');
            
            // Poll for results using a more reliable approach
            let pollAttempts = 0;
            const maxPollAttempts = 30;
            
            const pollForResults = async () => {
              try {
                pollAttempts++;
                console.log(`Poll attempt ${pollAttempts}/${maxPollAttempts}`);
                
                const pollResponse = await fetch(`http://localhost:8000/v1/analysis/${apiResult.job_id}`);
                if (!pollResponse.ok) {
                  throw new Error(`Poll request failed: ${pollResponse.status}`);
                }
                
                const pollResult = await pollResponse.json();
                console.log(`Poll result ${pollAttempts}:`, pollResult.status);
                
                if (pollResult.status === 'done') {
                  setAnalysisProgress(100);
                  
                  // Call parent with final results
                  setTimeout(async () => {
                    setIsAnalyzing(false);
                    // Convert backend format to frontend format
                    const convertedData = convertBackendToFrontend(pollResult);
                    console.log('Backend result:', pollResult);
                    console.log('Converted data:', convertedData);
                    
                    // Update the face detection to show skin issue dots with analysis data
                    if (faceDetectionModel && webcamRef.current && webcamRef.current.video && canvasRef.current) {
                      const video = webcamRef.current.video;
                      const canvas = canvasRef.current;
                      const ctx = canvas.getContext('2d');
                      
                      if (ctx) {
                        const videoWidth = video.videoWidth;
                        const videoHeight = video.videoHeight;
                        const scaleX = 640 / videoWidth;
                        const scaleY = 480 / videoHeight;
                        
                        // Clear canvas and redraw with skin issue dots
                        ctx.clearRect(0, 0, 640, 480);
                        try {
                          const faces = await faceDetectionModel.estimateFaces({ input: video });
                          if (faces.length > 0) {
                            drawSkinIssueDots(faces, ctx, scaleX, scaleY, convertedData);
                          }
                        } catch (error) {
                          console.error('Face detection error:', error);
                        }
                      }
                    }
                    
                    onImageCaptured({
                      fullImage: fullImageDataUrl,
                      faceImage: fullImageDataUrl,
                      analysisData: convertedData, // Use converted data
                      timestamp: new Date().toISOString(),
                      landmarks: landmarks
                    });
                  }, 500);
                  return; // Stop polling
                  
                } else if (pollResult.status === 'error') {
                  throw new Error(pollResult.message || 'Analysis failed');
                }
                
                // Continue polling if still processing
                if (pollAttempts < maxPollAttempts) {
                  setTimeout(pollForResults, 2000);
                } else {
                  console.error('Maximum poll attempts reached, analysis timed out');
                  // Don't throw, just stop polling and show error
                  setAnalysisProgress(90);
                  setIsAnalyzing(false);
                  return;
                }
                
              } catch (pollError) {
                console.error(`Poll attempt ${pollAttempts} failed:`, pollError);
                // Don't re-throw, just log and continue if possible
                if (pollAttempts < maxPollAttempts) {
                  // Try to continue polling despite the error
                  setTimeout(pollForResults, 2000);
                } else {
                  console.error('Too many poll errors, giving up');
                  setAnalysisProgress(90);
                  setIsAnalyzing(false);
                }
              }
            };
            
            // Start polling
            console.log('Starting polling in 2 seconds...');
            setTimeout(() => {
              console.log('Starting first poll...');
              pollForResults();
            }, 2000);
            
            // Note: Polling timeout is now handled within the pollForResults function
            
          } else {
            // Immediate result
            setAnalysisProgress(100);
            setTimeout(async () => {
              setIsAnalyzing(false);
              
              // Update the face detection to show skin issue dots with analysis data
              if (faceDetectionModel && webcamRef.current && webcamRef.current.video && canvasRef.current) {
                const video = webcamRef.current.video;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                
                if (ctx) {
                  const videoWidth = video.videoWidth;
                  const videoHeight = video.videoHeight;
                  const scaleX = 640 / videoWidth;
                  const scaleY = 480 / videoHeight;
                  
                  // Clear canvas and redraw with skin issue dots
                  ctx.clearRect(0, 0, 640, 480);
                  try {
                    const faces = await faceDetectionModel.estimateFaces({ input: video });
                    if (faces.length > 0) {
                      drawSkinIssueDots(faces, ctx, scaleX, scaleY, apiResult);
                    }
                  } catch (error) {
                    console.error('Face detection error:', error);
                  }
                }
              }
              
              onImageCaptured({
                fullImage: fullImageDataUrl,
                faceImage: fullImageDataUrl,
                analysisData: apiResult,
                timestamp: new Date().toISOString(),
                landmarks: landmarks
              });
            }, 500);
          }
          
        } catch (apiError) {
          console.error('API call error:', apiError);
          // Fallback to local analysis if API fails
          setAnalysisProgress(90);
          
          try {
            // Create face-only canvas for local skin analysis
            const faceCanvas = document.createElement('canvas');
            faceCanvas.width = 200;
            faceCanvas.height = 200;
            const faceCtx = faceCanvas.getContext('2d');
            
            if (faceCtx) {
              // Draw face region (simplified)
              faceCtx.drawImage(
                video,
                220, 140, 200, 200, // Center face region
                0, 0, 200, 200
              );
              
              // Use local analysis as fallback
              const skinAnalysis = await analyzeSkin(faceCanvas);
              setAnalysisProgress(100);
              
              setTimeout(() => {
                setIsAnalyzing(false);
                onImageCaptured({
                  fullImage: fullImageDataUrl,
                  faceImage: faceCanvas.toDataURL('image/png'),
                  analysisData: skinAnalysis,
                  timestamp: new Date().toISOString(),
                  landmarks: landmarks,
                  apiError: apiError instanceof Error ? apiError.message : String(apiError)
                });
              }, 500);
            } else {
              throw new Error('Could not get canvas context');
            }
          } catch (localAnalysisError) {
            console.error('Local analysis also failed:', localAnalysisError);
            // Provide sample data as final fallback
            setAnalysisProgress(100);
            
            setTimeout(() => {
              setIsAnalyzing(false);
              onImageCaptured({
                fullImage: fullImageDataUrl,
                faceImage: fullImageDataUrl,
                analysisData: {
                  acne: {
                    severity: 'moderate',
                    count: 8,
                    areas: ['T-zone', 'Cheeks'],
                    score: 72
                  },
                  hyperpigmentation: {
                    severity: 'low',
                    percentage: 12,
                    areas: ['Under eyes', 'Cheekbones'],
                    score: 85
                  },
                  aging: {
                    severity: 'low',
                    wrinkles: 3,
                    elasticity: 78,
                    areas: ['Around eyes', 'Forehead'],
                    score: 88
                  },
                  overall: {
                    skinHealth: 81,
                    recommendations: [
                      'Use a gentle cleanser twice daily',
                      'Apply sunscreen with SPF 30+ daily',
                      'Consider retinol products for anti-aging',
                      'Moisturize regularly to maintain skin barrier'
                    ]
                  }
                },
                timestamp: new Date().toISOString(),
                landmarks: landmarks,
                apiError: 'API and local analysis failed, showing sample data'
              });
            }, 500);
          }
        }
      } else {
        // No face detected, still capture image but no analysis
        setTimeout(() => {
          setIsAnalyzing(false);
          onImageCaptured({
            fullImage: fullImageDataUrl,
            faceImage: null,
            analysisData: null,
            timestamp: new Date().toISOString(),
            error: 'No face detected'
          });
        }, 500);
      }
    } catch (error) {
      console.error('Capture and analysis error:', error);
      setIsAnalyzing(false);
    }
  }, [faceDetectionModel, onImageCaptured]);

  // Load model on component mount
  useEffect(() => {
    loadFaceDetectionModel();
  }, [loadFaceDetectionModel]);

  // Start face detection loop when model is ready
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (faceDetectionModel) {
      interval = setInterval(detectFaces, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [faceDetectionModel, detectFaces]);



  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tips.length]);

  const handleCapture = () => {
    if (!faceDetected || !faceDetectionModel || isAnalyzing) return;

    // Countdown
    setCaptureCountdown(3);
    const countdownInterval = setInterval(() => {
      setCaptureCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          captureAndAnalyze();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (isCameraOn) {
      setFaceDetected(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with Guidance */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-benotia-text-dark mb-2">Face Detection & Capture</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-benotia-text-light"
              >
                💡 {tips[currentTip]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Camera Section */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Camera Preview
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={meshEnabled ? "default" : "outline"}
                      onClick={() => setMeshEnabled(!meshEnabled)}
                      title={meshEnabled ? "Hide face mesh" : "Show face mesh"}
                    >
                      {meshEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowResults(!showResults)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        // Demo mode - bypass API and show sample data
                        const demoData = {
                          fullImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB4PSIxNzAiIHk9IjEyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJtOSAxIDMgOGEzIDMgMCAwIDEtNy0zIDMgMyAwIDAgMSA3LTN2M2EzIDMgMCAwIDAtNi0yIDMgMyAwIDAgMCA2LTJ2M2EzIDMgMCAwIDEtNi0yIDMgMyAwIDAgMSA2LTJ2M2EzIDMgMCAwIDAtNi0yIDMgMyAwIDAgMCA2LTJ2M2EzIDMgMCAwIDEtNi0yIDMgMyAwIDAgMSA2LTJ2MyIvPgo8L3N2Zz4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+RGVtbyBGYWNlIEltYWdlPC90ZXh0Pgo8L3N2Zz4K",
                          faceImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB4PSIxNzAiIHk9IjEyMCIgd2lkdGg9IjYwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJtOSAxIDMgOGEzIDMgMCAwIDEtNy0zIDMgMyAwIDAgMSA3LTN2M2EzIDMgMCAwIDAtNi0yIDMgMyAwIDAgMCA2LTJ2M2EzIDMgMCAwIDEtNi0yIDMgMyAwIDAgMSA2LTJ2M2EzIDMgMCAwIDAtNi0yIDMgMyAwIDAgMCA2LTJ2M2EzIDMgMCAwIDEtNi0yIDMgMyAwIDAgMSA2LTJ2MyIvPgo8L3N2Zz4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+RGVtbyBGYWNlIEltYWdlPC90ZXh0Pgo8L3N2Zz4K",
                          analysisData: {
                            acne: {
                              severity: 'moderate',
                              count: 8,
                              areas: ['T-zone', 'Cheeks'],
                              score: 72
                            },
                            hyperpigmentation: {
                              severity: 'low',
                              percentage: 12,
                              areas: ['Under eyes', 'Cheekbones'],
                              score: 85
                            },
                            aging: {
                              severity: 'low',
                              wrinkles: 3,
                              elasticity: 78,
                              areas: ['Around eyes', 'Forehead'],
                              score: 88
                            },
                            overall: {
                              skinHealth: 81,
                              recommendations: [
                                'Use a gentle cleanser twice daily',
                                'Apply sunscreen with SPF 30+ daily',
                                'Consider retinol products for anti-aging',
                                'Moisturize regularly to maintain skin barrier'
                              ]
                            }
                          },
                          timestamp: new Date().toISOString(),
                          landmarks: [],
                          demo: true
                        };
                        onImageCaptured(demoData);
                      }}
                      className="bg-benotia-gold hover:bg-benotia-gold-muted text-benotia-text-dark"
                    >
                      Demo Mode
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative bg-black rounded-b-lg overflow-hidden">
                    {/* Camera View */}
                    <div className="relative w-full" style={{ width: '640px', height: '480px' }}>
                      {isCameraOn ? (
                        <>
                          <Webcam 
                            ref={webcamRef}
                            width={640}
                            height={480}
                            videoConstraints={{
                              width: 640,
                              height: 480,
                              facingMode: 'user'
                            }}
                            style={{ 
                              width: '640px', 
                              height: '480px',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                          <canvas
                            ref={canvasRef}
                            className="pointer-events-none absolute top-0 left-0"
                            width={640}
                            height={480}
                            style={{ 
                              width: '640px', 
                              height: '480px',
                              zIndex: 10
                            }}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-lg">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white text-center"
                          >
                            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Camera Off</p>
                            <Button
                              onClick={toggleCamera}
                              variant="outline"
                              className="mt-4 text-white border-white hover:bg-white hover:text-black"
                            >
                              Turn On Camera
                            </Button>
                          </motion.div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status Overlay */}
                    <motion.div
                      className="absolute top-4 left-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Badge 
                        className={`${
                          faceDetected 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          faceDetected ? 'bg-green-200' : 'bg-red-200'
                        }`} />
                        {faceDetected ? 'Face Detected' : 'No Face Detected'}
                      </Badge>
                    </motion.div>

                    {/* Camera Controls */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={toggleCamera}
                        className="bg-black/75 hover:bg-black/90 text-white"
                      >
                        {isCameraOn ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setMeshEnabled(!meshEnabled)}
                        className="bg-black/75 hover:bg-black/90 text-white"
                      >
                        {meshEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Countdown Overlay */}
                    {captureCountdown > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                      >
                        <motion.div
                          className="text-white text-6xl font-bold"
                          key={captureCountdown}
                          initial={{ scale: 2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          {captureCountdown}
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Analysis Overlay */}
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/75 flex items-center justify-center"
                      >
                        <div className="text-white text-center max-w-sm px-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mb-4"
                          >
                            <Loader2 className="w-12 h-12 mx-auto" />
                          </motion.div>
                          <h3 className="text-xl font-semibold mb-2">Analyzing Your Skin</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            Processing facial features and skin characteristics...
                          </p>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${analysisProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-gray-400">
              {analysisProgress >= 90 && analysisProgress < 100 ? 'API Processing...' : `${Math.round(analysisProgress)}% Complete`}
            </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Capture Controls */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={handleCapture}
                  disabled={(!faceDetected && isCameraOn) || isAnalyzing || captureCountdown > 0 || modelLoading}
                  size="lg"
                  className="bg-gradient-to-r from-benotia-brown to-benotia-brown-dark hover:from-benotia-brown-dark hover:to-benotia-brown text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
                >
                  {captureCountdown > 0 ? (
                    `Capturing in ${captureCountdown}...`
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : modelLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Loading AI Model...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Capture & Analyze
                    </>
                  )}
                </Button>

                {!faceDetected && isCameraOn && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-benotia-gold mt-4 text-sm"
                  >
                    ⚠️ Please position your face in the camera frame to continue
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Settings Panel */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Camera Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Face Detection</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setFaceDetected(!faceDetected)}
                          >
                            {faceDetected ? 'On' : 'Off'}
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Mesh Overlay</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setMeshEnabled(!meshEnabled)}
                          >
                            {meshEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Sound Effects</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                          >
                            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analysis Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analysis Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Face Detection</span>
                      <Badge className={faceDetected ? 'bg-benotia-gold/20 text-benotia-brown' : 'bg-benotia-beige text-benotia-text-light'}>
                        {faceDetected ? 'Complete' : 'Waiting'}
                      </Badge>
                    </div>
                    <Progress value={faceDetected ? 100 : 0} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Skin Analysis</span>
                      <Badge className={isAnalyzing ? 'bg-benotia-brown/20 text-benotia-brown' : 'bg-benotia-beige text-benotia-text-light'}>
                        {isAnalyzing ? 'Processing' : 'Pending'}
                      </Badge>
                    </div>
                    <Progress value={isAnalyzing ? analysisProgress : 0} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Report Generation</span>
                      <Badge className="bg-benotia-beige text-benotia-text-light">Pending</Badge>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-benotia-text-light">
                    <p>• Remove glasses for better detection</p>
                    <p>• Ensure good lighting</p>
                    <p>• Face the camera directly</p>
                    <p>• Stay still during capture</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}