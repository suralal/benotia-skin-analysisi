import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, Clock, User, ArrowRight, BookOpen, Video, Microscope } from "lucide-react";

export function EducationHub() {
  const articles = [
    {
      title: "Understanding Hyperpigmentation in Indian Skin",
      category: "Skincare Science",
      readTime: "5 min read",
      date: "Aug 8, 2025",
      author: "Dr. Priya Sharma",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=250&fit=crop",
      excerpt: "Discover why Indian skin is more prone to pigmentation and the science behind effective treatments.",
      type: "article"
    },
    {
      title: "Monsoon Skincare: Adapting Your Routine",
      category: "Seasonal Care",
      readTime: "7 min read",
      date: "Aug 5, 2025",
      author: "Dr. Rajesh Kumar",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=250&fit=crop",
      excerpt: "Essential tips to maintain healthy skin during India's humid monsoon season.",
      type: "article"
    },
    {
      title: "The Role of Antioxidants in Anti-Aging",
      category: "Anti-Aging",
      readTime: "6 min read",
      date: "Aug 3, 2025",
      author: "Dr. Meera Singh",
      image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=250&fit=crop",
      excerpt: "How antioxidants protect your skin from environmental damage and premature aging.",
      type: "article"
    },
    {
      title: "Complete Guide to Double Cleansing",
      category: "Skincare Routine",
      readTime: "4 min read",
      date: "Aug 1, 2025",
      author: "Beauty Expert Team",
      image: "https://images.unsplash.com/photo-1556228852-1815a8bb56e4?w=400&h=250&fit=crop",
      excerpt: "Master the art of double cleansing for deep pore cleansing and better product absorption.",
      type: "article"
    }
  ];

  const videoContent = [
    {
      title: "Dermatologist's Daily Skincare Routine",
      duration: "8:32",
      thumbnail: "https://images.unsplash.com/photo-1594824720259-5d0b5b98e3a2?w=300&h=200&fit=crop",
      views: "125K views"
    },
    {
      title: "Understanding Your Skin Type",
      duration: "6:45",
      thumbnail: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=200&fit=crop",
      views: "89K views"
    }
  ];

  const categories = [
    { name: "All", icon: BookOpen, count: 24 },
    { name: "Skincare Science", icon: Microscope, count: 8 },
    { name: "Seasonal Care", icon: Calendar, count: 6 },
    { name: "Anti-Aging", icon: Clock, count: 5 },
    { name: "Skincare Routine", icon: User, count: 5 }
  ];

  return (
    <section id="education" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl mb-6" style={{ fontFamily: 'Crimson Text, serif', fontWeight: 600, color: '#2C1810' }}>
            Education & Wellness Hub
          </h2>
          <p className="text-lg text-[#5A4A3A] leading-relaxed">
            Stay informed with expert insights, seasonal care tips, and the latest in skincare science.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <button
                key={index}
                className="flex items-center space-x-2 px-6 py-3 bg-[#F5F1EB] hover:bg-[#D4AF37] hover:text-[#2C1810] text-[#5A4A3A] rounded-full smooth-hover transition-all duration-300"
              >
                <IconComponent className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{category.count}</span>
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {/* Main Articles */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-8">
              {articles.map((article, index) => (
                <Card key={index} className="bg-white border-none shadow-lg hover:shadow-xl smooth-hover overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#D4AF37] text-[#2C1810] px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#2C1810] leading-snug group-hover:text-[#8B6F47] transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-[#5A4A3A] text-sm leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-[#5A4A3A]">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{article.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#F5F1EB]">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-[#F5F1EB] rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-[#8B6F47]" />
                          </div>
                          <span className="text-sm text-[#5A4A3A]">{article.author}</span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-[#8B6F47] hover:text-[#6B5537]">
                          Read More <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Video Content */}
            <Card className="bg-[#FDF9F3] border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Video className="h-5 w-5 text-[#D4AF37]" />
                  <h3 className="font-semibold text-[#2C1810]">Video Learning</h3>
                </div>
                
                <div className="space-y-4">
                  {videoContent.map((video, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-3">
                        <ImageWithFallback
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <Video className="h-6 w-6 text-[#8B6F47] ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {video.duration}
                        </div>
                      </div>
                      <h4 className="font-medium text-[#2C1810] group-hover:text-[#8B6F47] transition-colors text-sm leading-snug">
                        {video.title}
                      </h4>
                      <p className="text-xs text-[#5A4A3A] mt-1">{video.views}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-[#8B6F47] border-none shadow-lg text-white">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-lg">Stay Glowing</h3>
                  <p className="text-sm text-white/90">
                    Expert skincare tips & exclusive offers to your inbox
                  </p>
                  
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <Button className="w-full bg-[#D4AF37] text-[#2C1810] hover:bg-[#B8941F]">
                      Subscribe
                    </Button>
                  </div>
                  
                  <p className="text-xs text-white/70">
                    No spam, unsubscribe at any time
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card className="bg-white border border-[#F5F1EB] shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#2C1810] mb-4">Popular Topics</h3>
                <div className="space-y-2">
                  {[
                    "Acne treatment for teens",
                    "Natural skincare ingredients",
                    "SPF for Indian climate",
                    "Pregnancy-safe skincare",
                    "Men's grooming essentials"
                  ].map((topic, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block text-sm text-[#5A4A3A] hover:text-[#8B6F47] transition-colors py-2 border-b border-[#F5F1EB] last:border-b-0"
                    >
                      {topic}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Load More CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white px-8 py-6"
          >
            Load More Articles
          </Button>
        </div>
      </div>
    </section>
  );
}