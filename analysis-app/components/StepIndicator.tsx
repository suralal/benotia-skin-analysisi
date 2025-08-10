import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index <= currentStep;

        return (
          <React.Fragment key={step.id}>
            <motion.div
              className={`relative flex flex-col items-center group ${
                isClickable ? 'cursor-pointer' : ''
              }`}
              onClick={() => isClickable && onStepClick(index)}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            >
              {/* Step Circle */}
              <motion.div
                className={`
                  relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 border-2
                  ${isCompleted 
                    ? 'bg-benotia-gold border-benotia-gold text-benotia-text-dark' 
                    : isCurrent 
                    ? 'bg-benotia-brown border-benotia-brown text-white' 
                    : 'bg-white border-benotia-brown/30 text-benotia-text-light'
                  }
                  ${isClickable ? 'hover:shadow-md' : ''}
                `}
                initial={false}
                animate={{
                  backgroundColor: isCompleted 
                    ? 'var(--benotia-gold)' 
                    : isCurrent 
                    ? 'var(--benotia-brown)' 
                    : '#ffffff'
                }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                ) : (
                  <span className="text-sm sm:text-base font-medium">
                    {index + 1}
                  </span>
                )}

                {/* Current step pulse */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-benotia-brown"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ 
                      scale: [1, 1.2, 1], 
                      opacity: [0.6, 0, 0.6] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>

              {/* Step Label */}
              <div className="hidden sm:block text-center mt-2 min-w-0">
                <div className={`
                  text-xs font-medium transition-colors
                  ${isCurrent ? 'text-benotia-brown' : isCompleted ? 'text-benotia-gold' : 'text-benotia-text-light'}
                `}>
                  {step.title}
                </div>
                <div className="text-xs text-benotia-text-light mt-0.5 max-w-20 truncate">
                  {step.description}
                </div>
              </div>

              {/* Tooltip for mobile */}
              <div className="sm:hidden absolute -top-12 left-1/2 transform -translate-x-1/2 
                            bg-benotia-text-dark text-white px-2 py-1 rounded text-xs whitespace-nowrap
                            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {step.title}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                              border-l-4 border-r-4 border-t-4 border-transparent border-t-benotia-text-dark"></div>
              </div>
            </motion.div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
                          <div className="hidden sm:block relative">
              <div className="w-8 md:w-12 h-0.5 bg-benotia-beige">
                <motion.div
                  className="h-full bg-gradient-to-r from-benotia-gold to-benotia-brown"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: index < currentStep ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}