import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ChevronRight } from "lucide-react";

export function Footer() {
  const quickLinks = [
    { name: "About Benotia", href: "#about" },
    { name: "AI Technology", href: "#ai-analysis" },
    { name: "Products", href: "#products" },
    { name: "Consultations", href: "#consultations" },
    { name: "Contact Us", href: "#contact" }
  ];

  const productCategories = [
    { name: "Hyperpigmentation", href: "#hyperpigmentation" },
    { name: "Anti-Acne", href: "#anti-acne" },
    { name: "Anti-Aging", href: "#anti-aging" },
    { name: "Sensitive Skin", href: "#sensitive" },
    { name: "Men's Skincare", href: "#mens" }
  ];

  const supportLinks = [
    { name: "FAQ", href: "#faq" },
    { name: "Shipping & Returns", href: "#shipping" },
    { name: "Track Your Order", href: "#track" },
    { name: "Size Guide", href: "#guide" },
    { name: "Customer Support", href: "#support" }
  ];

  const companyLinks = [
    { name: "Our Story", href: "#story" },
    { name: "Careers", href: "#careers" },
    { name: "Press", href: "#press" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" }
  ];

  return (
    <footer className="bg-[#2C1810] text-white">
      {/* Newsletter Section */}
      <div className="bg-[#8B6F47] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl mb-4" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600 }}>
              Stay Glowing
            </h3>
            <p className="text-lg mb-8 text-white/90">
              Expert skincare tips & exclusive offers delivered to your inbox
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/70 focus:border-[#8B6F47]"
              />
                              <Button className="bg-[#8B6F47] text-white hover:bg-[#6B5A3A] px-8">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-white/70 mt-4">
              Join 50,000+ skincare enthusiasts. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'Crimson Text, serif' }}>
                    Benotia
                  </h2>
                  <p className="text-white/80 leading-relaxed max-w-md">
                    Revolutionizing skincare with AI-powered personalization for Indian skin. 
                    Experience the perfect blend of ancient wisdom and modern science.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#8B6F47]" />
                    <span className="text-white/80">hello@benotia.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-[#8B6F47]" />
                    <span className="text-white/80">+91 80-4567-8900</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-white/80">Bangalore, Karnataka, India</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, href: "#facebook" },
                    { icon: Instagram, href: "#instagram" },
                    { icon: Twitter, href: "#twitter" },
                    { icon: Youtube, href: "#youtube" }
                  ].map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center hover:bg-[#B8941F] transition-colors duration-300"
                      >
                        <IconComponent className="h-5 w-5 text-[#2C1810]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6 text-[#D4AF37]">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-[#D4AF37] transition-colors duration-300 flex items-center group"
                    >
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-1" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold mb-6 text-[#D4AF37]">Products</h4>
              <ul className="space-y-3">
                {productCategories.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-[#D4AF37] transition-colors duration-300 flex items-center group"
                    >
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-1" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-6 text-[#D4AF37]">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-[#D4AF37] transition-colors duration-300 flex items-center group"
                    >
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-1" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-white/60 text-sm">
                © 2025 Benotia. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {companyLinks.slice(3).map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-white/60 hover:text-[#D4AF37] text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white/60 text-sm">Made with ❤️ for Indian Skin</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}