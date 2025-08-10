"use client";

import { Button } from "./ui/button";
import { Upload, Brain, Stethoscope, Package, ArrowRight, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AIAnalysisSection() {
  const analysisSteps = [
    {
      icon: Upload,
      title: "Upload Photo",
      description: "Simply upload a clear photo of your face in natural lighting",
      detail: "Our AI works with any smartphone camera"
    },
    {
      icon: Brain,
      title: "Instant AI Report",
      description: "Advanced algorithms analyze 50+ skin parameters in seconds",
      detail: "Pigmentation, hydration, fine lines, pores & more"
    },
    {
      icon: Stethoscope,
      title: "Expert Dermatologist Review",
      description: "Board-certified dermatologists review and validate your results",
      detail: "Personalized recommendations from skin experts"
    },
    {
      icon: Package,
      title: "Personalized Regimen Delivery",
      description: "Receive your custom skincare routine delivered to your door",
      detail: "Products formulated for Indian skin & climate"
    }
  ];

  const mockReportData = [
    { parameter: "Hydration Level", value: 72, status: "good" },
    { parameter: "Pigmentation", value: 45, status: "needs-attention" },
    { parameter: "Fine Lines", value: 28, status: "excellent" },
    { parameter: "Pore Size", value: 55, status: "moderate" },
    { parameter: "Skin Texture", value: 82, status: "excellent" },
    { parameter: "Sun Damage", value: 35, status: "good" }
  ];

  return (
    <section id="ai-analysis" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl mb-6" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
            AI-Powered Skin Analysis
          </h2>
          <p className="text-lg text-[#5A4A3A] leading-relaxed">
            Experience the future of skincare with our advanced AI technology that understands Indian skin like never before.
          </p>
        </div>

        {/* Steps Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          {analysisSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Connector Line */}
                {index < analysisSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F5F1EB] z-0"></div>
                )}
                
                <div className="relative bg-[#FDF9F3] rounded-2xl p-8 smooth-hover hover:shadow-xl hover:-translate-y-2 border border-[#F5F1EB]">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 bg-[#D4AF37] text-[#2C1810] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-[#F5F1EB] rounded-full flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-300">
                      <IconComponent className="h-8 w-8 text-[#8B6F47] group-hover:text-[#2C1810]" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-[#2C1810] mb-2">{step.title}</h3>
                      <p className="text-[#5A4A3A] mb-3">{step.description}</p>
                      <p className="text-sm text-[#8B6F47] font-medium">{step.detail}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Report Mockup */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl lg:text-3xl mb-4" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
                Your Comprehensive Skin Report
              </h3>
              <p className="text-[#5A4A3A] leading-relaxed">
                Our AI analyzes your skin across multiple dimensions, providing you with detailed insights and personalized recommendations backed by dermatological science.
              </p>
            </div>

            <div className="space-y-4">
              {mockReportData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#FDF9F3] rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'excellent' ? 'bg-green-500' :
                      item.status === 'good' ? 'bg-blue-500' :
                      item.status === 'moderate' ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}></div>
                    <span className="font-medium text-[#2C1810]">{item.parameter}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-[#F5F1EB] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-full transition-all duration-1000"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-[#8B6F47]">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#B8941F] px-8 py-6 smooth-hover transform hover:scale-105"
              onClick={() => window.open('http://localhost:3000', '_blank')}
            >
              Get Your Free Skin Report Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[#F5F1EB]">
              {/* Report Header */}
              <div className="border-b border-[#F5F1EB] pb-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[#2C1810]">Skin Analysis Report</h4>
                    <p className="text-[#5A4A3A]">Generated on August 10, 2025</p>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Dermatologist Verified</span>
                  </div>
                </div>
              </div>

              {/* Sample Analysis */}
              <div className="space-y-6">
                <div className="text-center">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1594824720259-5d0b5b98e3a2?w=200&h=200&fit=crop&crop=face"
                    alt="Skin analysis sample"
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#F5F1EB]"
                  />
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-[#D4AF37]">Overall Score: 72/100</div>
                    <div className="text-[#5A4A3A]">Good skin health with room for improvement</div>
                  </div>
                </div>

                <div className="bg-[#FDF9F3] rounded-xl p-6">
                  <h5 className="font-semibold text-[#2C1810] mb-3">Key Recommendations:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-[#5A4A3A]">Use Vitamin C serum for pigmentation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-[#5A4A3A]">Increase hydration with hyaluronic acid</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-[#5A4A3A]">Apply broad-spectrum SPF daily</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}