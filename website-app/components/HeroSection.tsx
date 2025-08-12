"use client";

import { Button } from "./ui/button";
import {
  ArrowRight,
  Brain,
  Shield,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative min-h-[60vh] overflow-hidden pb-8">
      {/* Full Screen Background Image */}
      <ImageWithFallback
        src="/Home.jpg"
        alt="Beautiful woman with radiant glowing skin demonstrating skincare results"
        className="absolute inset-0 w-full h-full object-cover object-top"
            />
      
      {/* Dissolving Effect - Enhanced Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f5f1eb] via-[#f5f1eb]/95 via-[#f5f1eb]/80 via-[#f5f1eb]/50 to-transparent"></div>
      
      
      

      
      {/* Content Overlay */}
      <div className="relative z-20 flex items-center justify-center min-h-[60vh] pb-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6 animate-fade-in-up lg:pl-8">
              {/* Main Heading */}
              <div className="space-y-5">
                <h1
                  className="text-5xl lg:text-7xl leading-tight font-bold text-white"
                  style={{
                    fontFamily: "Crimson Text, serif",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  }}
                >
                  Your Skin,{" "}
                  <span className="text-[#8B6F47]">
                    Scientifically Perfected
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-white/95 leading-relaxed max-w-2xl">
                  AI-powered personalization for Indian skin. Get
                  dermatologist-backed skincare solutions tailored
                  to your unique needs.
                </p>
                
                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#8B6F47] to-[#6B5A3A] text-white hover:from-[#6B5A3A] hover:to-[#8B6F47] px-10 py-6 text-xl font-semibold transform hover:scale-105 transition-all duration-300 rounded-2xl"
                    onClick={() => window.open('http://localhost:3001', '_blank')}
                  >
                    Analyze My Skin
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#2C1810] px-10 py-6 text-xl font-semibold transform hover:scale-105 transition-all duration-300 rounded-2xl"
                  >
                    Explore Products
                  </Button>
                </div>
              </div>
              
              {/* Three Pillars - Premium Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="group relative rounded-2xl p-5 transform hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-gradient-to-br from-[#8B6F47] to-[#6B5A3A] rounded-full">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-white text-base text-center">
                      AI Skin Analysis
                    </h4>
                    <p className="text-white/80 text-center text-xs leading-relaxed">
                      Precise assessment using advanced AI technology
                    </p>
                  </div>
                </div>
                
                <div className="group relative rounded-2xl p-5 transform hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-gradient-to-br from-[#8B6F47] to-[#6B5A3A] rounded-full">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-white text-base text-center">
                      Dermatologist-Backed
                    </h4>
                    <p className="text-xs text-white/80 text-center leading-relaxed">
                      Expert approved solutions and recommendations
                    </p>
                  </div>
                </div>
                
                <div className="group relative rounded-2xl p-5 transform hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-gradient-to-br from-[#8B6F47] to-[#6B5A3A] rounded-full">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-white text-base text-center">
                      Clinically Proven
                    </h4>
                    <p className="text-xs text-white/80 text-center leading-relaxed">
                      Tested and validated results you can trust
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Trust Indicators - Inline */}
              <div className="mt-6 text-center">
                <p className="text-white/90 text-sm font-medium mb-4">
                  Trusted by leading dermatologists across India
                </p>
                
                <div className="flex justify-center items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <Shield className="h-4 w-4 text-[#8B6F47]" />
                    <span className="text-xs font-medium text-white">
                      ISO Certified
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <CheckCircle className="h-4 w-4 text-[#8B6F47]" />
                    <span className="text-xs font-medium text-white">
                      WHO GMP
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <Brain className="h-4 w-4 text-[#8B6F47]" />
                    <span className="text-xs font-medium text-white">
                      AI Validated
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Clean Image Area */}
            <div className="relative h-full flex items-center justify-center">
              {/* Image is now clean without floating buttons */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}