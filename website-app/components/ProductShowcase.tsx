"use client";

import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState("hyperpigmentation");

  const categories = [
    { id: "hyperpigmentation", name: "Hyperpigmentation", color: "#D4AF37" },
    { id: "anti-acne", name: "Anti-Acne", color: "#8B6F47" },
    { id: "anti-aging", name: "Anti-Aging", color: "#6B5537" }
  ];

  const products = {
    hyperpigmentation: [
      {
        id: 1,
        name: "Brightening Vitamin C Serum",
        price: "₹1,299",
        originalPrice: "₹1,599",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 324,
        keyActives: "Ethyl Ascorbic Acid + Arbutin",
        dermatologistNote: "Clinically proven to reduce dark spots by 40% in 8 weeks",
        description: "Advanced vitamin C formula for Indian skin"
      },
      {
        id: 2,
        name: "Melanin Control Cleanser",
        price: "₹899",
        originalPrice: "₹1,099",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 256,
        keyActives: "Kojic Acid + Niacinamide",
        dermatologistNote: "Gentle yet effective for daily pigmentation control",
        description: "Brightening cleanser with natural extracts"
      },
      {
        id: 3,
        name: "Radiance Renewal Scrub",
        price: "₹749",
        originalPrice: "₹949",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 189,
        keyActives: "Glycolic Acid + Turmeric",
        dermatologistNote: "Perfect for weekly exfoliation and glow enhancement",
        description: "Gentle exfoliating scrub for brighter skin"
      },
      {
        id: 4,
        name: "Even Tone Moisturizer",
        price: "₹1,149",
        originalPrice: "₹1,399",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.9,
        reviews: 412,
        keyActives: "Alpha Arbutin + Ceramides",
        dermatologistNote: "Provides 24-hour hydration while addressing pigmentation",
        description: "Lightweight moisturizer with brightening complex"
      }
    ],
    "anti-acne": [
      {
        id: 5,
        name: "Clear Skin Salicylic Cleanser",
        price: "₹849",
        originalPrice: "₹1,049",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 298,
        keyActives: "Salicylic Acid + Tea Tree Oil",
        dermatologistNote: "Effective for controlling acne without over-drying",
        description: "Deep cleansing formula for acne-prone skin"
      },
      {
        id: 6,
        name: "Acne Control Serum",
        price: "₹1,199",
        originalPrice: "₹1,499",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 367,
        keyActives: "Niacinamide + Zinc",
        dermatologistNote: "Reduces sebum production and minimizes pores",
        description: "Targeted treatment for active breakouts"
      },
      {
        id: 7,
        name: "Oil-Free Hydrator",
        price: "₹999",
        originalPrice: "₹1,249",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 234,
        keyActives: "Hyaluronic Acid + Allantoin",
        dermatologistNote: "Hydrates without clogging pores or causing breakouts",
        description: "Lightweight moisturizer for oily, acne-prone skin"
      }
    ],
    "anti-aging": [
      {
        id: 8,
        name: "Marine Algae Renewal Mask",
        price: "₹1,549",
        originalPrice: "₹1,899",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.9,
        reviews: 445,
        keyActives: "Marine Algae + Peptides",
        dermatologistNote: "Clinically proven to improve skin elasticity by 35%",
        description: "Luxurious weekly treatment mask"
      },
      {
        id: 9,
        name: "Retinol Night Renewal Cream",
        price: "₹1,799",
        originalPrice: "₹2,199",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 378,
        keyActives: "Retinol + Bakuchiol",
        dermatologistNote: "Gentle retinol alternative suitable for sensitive skin",
        description: "Advanced anti-aging night treatment"
      },
      {
        id: 10,
        name: "Antioxidant Defense Complex",
        price: "₹1,399",
        originalPrice: "₹1,699",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 289,
        keyActives: "Vitamin E + Green Tea",
        dermatologistNote: "Protects against environmental damage and premature aging",
        description: "Daily antioxidant protection serum"
      }
    ]
  };

  return (
    <section id="products" className="py-20 lg:py-32 bg-[#F5F1EB]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl mb-6" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
            Skincare Solutions for Every Concern
          </h2>
          <p className="text-lg text-[#5A4A3A] leading-relaxed">
            Discover our scientifically formulated products, each designed specifically for Indian skin and climate conditions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 smooth-hover ${
                activeCategory === category.id
                  ? 'bg-[#D4AF37] text-[#2C1810] shadow-lg transform scale-105'
                  : 'bg-white text-[#5A4A3A] hover:bg-[#FDF9F3] border border-[#8B6F47]/20'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products[activeCategory as keyof typeof products].map((product) => (
            <div key={product.id} className="group relative">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg smooth-hover hover:shadow-2xl hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#D4AF37] text-[#2C1810]">
                      Save {Math.round(((parseFloat(product.originalPrice.replace('₹', '').replace(',', '')) - parseFloat(product.price.replace('₹', '').replace(',', ''))) / parseFloat(product.originalPrice.replace('₹', '').replace(',', ''))) * 100)}%
                    </Badge>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#2C1810]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <p className="text-sm font-medium mb-2">{product.keyActives}</p>
                      <p className="text-xs italic">"{product.dermatologistNote}"</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#2C1810] group-hover:text-[#8B6F47] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#5A4A3A]">{product.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-[#D4AF37] fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-[#5A4A3A]">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-[#2C1810]">{product.price}</span>
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[#8B6F47] text-white hover:bg-[#6B5537] smooth-hover"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white px-8 py-6"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}