import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle, Award, Shield, Microscope, Thermometer, Users } from "lucide-react";

export function WhyBenotiaSection() {
  const differentiators = [
    {
      icon: Microscope,
      title: "Multi-active formulas targeting root causes",
      description: "Our products combine multiple scientifically-proven active ingredients that work synergistically to address the underlying causes of skin concerns, not just symptoms."
    },
    {
      icon: Thermometer,
      title: "Designed for Indian skin & climate",
      description: "Formulated specifically for the unique needs of Indian skin types and the challenges of humid, tropical climate conditions."
    },
    {
      icon: Users,
      title: "Continuous progress tracking & dermatologist oversight",
      description: "Regular check-ins with certified dermatologists and AI-powered progress tracking ensure your skincare journey stays on track."
    }
  ];

  const certifications = [
    { name: "ISO 9001:2015", description: "Quality Management System" },
    { name: "WHO GMP", description: "Good Manufacturing Practice" },
    { name: "Halal Certified", description: "Halal Ingredients Verified" },
    { name: "FSSAI Licensed", description: "Food Safety Standards Authority" },
    { name: "Dermatologically Tested", description: "Clinically Validated" },
    { name: "Cruelty Free", description: "No Animal Testing" }
  ];

  return (
    <section id="why-benotia" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl mb-6" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
            Why Choose Benotia?
          </h2>
          <p className="text-lg text-[#5A4A3A] leading-relaxed">
            Experience the perfect blend of ancient wisdom and modern science, created specifically for Indian skin.
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Visual Content */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {/* AI Technology Interface */}
              <div className="space-y-4">
                <div className="bg-[#FDF9F3] rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-[#2C1810]">AI Analysis Active</span>
                  </div>
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop"
                    alt="AI Technology Interface"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <div className="bg-[#F5F1EB] rounded-xl p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]">50M+</div>
                    <div className="text-sm text-[#5A4A3A]">Skin analyses completed</div>
                  </div>
                </div>
              </div>

              {/* Dermatologist Consultations */}
              <div className="space-y-4">
                <div className="bg-[#FDF9F3] rounded-xl p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#8B6F47]">200+</div>
                    <div className="text-sm text-[#5A4A3A]">Certified dermatologists</div>
                  </div>
                </div>

                <div className="bg-[#F5F1EB] rounded-2xl p-6 shadow-lg">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=150&fit=crop"
                    alt="Dermatologist consultation"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-[#2C1810]">Expert verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* R&D Lab Image */}
            <div className="bg-[#FDF9F3] rounded-2xl p-6 shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=200&fit=crop"
                alt="R&D Laboratory"
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#2C1810]">State-of-the-art R&D Lab</h4>
                  <p className="text-sm text-[#5A4A3A]">Where innovation meets tradition</p>
                </div>
                <Award className="h-8 w-8 text-[#D4AF37]" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              {differentiators.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex space-x-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#F5F1EB] rounded-full flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-300">
                        <IconComponent className="h-6 w-6 text-[#8B6F47] group-hover:text-[#2C1810]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[#2C1810]">{item.title}</h3>
                      <p className="text-[#5A4A3A] leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#F5F1EB]">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">98%</div>
                <div className="text-sm text-[#5A4A3A]">Customer satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8B6F47]">30 days</div>
                <div className="text-sm text-[#5A4A3A]">Visible results</div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-[#FDF9F3] rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl mb-4" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
              Trusted & Certified
            </h3>
            <p className="text-[#5A4A3A]">
              Our commitment to quality and safety is validated by leading international certifications
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-sm smooth-hover hover:shadow-lg hover:-translate-y-1 border border-[#F5F1EB]">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#B8941F] transition-colors">
                    <Shield className="h-6 w-6 text-[#2C1810]" />
                  </div>
                  <h4 className="font-semibold text-[#2C1810] mb-2 text-sm">{cert.name}</h4>
                  <p className="text-xs text-[#5A4A3A]">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}