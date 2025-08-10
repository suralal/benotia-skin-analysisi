import cv2
import numpy as np
from scipy import ndimage
from sklearn.cluster import DBSCAN
from typing import Dict, List, Tuple
import matplotlib.pyplot as plt

class PoreAnalyzer:
    """
    Advanced pore analysis for detecting clogged vs. clear pores and pore health assessment
    """
    
    def __init__(self):
        self.pore_health_thresholds = {
            'excellent': 0.8,
            'good': 0.6,
            'moderate': 0.4,
            'poor': 0.2,
            'clogged': 0.0
        }
        
    def analyze_pores(self, image: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """
        Comprehensive pore analysis including health status and congestion levels
        
        Args:
            image: Input image in BGR format
            skin_mask: Binary mask of skin regions
            
        Returns:
            Dictionary containing detailed pore analysis results
        """
        # Convert to different color spaces for analysis
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        
        # Apply skin mask
        skin_gray = cv2.bitwise_and(gray, gray, mask=skin_mask)
        skin_hsv = cv2.bitwise_and(hsv, hsv, mask=skin_mask)
        skin_lab = cv2.bitwise_and(lab, lab, mask=skin_mask)
        
        # Detect pore structures
        pore_structures = self._detect_pore_structures(skin_gray, skin_mask)
        
        # Analyze pore characteristics
        pore_characteristics = self._analyze_pore_characteristics(
            skin_gray, skin_hsv, skin_lab, pore_structures, skin_mask
        )
        
        # Classify pore health status
        pore_health = self._classify_pore_health(pore_characteristics)
        
        # Detect clogged pores
        clogged_analysis = self._detect_clogged_pores(skin_gray, skin_hsv, pore_structures, skin_mask)
        
        # Generate pore health heatmap
        pore_heatmap = self._generate_pore_heatmap(
            pore_structures, pore_health, clogged_analysis, skin_mask
        )
        
        # Calculate overall pore health score
        pore_health_score = self._calculate_pore_health_score(
            pore_characteristics, pore_health, clogged_analysis
        )
        
        return {
            'pore_health_score': pore_health_score,
            'pore_health_level': self._classify_pore_health_level(pore_health_score),
            'pore_structures': pore_structures,
            'pore_characteristics': pore_characteristics,
            'pore_health': pore_health,
            'clogged_analysis': clogged_analysis,
            'pore_heatmap': pore_heatmap,
            'recommendations': self._generate_pore_recommendations(pore_health_score)
        }
    
    def _detect_pore_structures(self, skin_gray: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Detect pore structures using multiple detection methods"""
        # Method 1: Laplacian edge detection
        laplacian = cv2.Laplacian(skin_gray, cv2.CV_64F)
        laplacian = np.absolute(laplacian)
        
        # Method 2: Difference of Gaussians (DoG)
        blur1 = cv2.GaussianBlur(skin_gray, (3, 3), 0.5)
        blur2 = cv2.GaussianBlur(skin_gray, (7, 7), 1.5)
        dog = blur1 - blur2
        
        # Method 3: Hessian matrix for blob detection
        hessian_response = self._calculate_hessian_response(skin_gray)
        
        # Combine detection methods
        combined_response = (laplacian + np.abs(dog) + hessian_response) / 3
        
        # Apply skin mask
        combined_masked = cv2.bitwise_and(combined_response, combined_response, mask=skin_mask)
        
        # Threshold to find pore candidates
        pore_threshold = np.percentile(combined_masked[skin_mask > 0], 85)
        pore_candidates = combined_masked > pore_threshold
        
        # Morphological operations to clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        pore_candidates = cv2.morphologyEx(pore_candidates.astype(np.uint8), cv2.MORPH_OPEN, kernel)
        pore_candidates = cv2.morphologyEx(pore_candidates, cv2.MORPH_CLOSE, kernel)
        
        # Find connected components (individual pores)
        num_pores, pore_labels = cv2.connectedComponents(pore_candidates)
        
        # Analyze pore properties
        pore_properties = self._analyze_pore_properties(pore_labels, num_pores, skin_mask)
        
        return {
            'pore_candidates': pore_candidates,
            'pore_labels': pore_labels,
            'num_pores': num_pores - 1,  # Subtract background
            'pore_properties': pore_properties,
            'combined_response': combined_masked,
            'laplacian': laplacian,
            'dog': dog,
            'hessian': hessian_response
        }
    
    def _calculate_hessian_response(self, gray_image: np.ndarray) -> np.ndarray:
        """Calculate Hessian matrix response for blob detection"""
        # Calculate second derivatives
        grad_xx = cv2.Sobel(gray_image, cv2.CV_64F, 2, 0, ksize=3)
        grad_yy = cv2.Sobel(gray_image, cv2.CV_64F, 0, 2, ksize=3)
        grad_xy = cv2.Sobel(gray_image, cv2.CV_64F, 1, 1, ksize=3)
        
        # Calculate determinant of Hessian
        hessian_det = grad_xx * grad_yy - grad_xy**2
        
        # Normalize
        hessian_det = np.abs(hessian_det)
        if hessian_det.max() > 0:
            hessian_det = hessian_det / hessian_det.max()
        
        return hessian_det
    
    def _analyze_pore_properties(self, pore_labels: np.ndarray, num_pores: int, skin_mask: np.ndarray) -> List[Dict]:
        """Analyze properties of individual pores"""
        pore_properties = []
        
        for i in range(1, num_pores):  # Skip background (label 0)
            # Create mask for current pore
            pore_mask = (pore_labels == i).astype(np.uint8)
            
            # Calculate pore properties
            area = np.sum(pore_mask)
            perimeter = cv2.arcLength(pore_mask.astype(np.uint8), True)
            
            # Calculate circularity
            circularity = (4 * np.pi * area) / (perimeter**2 + 1e-8)
            
            # Find centroid
            moments = cv2.moments(pore_mask)
            if moments['m00'] != 0:
                cx = int(moments['m10'] / moments['m00'])
                cy = int(moments['m01'] / moments['m00'])
            else:
                cx = cy = 0
            
            # Calculate bounding box
            contours, _ = cv2.findContours(pore_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if contours:
                x, y, w, h = cv2.boundingRect(contours[0])
                aspect_ratio = w / (h + 1e-8)
            else:
                x = y = w = h = aspect_ratio = 0
            
            pore_properties.append({
                'id': i,
                'area': int(area),
                'perimeter': float(perimeter),
                'circularity': float(circularity),
                'centroid': (cx, cy),
                'bounding_box': (x, y, w, h),
                'aspect_ratio': float(aspect_ratio)
            })
        
        return pore_properties
    
    def _analyze_pore_characteristics(self, skin_gray: np.ndarray, skin_hsv: np.ndarray, 
                                    skin_lab: np.ndarray, pore_structures: Dict, 
                                    skin_mask: np.ndarray) -> Dict:
        """Analyze detailed pore characteristics"""
        pore_candidates = pore_structures['pore_candidates']
        
        # Analyze pore darkness (indicates depth/visibility)
        pore_darkness = self._analyze_pore_darkness(skin_gray, pore_candidates, skin_mask)
        
        # Analyze pore color characteristics
        pore_colors = self._analyze_pore_colors(skin_hsv, skin_lab, pore_candidates, skin_mask)
        
        # Analyze pore size distribution
        pore_sizes = self._analyze_pore_sizes(pore_structures['pore_properties'])
        
        # Analyze pore spatial distribution
        pore_distribution = self._analyze_pore_distribution(pore_structures['pore_labels'], skin_mask)
        
        return {
            'pore_darkness': pore_darkness,
            'pore_colors': pore_colors,
            'pore_sizes': pore_sizes,
            'pore_distribution': pore_distribution
        }
    
    def _analyze_pore_darkness(self, skin_gray: np.ndarray, pore_candidates: np.ndarray, 
                              skin_mask: np.ndarray) -> Dict:
        """Analyze pore darkness as indicator of depth/visibility"""
        # Calculate local darkness around pores
        kernel = np.ones((5, 5), np.float32) / 25
        local_mean = cv2.filter2D(skin_gray, -1, kernel)
        
        # Calculate darkness relative to local background
        darkness_map = local_mean - skin_gray
        darkness_map = np.maximum(darkness_map, 0)  # Only positive differences
        
        # Apply pore mask
        pore_darkness = cv2.bitwise_and(darkness_map, darkness_map, mask=pore_candidates)
        
        # Calculate darkness statistics
        if np.sum(pore_candidates) > 0:
            mean_darkness = np.mean(pore_darkness[pore_candidates > 0])
            std_darkness = np.std(pore_darkness[pore_candidates > 0])
            max_darkness = np.max(pore_darkness[pore_candidates > 0])
        else:
            mean_darkness = std_darkness = max_darkness = 0
        
        return {
            'mean_darkness': float(mean_darkness),
            'std_darkness': float(std_darkness),
            'max_darkness': float(max_darkness),
            'darkness_map': darkness_map
        }
    
    def _analyze_pore_colors(self, skin_hsv: np.ndarray, skin_lab: np.ndarray, 
                            pore_candidates: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Analyze pore color characteristics"""
        # Extract color channels
        h_channel = skin_hsv[:, :, 0]
        s_channel = skin_hsv[:, :, 1]
        v_channel = skin_hsv[:, :, 2]
        
        l_channel = skin_lab[:, :, 0]
        a_channel = skin_lab[:, :, 1]
        b_channel = skin_lab[:, :, 2]
        
        # Calculate color statistics for pores
        pore_colors = {}
        for channel_name, channel in [('hue', h_channel), ('saturation', s_channel), 
                                    ('value', v_channel), ('lightness', l_channel),
                                    ('a_channel', a_channel), ('b_channel', b_channel)]:
            
            pore_values = channel[pore_candidates > 0]
            if len(pore_values) > 0:
                pore_colors[f'{channel_name}_mean'] = float(np.mean(pore_values))
                pore_colors[f'{channel_name}_std'] = float(np.std(pore_values))
            else:
                pore_colors[f'{channel_name}_mean'] = 0.0
                pore_colors[f'{channel_name}_std'] = 0.0
        
        return pore_colors
    
    def _analyze_pore_sizes(self, pore_properties: List[Dict]) -> Dict:
        """Analyze pore size distribution"""
        if not pore_properties:
            return {'mean_area': 0, 'std_area': 0, 'size_distribution': 'unknown'}
        
        areas = [p['area'] for p in pore_properties]
        mean_area = np.mean(areas)
        std_area = np.std(areas)
        
        # Classify size distribution
        if mean_area < 10:
            size_dist = 'small'
        elif mean_area < 25:
            size_dist = 'medium'
        else:
            size_dist = 'large'
        
        return {
            'mean_area': float(mean_area),
            'std_area': float(std_area),
            'size_distribution': size_dist,
            'total_pores': len(pore_properties)
        }
    
    def _analyze_pore_distribution(self, pore_labels: np.ndarray, skin_mask: np.ndarray) -> Dict:
        """Analyze spatial distribution of pores"""
        # Calculate pore density in different regions
        height, width = skin_mask.shape
        regions = {
            'top': (0, height//3),
            'middle': (height//3, 2*height//3),
            'bottom': (2*height//3, height)
        }
        
        regional_density = {}
        for region_name, (start_y, end_y) in regions.items():
            region_mask = skin_mask[start_y:end_y, :]
            region_pores = pore_labels[start_y:end_y, :]
            
            skin_area = np.sum(region_mask) / 255.0
            pore_count = len(np.unique(region_pores[region_mask > 0])) - 1  # Subtract background
            
            if skin_area > 0:
                density = pore_count / skin_area
            else:
                density = 0
            
            regional_density[region_name] = float(density)
        
        # Calculate overall distribution uniformity
        densities = list(regional_density.values())
        uniformity = 1.0 - (np.std(densities) / (np.mean(densities) + 1e-8))
        
        return {
            'regional_density': regional_density,
            'uniformity': float(uniformity)
        }
    
    def _classify_pore_health(self, pore_characteristics: Dict) -> Dict:
        """Classify individual pore health status"""
        # Analyze pore characteristics for health indicators
        darkness_score = 1.0 - min(1.0, pore_characteristics['pore_darkness']['mean_darkness'] / 50.0)
        size_score = 1.0 - min(1.0, pore_characteristics['pore_sizes']['mean_area'] / 30.0)
        uniformity_score = pore_characteristics['pore_distribution']['uniformity']
        
        # Calculate overall pore health
        overall_health = (darkness_score + size_score + uniformity_score) / 3
        
        return {
            'overall_health': float(overall_health),
            'darkness_score': float(darkness_score),
            'size_score': float(size_score),
            'uniformity_score': float(uniformity_score)
        }
    
    def _detect_clogged_pores(self, skin_gray: np.ndarray, skin_hsv: np.ndarray, 
                             pore_structures: Dict, skin_mask: np.ndarray) -> Dict:
        """Detect clogged vs. clear pores"""
        pore_candidates = pore_structures['pore_candidates']
        
        # Analyze texture around pores for clogging indicators
        # Clogged pores often have different texture characteristics
        
        # Method 1: Local texture analysis
        kernel = np.ones((7, 7), np.float32) / 49
        local_std = cv2.filter2D(skin_gray.astype(np.float32), -1, kernel)
        local_std = np.sqrt(local_std - (cv2.filter2D(skin_gray.astype(np.float32), -1, kernel))**2)
        
        # Method 2: Color variation analysis
        hsv_std = np.std(skin_hsv, axis=2)
        
        # Combine indicators for clogging detection
        clogging_score = (local_std + hsv_std) / 2
        
        # Apply pore mask
        pore_clogging = cv2.bitwise_and(clogging_score, clogging_score, mask=pore_candidates)
        
        # Threshold to identify potentially clogged pores
        clogging_threshold = np.percentile(pore_clogging[pore_candidates > 0], 75)
        clogged_mask = pore_clogging > clogging_threshold
        
        # Calculate clogging statistics
        if np.sum(pore_candidates) > 0:
            clogged_ratio = np.sum(clogged_mask) / np.sum(pore_candidates)
            mean_clogging = np.mean(pore_clogging[pore_candidates > 0])
        else:
            clogged_ratio = mean_clogging = 0
        
        return {
            'clogged_ratio': float(clogged_ratio),
            'mean_clogging': float(mean_clogging),
            'clogged_mask': clogged_mask,
            'clogging_score': pore_clogging
        }
    
    def _generate_pore_heatmap(self, pore_structures: Dict, pore_health: Dict, 
                              clogged_analysis: Dict, skin_mask: np.ndarray) -> np.ndarray:
        """Generate comprehensive pore health heatmap"""
        # Initialize heatmap
        heatmap = np.zeros_like(skin_mask, dtype=np.float32)
        
        # Add pore health contribution
        pore_candidates = pore_structures['pore_candidates']
        health_score = pore_health['overall_health']
        heatmap += cv2.bitwise_and(pore_candidates.astype(np.float32), skin_mask) * health_score * 0.4
        
        # Add clogging contribution (inverse: less clogging = better health)
        if 'clogged_mask' in clogged_analysis:
            clogged_mask = clogged_analysis['clogged_mask']
            clogging_score = 1.0 - clogged_mask.astype(np.float32)
            heatmap += cv2.bitwise_and(clogging_score, skin_mask) * 0.3
        
        # Add size contribution (smaller pores = better health)
        if 'pore_properties' in pore_structures:
            for pore_prop in pore_structures['pore_properties']:
                y, x = pore_prop['centroid']
                if 0 <= y < heatmap.shape[0] and 0 <= x < heatmap.shape[1]:
                    size_score = 1.0 - min(1.0, pore_prop['area'] / 50.0)
                    heatmap[y, x] += size_score * 0.3
        
        # Normalize to 0-1 range
        heatmap = np.clip(heatmap, 0, 1)
        
        return heatmap
    
    def _calculate_pore_health_score(self, pore_characteristics: Dict, pore_health: Dict, 
                                   clogged_analysis: Dict) -> float:
        """Calculate overall pore health score (0-100)"""
        # Weighted combination of different factors
        
        # Base health score
        health_score = pore_health['overall_health']
        
        # Clogging penalty
        clogging_penalty = clogged_analysis.get('clogged_ratio', 0)
        
        # Size penalty (larger pores = worse health)
        size_penalty = min(1.0, pore_characteristics['pore_sizes']['mean_area'] / 40.0)
        
        # Calculate final score
        final_score = health_score * (1.0 - clogging_penalty * 0.5) * (1.0 - size_penalty * 0.3)
        final_score = max(0, final_score * 100)
        
        return round(final_score, 2)
    
    def _classify_pore_health_level(self, pore_health_score: float) -> str:
        """Classify pore health level based on score"""
        if pore_health_score >= 80:
            return "excellent"
        elif pore_health_score >= 60:
            return "good"
        elif pore_health_score >= 40:
            return "moderate"
        elif pore_health_score >= 20:
            return "poor"
        else:
            return "clogged"
    
    def _generate_pore_recommendations(self, pore_health_score: float) -> List[str]:
        """Generate personalized pore care recommendations"""
        recommendations = []
        
        if pore_health_score < 20:
            recommendations.extend([
                "Consider professional extraction treatment",
                "Use salicylic acid cleanser daily",
                "Avoid heavy, pore-clogging products",
                "Consider chemical exfoliation 2-3 times per week",
                "Consult a dermatologist for severe congestion"
            ])
        elif pore_health_score < 40:
            recommendations.extend([
                "Use gentle exfoliation 2-3 times per week",
                "Switch to non-comedogenic products",
                "Add niacinamide serum to your routine",
                "Use clay masks weekly",
                "Avoid touching your face throughout the day"
            ])
        elif pore_health_score < 60:
            recommendations.extend([
                "Maintain current pore care routine",
                "Consider adding retinol for pore refinement",
                "Use gentle cleansing twice daily",
                "Monitor for any worsening of congestion",
                "Consider professional consultation if issues persist"
            ])
        else:
            recommendations.extend([
                "Excellent pore health!",
                "Continue current skincare routine",
                "Maintain good hygiene practices",
                "Consider preventive maintenance treatments",
                "Regular skin check-ups recommended"
            ])
        
        return recommendations
