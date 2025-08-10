import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisReport } from './components/AnalysisReport';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StepIndicator } from './components/StepIndicator';
import { Button } from './components/ui/button';
import { ArrowLeft } from 'lucide-react';

export interface SkinAnalysisData {
  acne?: {
    severity: 'low' | 'moderate' | 'high';
    count: number;
    percentage: number;
    areas: string[];
    score: number;
    type: string;
  };
  hyperpigmentation?: {
    severity: 'low' | 'moderate' | 'high';
    percentage: number;
    areas: string[];
    score: number;
    type: string;
  };
  aging?: {
    severity: 'low' | 'moderate' | 'high';
    fineLines: number;
    percentage: number;
    elasticity: number;
    areas: string[];
    score: number;
    earlySigns: boolean;
  };
  uvDamage?: {
    severity: 'low' | 'moderate' | 'high';
    percentage: number;
    areas: string[];
    score: number;
    visible: boolean;
    recommendation?: string;
  };
  poreCongestion?: {
    severity: 'low' | 'moderate' | 'high';
    percentage: number;
    areas: string[];
    score: number;
    type: string;
  };
  hydration?: {
    level: string;
    percentage: number;
    score: number;
    status: string;
  };
  overall?: {
    skinHealth: number;
    grade: string;
    recommendations: string[];
    nextSteps: string;
  };
  insights?: Array<{
    type: 'surprising' | 'positive' | 'warning';
    title: string;
    message: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  beforeAfter?: {
    current: {
      acne: number;
      pigmentation: number;
      texture: number;
      hydration: number;
      aging: number;
    };
    projected: {
      acne: number;
      pigmentation: number;
      texture: number;
      hydration: number;
      aging: number;
    };
    timeline: string;
    confidence: string;
  };
  heatmap?: number[];
  // API response fields
  apiResult?: any;
  landmarks?: number[][];
  apiError?: string;
  error?: string;
}

// Sample data for UI demonstration
const sampleAnalysisData: SkinAnalysisData = {
  acne: {
    severity: 'moderate',
    count: 8,
    percentage: 15,
    areas: ['T-zone', 'Cheeks'],
    score: 72,
    type: 'inflammatory'
  },
  hyperpigmentation: {
    severity: 'low',
    percentage: 12,
    areas: ['Under eyes', 'Cheekbones'],
    score: 85,
    type: 'sun spots'
  },
  aging: {
    severity: 'low',
    fineLines: 3,
    percentage: 8,
    elasticity: 78,
    areas: ['Around eyes', 'Forehead'],
    score: 88,
    earlySigns: true
  },
  uvDamage: {
    severity: 'moderate',
    percentage: 25,
    areas: ['Cheekbones', 'Nose'],
    score: 65,
    visible: true,
    recommendation: 'Immediate sun protection needed'
  },
  poreCongestion: {
    severity: 'moderate',
    percentage: 30,
    areas: ['T-zone', 'Nose'],
    score: 70,
    type: 'moderate'
  },
  hydration: {
    level: 'good',
    percentage: 65,
    score: 65,
    status: 'good'
  },
  overall: {
    skinHealth: 81,
    grade: 'B+',
    recommendations: [
      'Use a gentle cleanser twice daily',
      'Apply sunscreen with SPF 30+ daily',
      'Consider retinol products for anti-aging',
      'Moisturize regularly to maintain skin barrier'
    ],
    nextSteps: 'Implement recommended products, re-evaluate in 4-6 weeks'
  },
  insights: [
    {
      type: 'surprising',
      title: 'Hidden Sun Damage Detected',
      message: 'Your skin looks healthy overall, but we found significant UV damage that could accelerate aging. This is often invisible to the naked eye!',
      impact: 'high'
    },
    {
      type: 'positive',
      title: 'Good Hydration Foundation',
      message: 'Your skin hydration levels are good, which helps maintain skin barrier function.',
      impact: 'low'
    }
  ],
  beforeAfter: {
    current: {
      acne: 72,
      pigmentation: 85,
      texture: 70,
      hydration: 65,
      aging: 88
    },
    projected: {
      acne: 87,
      pigmentation: 95,
      texture: 95,
      hydration: 95,
      aging: 98
    },
    timeline: '4-6 weeks with consistent routine',
    confidence: 'high'
  }
};

const sampleCapturedImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB4PSIxNzAiIHk9IjEyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJtOSAxIDMgOGEzIDMgMCAwIDEtNy0zIDMgMyAwIDAgMSA3LTN2M2EzIDMgMCAwIDAtNi0yIDMgMyAwIDAgMCA2LTJ2M2EzIDMgMCAwIDEtNi0yIDMgMyAwIDAgMSA2LTJ2M2EzIDMgMCAwIDAtNi0yIDMgMyAwIDAgMCA2LTJ2M2EzIDMgMCAwIDEtNi0yIDMgMyAwIDAgMSA2LTJ2MyIvPgo8L3N2Zz4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+U2FtcGxlIEZhY2UgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=";

const steps = [
  { id: 'welcome', title: 'Welcome', description: 'Learn about skin analysis' },
  { id: 'capture', title: 'Capture', description: 'Take your photo' },
  { id: 'analysis', title: 'Results', description: 'View your report' }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'capture' | 'analysis'>('welcome');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [captureData, setCaptureData] = useState<any>(null);

  const handleViewChange = (newView: 'welcome' | 'capture' | 'analysis') => {
    if (newView === currentView) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
    }, 150);
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentView);
  };

  const canGoBack = () => {
    return currentView !== 'welcome';
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      handleViewChange(steps[currentIndex - 1].id as 'welcome' | 'capture' | 'analysis');
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-benotia-cream via-benotia-beige to-benotia-cream">
      {/* Enhanced Header with Step Indicator */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {canGoBack() && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="flex items-center gap-2 hover:bg-benotia-beige"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </motion.div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-benotia-text-dark">AI Skin Analysis</h1>
              </div>
            </div>

            <StepIndicator 
              steps={steps} 
              currentStep={getCurrentStepIndex()} 
              onStepClick={(index) => handleViewChange(steps[index].id as 'welcome' | 'capture' | 'analysis')}
            />

            {/* Demo Navigation (smaller, secondary) */}
            <div className="hidden lg:flex gap-1 bg-benotia-beige rounded-lg p-1">
              {steps.map((step) => (
                <Button
                  key={step.id}
                  variant={currentView === step.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewChange(step.id as 'welcome' | 'capture' | 'analysis')}
                  className="text-xs px-3 py-1"
                >
                  {step.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content with Page Transitions */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className={isTransitioning ? 'pointer-events-none' : ''}
          >
            {currentView === 'welcome' && (
              <WelcomeScreen onStartAnalysis={() => handleViewChange('capture')} />
            )}
            
            {currentView === 'capture' && (
              <CameraCapture onImageCaptured={(data) => {
                setCaptureData(data);
                handleViewChange('analysis');
              }} />
            )}
            
            {currentView === 'analysis' && (
              <AnalysisReport 
                data={captureData?.analysisData || sampleAnalysisData} 
                capturedImage={captureData?.fullImage || sampleCapturedImage}
                onStartOver={() => {
                  setCaptureData(null);
                  handleViewChange('welcome');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Loading Overlay */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-40"
          >
                      <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="w-6 h-6 border-2 border-benotia-beige border-t-benotia-brown rounded-full animate-spin"></div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Floating Help Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          size="sm"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow bg-benotia-brown hover:bg-benotia-brown-dark"
        >
          ?
        </Button>
      </motion.div>
    </div>
  );
}