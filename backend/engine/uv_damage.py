import cv2
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
from typing import Tuple, Dict, List

class UVDamageDetector:
    """
    Advanced UV damage detection using color space analysis and pattern recognition
    """
    
    def __init__(self):
        self.damage_thresholds = {
            'mild': 0.3,
            'moderate': 0.6,
            'severe': 0.8
        }
        
    def detect_uv_damage(self, image: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """
        Detect UV damage patterns in skin areas
        
        Args:
            image: Input image in BGR format
            skin_mask: Binary mask of skin regions
            
        Returns:
            Dictionary containing damage analysis results
        """
        # Convert to LAB color space for better skin tone analysis
        lab_image = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        
        # Extract skin regions
        skin_regions = self._extract_skin_regions(lab_image, skin_mask)
        
        # Analyze color variations
        color_analysis = self._analyze_color_variations(skin_regions)
        
        # Detect freckle patterns
        freckle_analysis = self._detect_freckle_patterns(image, skin_mask)
        
        # Analyze uneven pigmentation
        pigmentation_analysis = self._analyze_uneven_pigmentation(lab_image, skin_mask)
        
        # Generate damage heatmap
        damage_heatmap = self._generate_damage_heatmap(
            color_analysis, freckle_analysis, pigmentation_analysis, skin_mask
        )
        
        # Calculate overall damage score
        damage_score = self._calculate_damage_score(
            color_analysis, freckle_analysis, pigmentation_analysis
        )
        
        return {
            'damage_score': damage_score,
            'damage_level': self._classify_damage_level(damage_score),
            'color_variations': color_analysis,
            'freckle_patterns': freckle_analysis,
            'pigmentation_analysis': pigmentation_analysis,
            'damage_heatmap': damage_heatmap,
            'recommendations': self._generate_recommendations(damage_score)
        }
    
    def _extract_skin_regions(self, lab_image: np.ndarray, skin_mask: np.ndarray) -> np.ndarray:
        """Extract and normalize skin regions for analysis"""
        # Apply skin mask
        skin_only = cv2.bitwise_and(lab_image, lab_image, mask=skin_mask)
        
        # Normalize L channel (lightness)
        l_channel = skin_only[:, :, 0].astype(np.float32)
        l_channel = (l_channel - l_channel.min()) / (l_channel.max() - l_channel.min() + 1e-8)
        
        return l_channel
    
    def _analyze_color_variations(self, skin_regions: np.ndarray) -> Dict:
        """Analyze color variations that indicate UV damage"""
        # Calculate local color variations
        kernel = np.ones((5, 5), np.float32) / 25
        local_mean = cv2.filter2D(skin_regions, -1, kernel)
        local_variance = cv2.filter2D(skin_regions**2, -1, kernel) - local_mean**2
        
        # Detect areas with high color variation
        high_variation_mask = local_variance > np.percentile(local_variance, 85)
        
        # Calculate variation metrics
        variation_score = np.mean(local_variance[high_variation_mask]) if high_variation_mask.any() else 0
        
        return {
            'variation_score': float(variation_score),
            'high_variation_areas': float(np.sum(high_variation_mask) / high_variation_mask.size),
            'local_variance_map': local_variance
        }
    
    def _detect_freckle_patterns(self, image: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Detect freckle patterns that indicate sun damage"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply skin mask
        skin_gray = cv2.bitwise_and(gray, gray, mask=skin_mask)
        
        # Detect dark spots (potential freckles)
        # Use adaptive thresholding to find dark regions
        adaptive_thresh = cv2.adaptiveThreshold(
            skin_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
        )
        
        # Morphological operations to clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        freckle_mask = cv2.morphologyEx(adaptive_thresh, cv2.MORPH_OPEN, kernel)
        freckle_mask = cv2.morphologyEx(freckle_mask, cv2.MORPH_CLOSE, kernel)
        
        # Analyze freckle patterns
        freckle_count = cv2.connectedComponents(freckle_mask)[0] - 1
        
        # Calculate freckle density
        skin_area = np.sum(skin_mask) / 255.0
        freckle_density = freckle_count / (skin_area + 1e-8)
        
        return {
            'freckle_count': int(freckle_count),
            'freckle_density': float(freckle_density),
            'freckle_mask': freckle_mask
        }
    
    def _analyze_uneven_pigmentation(self, lab_image: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Analyze uneven pigmentation patterns"""
        # Focus on A and B channels (color information)
        a_channel = lab_image[:, :, 1].astype(np.float32)
        b_channel = lab_image[:, :, 2].astype(np.float32)
        
        # Apply skin mask
        a_skin = cv2.bitwise_and(a_channel, a_channel, mask=skin_mask)
        b_skin = cv2.bitwise_and(b_channel, b_channel, mask=skin_mask)
        
        # Calculate color distribution
        a_mean = np.mean(a_skin[skin_mask > 0])
        b_mean = np.mean(b_skin[skin_mask > 0])
        
        # Calculate color standard deviation (indicates unevenness)
        a_std = np.std(a_skin[skin_mask > 0])
        b_std = np.std(b_skin[skin_mask > 0])
        
        # Detect areas with significant color deviation
        a_deviation = np.abs(a_skin - a_mean)
        b_deviation = np.abs(b_skin - b_mean)
        
        high_deviation_mask = (a_deviation > 2*a_std) | (b_deviation > 2*b_std)
        high_deviation_ratio = np.sum(high_deviation_mask) / np.sum(skin_mask > 0)
        
        return {
            'a_channel_mean': float(a_mean),
            'b_channel_mean': float(b_mean),
            'a_channel_std': float(a_std),
            'b_channel_std': float(b_std),
            'high_deviation_ratio': float(high_deviation_ratio),
            'deviation_map': (a_deviation + b_deviation) / 2
        }
    
    def _generate_damage_heatmap(self, color_analysis: Dict, freckle_analysis: Dict, 
                                pigmentation_analysis: Dict, skin_mask: np.ndarray) -> np.ndarray:
        """Generate comprehensive UV damage heatmap"""
        # Combine different damage indicators
        damage_map = np.zeros_like(skin_mask, dtype=np.float32)
        
        # Color variation contribution
        if 'local_variance_map' in color_analysis:
            variance_map = color_analysis['local_variance_map']
            damage_map += cv2.bitwise_and(variance_map, skin_mask) * 0.4
        
        # Freckle contribution
        if 'freckle_mask' in freckle_analysis:
            freckle_map = freckle_analysis['freckle_mask'].astype(np.float32) / 255.0
            damage_map += cv2.bitwise_and(freckle_map, skin_mask) * 0.3
        
        # Pigmentation deviation contribution
        if 'deviation_map' in pigmentation_analysis:
            deviation_map = pigmentation_analysis['deviation_map']
            deviation_map = (deviation_map - deviation_map.min()) / (deviation_map.max() - deviation_map.min() + 1e-8)
            damage_map += cv2.bitwise_and(deviation_map, skin_mask) * 0.3
        
        # Normalize to 0-1 range
        damage_map = np.clip(damage_map, 0, 1)
        
        return damage_map
    
    def _calculate_damage_score(self, color_analysis: Dict, freckle_analysis: Dict, 
                              pigmentation_analysis: Dict) -> float:
        """Calculate overall UV damage score (0-100)"""
        # Weighted combination of different factors
        color_score = min(1.0, color_analysis.get('variation_score', 0) / 0.1)
        freckle_score = min(1.0, freckle_analysis.get('freckle_density', 0) / 0.05)
        pigmentation_score = pigmentation_analysis.get('high_deviation_ratio', 0)
        
        # Calculate weighted damage score
        damage_score = (
            0.4 * color_score +
            0.3 * freckle_score +
            0.3 * pigmentation_score
        )
        
        # Convert to 0-100 scale (higher = better skin health)
        final_score = max(0, 100 - (damage_score * 100))
        
        return round(final_score, 2)
    
    def _classify_damage_level(self, damage_score: float) -> str:
        """Classify damage level based on score"""
        if damage_score >= 80:
            return "excellent"
        elif damage_score >= 60:
            return "good"
        elif damage_score >= 40:
            return "moderate"
        elif damage_score >= 20:
            return "poor"
        else:
            return "severe"
    
    def _generate_recommendations(self, damage_score: float) -> List[str]:
        """Generate personalized recommendations based on damage score"""
        recommendations = []
        
        if damage_score < 40:
            recommendations.extend([
                "Consider consulting a dermatologist for professional treatment",
                "Use broad-spectrum SPF 50+ sunscreen daily",
                "Avoid peak sun hours (10 AM - 4 PM)",
                "Consider professional treatments like chemical peels or laser therapy"
            ])
        elif damage_score < 60:
            recommendations.extend([
                "Increase sunscreen usage to SPF 30+ daily",
                "Add vitamin C serum to your routine",
                "Consider retinol products for skin renewal",
                "Wear protective clothing and hats outdoors"
            ])
        elif damage_score < 80:
            recommendations.extend([
                "Maintain current sun protection habits",
                "Add antioxidants to your skincare routine",
                "Consider gentle exfoliation 2-3 times per week",
                "Monitor for any new spots or changes"
            ])
        else:
            recommendations.extend([
                "Excellent sun protection habits!",
                "Continue current skincare routine",
                "Annual skin check-ups recommended",
                "Maintain healthy lifestyle habits"
            ])
        
        return recommendations
