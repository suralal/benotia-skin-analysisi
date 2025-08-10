
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Camera, Scan, BarChart3, Shield, Sparkles, Zap, Clock, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onStartAnalysis: () => void;
}

export function WelcomeScreen({ onStartAnalysis }: WelcomeScreenProps) {
  const features = [
    {
      icon: <Camera className="h-6 w-6 text-benotia-brown" />,
      title: "Face Mesh Detection",
      description: "Advanced facial landmark detection for precise analysis",
      color: "benotia-brown"
    },
    {
      icon: <Scan className="h-6 w-6 text-benotia-gold" />,
      title: "Skin Analysis",
      description: "Detect acne, hyperpigmentation, and aging symptoms",
      color: "benotia-gold"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-benotia-brown-dark" />,
      title: "Detailed Reports",
      description: "Comprehensive analysis with actionable recommendations",
      color: "benotia-brown-dark"
    },
    {
      icon: <Shield className="h-6 w-6 text-benotia-gold-muted" />,
      title: "Privacy Focused",
      description: "Your images are processed locally and not stored",
      color: "benotia-gold-muted"
    }
  ];

  const benefits = [
    { icon: <Sparkles className="h-4 w-4" />, text: "AI-Powered Analysis" },
    { icon: <Zap className="h-4 w-4" />, text: "Instant Results" },
    { icon: <Clock className="h-4 w-4" />, text: "Under 30 seconds" },
    { icon: <Star className="h-4 w-4" />, text: "Professional Grade" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 bg-benotia-cream">
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-benotia-beige text-benotia-brown px-4 py-2 rounded-full text-sm font-medium mb-6 border border-benotia-brown/20"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Skin Analysis
            <Badge className="bg-benotia-gold text-benotia-text-dark text-xs px-2 py-0.5">New</Badge>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-benotia-text-dark mb-6 leading-tight"
          >
            Professional Skin Analysis
            <span className="block text-benotia-brown">in Seconds</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-benotia-text-light mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Get comprehensive skin health insights using advanced facial mesh detection technology. 
            Detect acne, hyperpigmentation, and aging signs with clinical-grade accuracy.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-benotia-brown/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-benotia-gold">{benefit.icon}</span>
                <span className="text-sm font-medium text-benotia-text-dark">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 lg:mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="h-full border-2 hover:border-benotia-gold/40 transition-all duration-300 hover:shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <motion.div 
                    className="flex justify-center mb-3"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-3 rounded-xl bg-benotia-beige">
                      {feature.icon}
                    </div>
                  </motion.div>
                  <CardTitle className="text-lg font-semibold text-benotia-text-dark">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-benotia-text-light leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div variants={itemVariants} className="mb-12 lg:mb-16">
          <Card className="bg-gradient-to-br from-white to-benotia-beige/50 border-2 border-benotia-gold/30 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl lg:text-3xl font-bold text-benotia-text-dark mb-2">How It Works</CardTitle>
              <CardDescription className="text-lg text-benotia-text-light">Simple. Fast. Accurate.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  {
                    step: "1",
                    title: "Capture Your Face",
                    description: "Position your face in the camera frame for optimal detection",
                    color: "benotia-brown"
                  },
                  {
                    step: "2", 
                    title: "AI Analysis",
                    description: "Our algorithms analyze your skin for various conditions",
                    color: "benotia-gold"
                  },
                  {
                    step: "3",
                    title: "Get Results", 
                    description: "Receive detailed analysis and personalized recommendations",
                    color: "benotia-brown-dark"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="w-16 h-16 bg-benotia-beige rounded-full flex items-center justify-center mx-auto mb-4 relative"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <span className="text-2xl font-bold text-benotia-brown">{item.step}</span>
                      
                      {/* Animated ring */}
                      <motion.div
                        className="absolute inset-0 border-2 border-benotia-gold/40 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-benotia-text-dark mb-3">{item.title}</h3>
                    <p className="text-benotia-text-light leading-relaxed">{item.description}</p>

                    {/* Connector line for desktop */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5">
                        <motion.div
                          className="w-1/2 h-full bg-gradient-to-r from-benotia-gold/30 to-transparent"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onStartAnalysis}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-benotia-brown to-benotia-brown-dark hover:from-benotia-brown-dark hover:to-benotia-brown text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Your Skin Analysis
            </Button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-benotia-text-light"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-benotia-gold" />
              <span>100% Private & Secure</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-benotia-gold/40 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-benotia-brown" />
              <span>Results in 30 seconds</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-benotia-gold/40 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-benotia-gold-muted" />
              <span>No signup required</span>
            </div>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="mt-8 text-sm text-benotia-text-light max-w-2xl mx-auto leading-relaxed"
          >
            <strong>Medical Disclaimer:</strong> This analysis is for educational and informational purposes only. 
            Results should not be used for medical diagnosis or treatment decisions. 
            Please consult with a qualified dermatologist for professional medical advice.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}