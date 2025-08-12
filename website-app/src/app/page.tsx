import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { AIAnalysisSection } from "../../components/AIAnalysisSection";
import { ProductShowcase } from "../../components/ProductShowcase";
import { WhyBenotiaSection } from "../../components/WhyBenotiaSection";
import { TestimonialsSection } from "../../components/TestimonialsSection";
import { EducationHub } from "../../components/EducationHub";
import { Footer } from "../../components/Footer";
import { SkincareAssistant } from "../../components/SkincareAssistant";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <Header />
      <main>
        <HeroSection />
        <AIAnalysisSection />
        <ProductShowcase />
        <WhyBenotiaSection />
        <TestimonialsSection />
        <EducationHub />
      </main>
      <Footer />
      <SkincareAssistant />
    </div>
  );
}
