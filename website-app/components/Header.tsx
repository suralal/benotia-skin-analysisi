"use client";

import { Button } from "./ui/button";
import { Menu, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f5f1eb] border-b border-[#8B6F47]/10 shadow-sm">
      <div className="container mx-auto px-6 lg:pl-8 lg:pr-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <a href="#" className="flex items-center group">
              <Image
                src="/benotia.png"
                alt="Benotia Luxury Skincare Logo"
                width={2880}
                height={960}
                className="h-48 lg:h-60 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
                style={{ 
                  mixBlendMode: 'multiply',
                  filter: 'brightness(1) contrast(1)',
                  background: 'transparent'
                }}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            <a href="#ai-analysis" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase hover:scale-105">
              AI Analysis
            </a>
            <a href="#products" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase hover:scale-105">
              Products
            </a>
            <a href="#why-benotia" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase hover:scale-105">
              Why Benotia
            </a>
            <a href="#testimonials" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase hover:scale-105">
              Results
            </a>
            <a href="#education" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase hover:scale-105">
              Education
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center">
            <Button 
              className="bg-[#8B6F47] text-white hover:bg-[#6B5A3A] px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => window.open('http://localhost:3000', '_blank')}
            >
              Analyze My Skin
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 p-2 rounded-lg hover:bg-[#F5F1EB]/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-[#8B6F47]/10 bg-[#f5f1eb]">
            <nav className="flex flex-col space-y-6">
              <a href="#ai-analysis" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase py-2 hover:bg-[#F5F1EB]/30 rounded-lg px-4">
                AI Analysis
              </a>
              <a href="#products" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase py-2 hover:bg-[#F5F1EB]/30 rounded-lg px-4">
                Products
              </a>
              <a href="#why-benotia" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase py-2 hover:bg-[#F5F1EB]/30 rounded-lg px-4">
                Why Benotia
              </a>
              <a href="#testimonials" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase py-2 hover:bg-[#F5F1EB]/30 rounded-lg px-4">
                Results
              </a>
              <a href="#education" className="text-[#2C1810] hover:text-[#8B6F47] transition-all duration-300 font-medium text-sm tracking-wide uppercase py-2 hover:bg-[#F5F1EB]/30 rounded-lg px-4">
                Education
              </a>
              <div className="pt-4 space-y-3">
                <Button 
                  className="w-full bg-[#8B6F47] text-white hover:bg-[#6B5A3A] py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 shadow-lg"
                  onClick={() => window.open('http://localhost:3000', '_blank')}
                >
                  Analyze My Skin
                </Button>

              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}