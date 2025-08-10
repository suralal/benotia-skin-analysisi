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
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#FDF9F3] via-[#F5F1EB] to-[#FDF9F3] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B6F47] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <h1
                className="text-4xl lg:text-6xl leading-tight"
                style={{
                  fontFamily: "Crimson Text, serif",
                  fontWeight: 600,
                  color: "#2C1810",
                }}
              >
                Your Skin,{" "}
                <span className="text-[#D4AF37]">
                  Scientifically Perfected
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-[#5A4A3A] leading-relaxed max-w-xl">
                AI-powered personalization for Indian skin. Get
                dermatologist-backed skincare solutions tailored
                to your unique needs.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#B8941F] px-8 py-6 text-lg font-medium smooth-hover transform hover:scale-105 hover:shadow-lg"
                onClick={() => window.open('http://localhost:3000', '_blank')}
              >
                Analyze My Skin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white px-8 py-6 text-lg font-medium smooth-hover"
              >
                Explore Products
              </Button>
            </div>

            {/* Three Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3 group">
                <div className="p-3 bg-[#F5F1EB] rounded-full group-hover:bg-[#D4AF37] transition-colors duration-300">
                  <Brain className="h-6 w-6 text-[#8B6F47] group-hover:text-[#2C1810]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#2C1810]">
                    AI Skin Analysis
                  </h4>
                  <p className="text-sm text-[#5A4A3A]">
                    Precise assessment
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="p-3 bg-[#F5F1EB] rounded-full group-hover:bg-[#D4AF37] transition-colors duration-300">
                  <Shield className="h-6 w-6 text-[#8B6F47] group-hover:text-[#2C1810]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#2C1810]">
                    Dermatologist-Backed
                  </h4>
                  <p className="text-sm text-[#5A4A3A]">
                    Expert approved
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="p-3 bg-[#F5F1EB] rounded-full group-hover:bg-[#D4AF37] transition-colors duration-300">
                  <CheckCircle className="h-6 w-6 text-[#8B6F47] group-hover:text-[#2C1810]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#2C1810]">
                    Clinically Proven
                  </h4>
                  <p className="text-sm text-[#5A4A3A]">
                    Tested results
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image - Full Right Section */}
          <div className="relative animate-fade-in w-full h-full">
            <div className="relative w-full h-full min-h-[600px] lg:min-h-[700px]">
              {/* Main Image Container - Full Size */}
              <div className="relative w-full h-full bg-gradient-to-br from-[#F5F1EB] to-[#FDF9F3] rounded-3xl p-4 lg:p-6 shadow-2xl">
                <ImageWithFallback
                  src="/Home.jpg"
                  alt="Beautiful woman with radiant glowing skin demonstrating skincare results"
                  className="w-full h-full object-cover rounded-2xl opacity-85"
                />

                {/* Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#8B6F47]/10 to-transparent rounded-2xl"></div>
              </div>

              {/* Floating Statistics Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <div className="font-bold text-[#2C1810]">
                      50M+
                    </div>
                    <div className="text-[#5A4A3A] text-xs">
                      Skin Analyses
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    98%
                  </div>
                  <div className="text-sm text-[#5A4A3A]">
                    Success Rate
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white rounded-xl shadow-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-[#2C1810]" />
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-[#2C1810]">
                      AI Powered
                    </div>
                    <div className="text-[#5A4A3A]">
                      Smart Analysis
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Decorative Elements */}
              <div className="absolute -z-10 top-8 right-8 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl"></div>
              <div className="absolute -z-10 bottom-8 left-8 w-24 h-24 bg-[#8B6F47]/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-[#8B6F47]/20">
          <div className="text-center mb-8">
            <p className="text-[#5A4A3A] text-sm">
              Trusted by leading dermatologists across India
            </p>
          </div>

          <div className="flex justify-center items-center space-x-8 lg:space-x-12 opacity-60">
            {/* Trust badges/logos placeholders */}
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-[#8B6F47]" />
              <span className="text-sm font-medium text-[#8B6F47]">
                ISO Certified
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-[#8B6F47]" />
              <span className="text-sm font-medium text-[#8B6F47]">
                WHO GMP
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-[#8B6F47]" />
              <span className="text-sm font-medium text-[#8B6F47]">
                AI Validated
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}