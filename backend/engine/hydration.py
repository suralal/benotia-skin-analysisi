import cv2
import numpy as np
from scipy import ndimage
from scipy.stats import entropy
from typing import Dict, Tuple, List
import matplotlib.pyplot as plt

class HydrationAnalyzer:
    """
    Advanced hydration analysis using texture analysis and surface roughness assessment
    """
    
    def __init__(self):
        self.hydration_thresholds = {
            'dehydrated': 0.3,
            'dry': 0.5,
            'normal': 0.7,
            'well_hydrated': 0.85,
            'excellent': 1.0
        }
        
    def analyze_hydration(self, image: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """
        Analyze skin hydration levels using multiple techniques
        
        Args:
            image: Input image in BGR format
            skin_mask: Binary mask of skin regions
            
        Returns:
            Dictionary containing hydration analysis results
        """
        # Convert to grayscale for texture analysis
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply skin mask
        skin_gray = cv2.bitwise_and(gray, gray, mask=skin_mask)
        
        # Texture analysis using Gabor filters
        texture_analysis = self._analyze_texture(skin_gray, skin_mask)
        
        # Surface roughness analysis
        roughness_analysis = self._analyze_surface_roughness(skin_gray, skin_mask)
        
        # Pore visibility analysis
        pore_analysis = self._analyze_pore_visibility(skin_gray, skin_mask)
        
        # Skin smoothness analysis
        smoothness_analysis = self._analyze_skin_smoothness(skin_gray, skin_mask)
        
        # Generate hydration heatmap
        hydration_heatmap = self._generate_hydration_heatmap(
            texture_analysis, roughness_analysis, pore_analysis, smoothness_analysis, skin_mask
        )
        
        # Calculate overall hydration score
        hydration_score = self._calculate_hydration_score(
            texture_analysis, roughness_analysis, pore_analysis, smoothness_analysis
        )
        
        return {
            'hydration_score': hydration_score,
            'hydration_level': self._classify_hydration_level(hydration_score),
            'texture_analysis': texture_analysis,
            'roughness_analysis': roughness_analysis,
            'pore_analysis': pore_analysis,
            'smoothness_analysis': smoothness_analysis,
            'hydration_heatmap': hydration_heatmap,
            'recommendations': self._generate_hydration_recommendations(hydration_score)
        }
    
    def _analyze_texture(self, skin_gray: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Analyze skin texture using Gabor filters and statistical measures"""
        # Define Gabor filter parameters for different orientations and frequencies
        angles = [0, 45, 90, 135]  # degrees
        frequencies = [0.1, 0.3, 0.5]  # normalized frequencies
        
        texture_responses = []
        
        for angle in angles:
            for freq in frequencies:
                # Convert angle to radians
                theta = np.radians(angle)
                
                # Create Gabor filter
                kernel = cv2.getGaborKernel(
                    (15, 15),  # kernel size
                    3,         # sigma
                    theta,     # orientation
                    2*np.pi*freq,  # frequency
                    0.5,       # gamma
                    0,         # psi
                    ktype=cv2.CV_32F
                )
                
                # Apply filter
                filtered = cv2.filter2D(skin_gray, cv2.CV_8UC3, kernel)
                
                # Apply skin mask
                filtered_masked = cv2.bitwise_and(filtered, filtered, mask=skin_mask)
                
                # Calculate texture response
                if np.sum(skin_mask > 0) > 0:
                    response = np.mean(filtered_masked[skin_mask > 0])
                    texture_responses.append(response)
        
        # Calculate texture statistics
        if texture_responses:
            texture_mean = np.mean(texture_responses)
            texture_std = np.std(texture_responses)
            texture_entropy = entropy(np.histogram(texture_responses, bins=20)[0] + 1e-8)
        else:
            texture_mean = texture_std = texture_entropy = 0
        
        return {
            'texture_mean': float(texture_mean),
            'texture_std': float(texture_std),
            'texture_entropy': float(texture_entropy),
            'texture_responses': texture_responses
        }
    
    def _analyze_surface_roughness(self, skin_gray: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Analyze surface roughness using gradient analysis"""
        # Calculate gradients
        grad_x = cv2.Sobel(skin_gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(skin_gray, cv2.CV_64F, 0, 1, ksize=3)
        
        # Calculate gradient magnitude
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        
        # Apply skin mask
        gradient_masked = cv2.bitwise_and(gradient_magnitude, gradient_magnitude, mask=skin_mask)
        
        # Calculate roughness metrics
        if np.sum(skin_mask > 0) > 0:
            roughness_mean = np.mean(gradient_masked[skin_mask > 0])
            roughness_std = np.std(gradient_masked[skin_mask > 0])
            roughness_max = np.max(gradient_masked[skin_mask > 0])
        else:
            roughness_mean = roughness_std = roughness_max = 0
        
        # Calculate local roughness variation
        kernel = np.ones((7, 7), np.float32) / 49
        local_roughness = cv2.filter2D(gradient_magnitude, -1, kernel)
        local_roughness_masked = cv2.bitwise_and(local_roughness, local_roughness, mask=skin_mask)
        
        if np.sum(skin_mask > 0) > 0:
            local_variation = np.std(local_roughness_masked[skin_mask > 0])
        else:
            local_variation = 0
        
        return {
            'roughness_mean': float(roughness_mean),
            'roughness_std': float(roughness_std),
            'roughness_max': float(roughness_max),
            'local_variation': float(local_variation),
            'roughness_map': gradient_magnitude
        }
    
    def _analyze_pore_visibility(self, skin_gray: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Analyze pore visibility and distribution"""
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(skin_gray, (5, 5), 0)
        
        # Calculate Laplacian for edge detection
        laplacian = cv2.Laplacian(blurred, cv2.CV_64F)
        laplacian = np.absolute(laplacian)
        
        # Apply skin mask
        laplacian_masked = cv2.bitwise_and(laplacian, laplacian, mask=skin_mask)
        
        # Threshold to find prominent pores
        pore_threshold = np.percentile(laplacian_masked[skin_mask > 0], 90)
        pore_mask = laplacian_masked > pore_threshold
        
        # Analyze pore characteristics
        if np.sum(skin_mask > 0) > 0:
            pore_density = np.sum(pore_mask) / np.sum(skin_mask > 0)
            pore_intensity = np.mean(laplacian_masked[pore_mask]) if np.sum(pore_mask) > 0 else 0
        else:
            pore_density = pore_intensity = 0
        
        # Find pore clusters
        pore_clusters = cv2.connectedComponents(pore_mask.astype(np.uint8))[0] - 1
        
        return {
            'pore_density': float(pore_density),
            'pore_intensity': float(pore_intensity),
            'pore_clusters': int(pore_clusters),
            'pore_mask': pore_mask,
            'laplacian_map': laplacian_masked
        }
    
    def _analyze_skin_smoothness(self, skin_gray: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Analyze skin smoothness using frequency domain analysis"""
        # Apply skin mask
        skin_masked = cv2.bitwise_and(skin_gray, skin_gray, mask=skin_mask)
        
        # Calculate local smoothness using rolling standard deviation
        kernel_sizes = [5, 9, 15]
        smoothness_metrics = {}
        
        for size in kernel_sizes:
            kernel = np.ones((size, size), np.float32) / (size * size)
            local_mean = cv2.filter2D(skin_masked, -1, kernel)
            local_variance = cv2.filter2D(skin_masked**2, -1, kernel) - local_mean**2
            local_std = np.sqrt(np.maximum(local_variance, 0))
            
            if np.sum(skin_mask > 0) > 0:
                smoothness = 1.0 / (1.0 + np.mean(local_std[skin_mask > 0]))
            else:
                smoothness = 0
            
            smoothness_metrics[f'smoothness_{size}'] = float(smoothness)
        
        # Calculate overall smoothness
        overall_smoothness = np.mean(list(smoothness_metrics.values()))
        
        return {
            'overall_smoothness': float(overall_smoothness),
            'smoothness_metrics': smoothness_metrics,
            'local_std_map': local_std if 'local_std' in locals() else np.zeros_like(skin_gray)
        }
    
    def _generate_hydration_heatmap(self, texture_analysis: Dict, roughness_analysis: Dict,
                                  pore_analysis: Dict, smoothness_analysis: Dict, 
                                  skin_mask: np.ndarray) -> np.ndarray:
        """Generate comprehensive hydration heatmap"""
        # Initialize hydration map
        hydration_map = np.zeros_like(skin_mask, dtype=np.float32)
        
        # Texture contribution (higher texture variation = lower hydration)
        if 'texture_responses' in texture_analysis and texture_analysis['texture_responses']:
            texture_variation = np.std(texture_analysis['texture_responses'])
            texture_score = 1.0 / (1.0 + texture_variation / 50.0)
            hydration_map += texture_score * 0.25
        
        # Roughness contribution (lower roughness = higher hydration)
        if 'roughness_map' in roughness_analysis:
            roughness_map = roughness_analysis['roughness_map']
            roughness_normalized = (roughness_map - roughness_map.min()) / (roughness_map.max() - roughness_map.min() + 1e-8)
            roughness_score = 1.0 - roughness_normalized
            hydration_map += cv2.bitwise_and(roughness_score, skin_mask) * 0.25
        
        # Pore contribution (fewer visible pores = higher hydration)
        if 'pore_mask' in pore_analysis:
            pore_mask = pore_analysis['pore_mask']
            pore_score = 1.0 - pore_mask.astype(np.float32)
            hydration_map += cv2.bitwise_and(pore_score, skin_mask) * 0.25
        
        # Smoothness contribution (higher smoothness = higher hydration)
        if 'local_std_map' in smoothness_analysis:
            std_map = smoothness_analysis['local_std_map']
            if std_map.max() > 0:
                std_normalized = (std_map - std_map.min()) / (std_map.max() - std_map.min() + 1e-8)
                smoothness_score = 1.0 - std_normalized
                hydration_map += cv2.bitwise_and(smoothness_score, skin_mask) * 0.25
        
        # Normalize to 0-1 range
        hydration_map = np.clip(hydration_map, 0, 1)
        
        return hydration_map
    
    def _calculate_hydration_score(self, texture_analysis: Dict, roughness_analysis: Dict,
                                 pore_analysis: Dict, smoothness_analysis: Dict) -> float:
        """Calculate overall hydration score (0-100)"""
        # Weighted combination of different factors
        
        # Texture score (lower variation = higher hydration)
        texture_score = 1.0 / (1.0 + texture_analysis.get('texture_std', 0) / 20.0)
        
        # Roughness score (lower roughness = higher hydration)
        roughness_score = 1.0 / (1.0 + roughness_analysis.get('roughness_mean', 0) / 30.0)
        
        # Pore score (fewer visible pores = higher hydration)
        pore_score = 1.0 - min(1.0, pore_analysis.get('pore_density', 0) / 0.1)
        
        # Smoothness score (higher smoothness = higher hydration)
        smoothness_score = smoothness_analysis.get('overall_smoothness', 0)
        
        # Calculate weighted hydration score
        hydration_score = (
            0.25 * texture_score +
            0.25 * roughness_score +
            0.25 * pore_score +
            0.25 * smoothness_score
        )
        
        # Convert to 0-100 scale
        final_score = hydration_score * 100
        
        return round(final_score, 2)
    
    def _classify_hydration_level(self, hydration_score: float) -> str:
        """Classify hydration level based on score"""
        if hydration_score >= 85:
            return "excellent"
        elif hydration_score >= 70:
            return "well_hydrated"
        elif hydration_score >= 50:
            return "normal"
        elif hydration_score >= 30:
            return "dry"
        else:
            return "dehydrated"
    
    def _generate_hydration_recommendations(self, hydration_score: float) -> List[str]:
        """Generate personalized hydration recommendations"""
        recommendations = []
        
        if hydration_score < 30:
            recommendations.extend([
                "Increase water intake to 8-10 glasses daily",
                "Use hyaluronic acid serum for intense hydration",
                "Apply moisturizer immediately after cleansing",
                "Consider using a humidifier in your environment",
                "Avoid hot showers and harsh cleansers"
            ])
        elif hydration_score < 50:
            recommendations.extend([
                "Drink 6-8 glasses of water daily",
                "Add a hydrating toner to your routine",
                "Use products with ceramides and glycerin",
                "Apply moisturizer twice daily",
                "Consider sheet masks for extra hydration"
            ])
        elif hydration_score < 70:
            recommendations.extend([
                "Maintain current hydration routine",
                "Add a lightweight serum for extra moisture",
                "Use gentle exfoliation 1-2 times per week",
                "Monitor skin for signs of dehydration",
                "Consider seasonal adjustments to routine"
            ])
        else:
            recommendations.extend([
                "Excellent hydration levels!",
                "Continue current skincare routine",
                "Maintain healthy lifestyle habits",
                "Consider preventive hydration maintenance",
                "Regular skin check-ups recommended"
            ])
        
        return recommendations
