"use client";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Star, Quote, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeBeforeAfter, setActiveBeforeAfter] = useState(0);

  const testimonials = [
    {
      name: "Priya Sharma",
      age: 28,
      location: "Mumbai",
      concern: "Hyperpigmentation",
      rating: 5,
      text: "After years of struggling with dark spots, Benotia's AI analysis identified exactly what my skin needed. The personalized routine worked wonders - my pigmentation reduced by 60% in just 3 months!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b1c8?w=100&h=100&fit=crop&crop=face",
      results: "60% reduction in pigmentation"
    },
    {
      name: "Anjali Patel",
      age: 24,
      location: "Bangalore",
      concern: "Acne",
      rating: 5,
      text: "The dermatologist consultation was so detailed and helpful. My customized anti-acne routine cleared my skin completely. I finally have the confidence I always wanted!",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face",
      results: "95% reduction in active acne"
    },
    {
      name: "Dr. Meera Singh",
      age: 45,
      location: "Delhi",
      concern: "Anti-aging",
      rating: 5,
      text: "As a doctor myself, I was impressed by the scientific approach. The marine algae mask and retinol cream combination has visibly improved my skin texture and reduced fine lines.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      results: "40% improvement in skin elasticity"
    }
  ];

  const beforeAfterResults = [
    {
      title: "Acne Transformation",
      duration: "12 weeks",
      beforeImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=400&fit=crop&crop=face",
      afterImage: "https://images.unsplash.com/photo-1494790108755-2616b612b1c8?w=300&h=400&fit=crop&crop=face",
      improvement: "95% reduction in active acne",
      products: ["Clear Skin Cleanser", "Acne Control Serum", "Oil-Free Hydrator"]
    },
    {
      title: "Pigmentation Correction",
      duration: "8 weeks",
      beforeImage: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=400&fit=crop&crop=face",
      afterImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=400&fit=crop&crop=face",
      improvement: "70% reduction in dark spots",
      products: ["Vitamin C Serum", "Melanin Control Cleanser", "Even Tone Moisturizer"]
    },
    {
      title: "Anti-Aging Results",
      duration: "16 weeks",
      beforeImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=400&fit=crop&crop=face",
      afterImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=400&fit=crop&crop=face",
      improvement: "45% improvement in fine lines",
      products: ["Marine Algae Mask", "Retinol Night Cream", "Antioxidant Complex"]
    }
  ];

  const dermatologistEndorsements = [
    {
      name: "Dr. Rajesh Kumar",
      specialization: "Dermatologist & Cosmetic Surgeon",
      experience: "15+ years",
      text: "Benotia's approach to personalized skincare is revolutionary. The AI analysis combined with our clinical expertise provides unmatched precision in treatment.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Dr. Sunita Malhotra",
      specialization: "Pediatric Dermatologist",
      experience: "12+ years",
      text: "The formulations are specifically designed for Indian skin types. I regularly recommend Benotia products to my patients with excellent results.",
      image: "https://images.unsplash.com/photo-1594824720259-5d0b5b98e3a2?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-[#F5F1EB]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl mb-6" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
            Real Results, Real Stories
          </h2>
          <p className="text-lg text-[#5A4A3A] leading-relaxed">
            Discover how Benotia has transformed the skincare journey for thousands of customers across India.
          </p>
        </div>

        {/* Customer Testimonials Carousel */}
        <div className="mb-20">
          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-white border-none shadow-xl">
              <CardContent className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <ImageWithFallback
                        src={testimonials[activeTestimonial].image}
                        alt={testimonials[activeTestimonial].name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#D4AF37]"
                      />
                      <div className="absolute -top-2 -right-2 bg-[#D4AF37] rounded-full p-2">
                        <Quote className="h-6 w-6 text-[#2C1810]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start mb-4">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-[#D4AF37] fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-lg text-[#5A4A3A] italic mb-6 leading-relaxed">
                      "{testimonials[activeTestimonial].text}"
                    </blockquote>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#2C1810] text-xl">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-[#5A4A3A]">
                        Age {testimonials[activeTestimonial].age} • {testimonials[activeTestimonial].location}
                      </p>
                      <div className="inline-block bg-[#D4AF37] text-[#2C1810] px-4 py-2 rounded-full text-sm font-medium">
                        {testimonials[activeTestimonial].results}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl smooth-hover hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-[#8B6F47]" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl smooth-hover hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-[#8B6F47]" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-[#D4AF37]' : 'bg-[#8B6F47]/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Before & After Results */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl mb-4" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
              Dramatic Transformations
            </h3>
            <p className="text-[#5A4A3A]">
              See the real results our customers achieved with personalized Benotia regimens
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {beforeAfterResults.map((result, index) => (
              <Card key={index} className="bg-white border-none shadow-lg hover:shadow-xl smooth-hover">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="font-semibold text-[#2C1810] mb-2">{result.title}</h4>
                      <p className="text-sm text-[#5A4A3A]">{result.duration}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-[#5A4A3A] mb-2">Before</p>
                        <ImageWithFallback
                          src={result.beforeImage}
                          alt="Before treatment"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-[#5A4A3A] mb-2">After</p>
                        <ImageWithFallback
                          src={result.afterImage}
                          alt="After treatment"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="bg-[#D4AF37] text-[#2C1810] px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                        {result.improvement}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#2C1810]">Products Used:</p>
                        {result.products.map((product, productIndex) => (
                          <p key={productIndex} className="text-xs text-[#5A4A3A]">• {product}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dermatologist Endorsements */}
        <div className="bg-white rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl mb-4" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
              Expert Endorsements
            </h3>
            <p className="text-[#5A4A3A]">
              Trusted by leading dermatologists across India
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {dermatologistEndorsements.map((doctor, index) => (
              <div key={index} className="flex space-x-6 items-start">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#2C1810]">{doctor.name}</h4>
                    <p className="text-sm text-[#8B6F47]">{doctor.specialization}</p>
                    <p className="text-xs text-[#5A4A3A]">{doctor.experience} experience</p>
                  </div>
                  <blockquote className="text-[#5A4A3A] italic">
                    "{doctor.text}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>

          {/* Video Testimonial CTA */}
          <div className="text-center mt-12 pt-8 border-t border-[#F5F1EB]">
            <Button 
              variant="outline" 
              size="lg"
              className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white px-8 py-6"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Watch Video Testimonials
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}