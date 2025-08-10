"use client";

import { Button } from "./ui/button";
import { Menu, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FDF9F3]/95 backdrop-blur-sm border-b border-[#8B6F47]/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <Image
                src="/Benotia.png"
                alt="Benotia Luxury Skincare Logo"
                width={180}
                height={60}
                className="h-12 lg:h-16 w-auto"
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
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#ai-analysis" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
              AI Analysis
            </a>
            <a href="#products" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
              Products
            </a>
            <a href="#why-benotia" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
              Why Benotia
            </a>
            <a href="#testimonials" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
              Results
            </a>
            <a href="#education" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
              Education
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-[#5A4A3A] hover:text-[#8B6F47] hover:bg-[#F5F1EB]">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#5A4A3A] hover:text-[#8B6F47] hover:bg-[#F5F1EB]">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button 
              className="bg-[#D4AF37] text-[#2C1810] hover:bg-[#B8941F] px-6"
              onClick={() => window.open('http://localhost:3000', '_blank')}
            >
              Analyze My Skin
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#5A4A3A] hover:text-[#8B6F47]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#8B6F47]/20">
            <nav className="flex flex-col space-y-4">
              <a href="#ai-analysis" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
                AI Analysis
              </a>
              <a href="#products" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
                Products
              </a>
              <a href="#why-benotia" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
                Why Benotia
              </a>
              <a href="#testimonials" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
                Results
              </a>
              <a href="#education" className="text-[#5A4A3A] hover:text-[#8B6F47] transition-colors duration-300">
                Education
              </a>
              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full bg-[#D4AF37] text-[#2C1810] hover:bg-[#B8941F]"
                  onClick={() => window.open('http://localhost:3000', '_blank')}
                >
                  Analyze My Skin
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="border-[#8B6F47]/30 text-[#5A4A3A]">
                    <User className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-[#8B6F47]/30 text-[#5A4A3A]">
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}