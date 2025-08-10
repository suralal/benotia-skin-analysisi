// Test script for enhanced skin analysis
import { analyzeSkin } from './utils/utilities.js';

// Create a test canvas with sample skin data
function createTestCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  // Draw a sample face with various skin conditions
  // Background
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, 400, 300);
  
  // Face shape
  ctx.fillStyle = '#f4d4c4';
  ctx.beginPath();
  ctx.ellipse(200, 150, 80, 100, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Add some "acne" (red spots)
  ctx.fillStyle = '#ff6b6b';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(150 + i * 20, 120 + i * 10, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Add some "hyperpigmentation" (dark spots)
  ctx.fillStyle = '#8b4513';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(180 + i * 25, 180 + i * 15, 4, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Add some "UV damage" (brown areas)
  ctx.fillStyle = '#d2691e';
  ctx.fillRect(160, 100, 80, 20);
  
  return canvas;
}

// Test the enhanced analysis
async function testEnhancedAnalysis() {
  console.log('🧪 Testing Enhanced Skin Analysis...');
  
  try {
    const canvas = createTestCanvas();
    const results = await analyzeSkin(canvas);
    
    if (results) {
      console.log('✅ Analysis completed successfully!');
      console.log('\n📊 Enhanced Analysis Results:');
      console.log('================================');
      
      // Overall Score
      console.log(`🎯 Overall Skin Health: ${results.overall?.skinHealth}/100 (Grade: ${results.overall?.grade})`);
      
      // Detailed Metrics
      if (results.acne) {
        console.log(`🩹 Acne: ${results.acne.score}/100 (${results.acne.severity} severity, ${results.acne.count} spots)`);
      }
      
      if (results.hyperpigmentation) {
        console.log(`✨ Pigmentation: ${results.hyperpigmentation.score}/100 (${results.hyperpigmentation.severity} severity, ${results.hyperpigmentation.percentage}% coverage)`);
      }
      
      if (results.uvDamage) {
        console.log(`☀️ UV Damage: ${results.uvDamage.score}/100 (${results.uvDamage.severity} severity, ${results.uvDamage.visible ? 'visible' : 'not visible'})`);
      }
      
      if (results.poreCongestion) {
        console.log(`🎯 Texture: ${results.poreCongestion.score}/100 (${results.poreCongestion.severity} severity, ${results.poreCongestion.percentage}% congestion)`);
      }
      
      if (results.hydration) {
        console.log(`💧 Hydration: ${results.hydration.score}/100 (${results.hydration.level} level, ${results.hydration.status} status)`);
      }
      
      if (results.aging) {
        console.log(`⏰ Anti-aging: ${results.aging.score}/100 (${results.aging.severity} severity, ${results.aging.fineLines} fine lines detected)`);
      }
      
      // Surprising Insights
      if (results.insights && results.insights.length > 0) {
        console.log('\n💡 Surprising Insights:');
        results.insights.forEach((insight, index) => {
          console.log(`  ${index + 1}. ${insight.title}: ${insight.message}`);
        });
      }
      
      // Before/After Projection
      if (results.beforeAfter) {
        console.log('\n📈 Before/After Projection:');
        console.log(`  Timeline: ${results.beforeAfter.timeline}`);
        console.log(`  Confidence: ${results.beforeAfter.confidence}`);
        console.log('  Current vs Projected:');
        console.log(`    Acne: ${results.beforeAfter.current.acne} → ${results.beforeAfter.projected.acne}`);
        console.log(`    Texture: ${results.beforeAfter.current.texture} → ${results.beforeAfter.projected.texture}`);
        console.log(`    Hydration: ${results.beforeAfter.current.hydration} → ${results.beforeAfter.projected.hydration}`);
      }
      
      // Recommendations
      if (results.overall?.recommendations) {
        console.log('\n💡 Key Recommendations:');
        results.overall.recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec}`);
        });
      }
      
      // Next Steps
      if (results.overall?.nextSteps) {
        console.log(`\n🎯 Next Steps: ${results.overall.nextSteps}`);
      }
      
      console.log('\n🎉 Enhanced analysis test completed successfully!');
      
    } else {
      console.error('❌ Analysis returned null results');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

// Run the test if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testEnhancedAnalysis = testEnhancedAnalysis;
  console.log('🧪 Enhanced analysis test ready! Run testEnhancedAnalysis() in the console to test.');
} else {
  // Node.js environment
  testEnhancedAnalysis();
}
