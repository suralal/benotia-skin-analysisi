import numpy as np
from typing import Dict, List, Tuple
import random

class SkinInsightsEngine:
    """
    AI-powered engine for generating unique, personalized skin insights and observations
    """
    
    def __init__(self):
        self.insight_templates = {
            'asymmetry': [
                "Your {left_side} shows {percentage}% more {concern} than your {right_side}",
                "Interesting! Your {left_side} has {percentage}% better {metric} than your {right_side}",
                "Your {left_side} appears to be {percentage}% more affected by {concern} than your {right_side}"
            ],
            'sleep_patterns': [
                "Your skin texture suggests you're a {sleep_position} sleeper",
                "The {side} side of your face shows signs of {sleep_position} sleeping",
                "Your {side} cheek texture indicates you prefer sleeping on your {sleep_position}"
            ],
            'lifestyle_insights': [
                "Your {zone} shows optimal {metric}, suggesting good {lifestyle_factor} habits",
                "The {zone} area indicates you might need to improve your {lifestyle_factor}",
                "Your {zone} skin quality suggests excellent {lifestyle_factor} maintenance"
            ],
            'early_warning': [
                "Early signs suggest you'll develop {concern} in your {zone} first",
                "Your {zone} shows the earliest indicators of {concern} development",
                "Watch your {zone} - it's showing the first signs of {concern}"
            ],
            'unique_patterns': [
                "Your {zone} has a unique {pattern_type} pattern that's quite rare",
                "I've detected an unusual {pattern_type} pattern in your {zone}",
                "Your {zone} shows a distinctive {pattern_type} that's worth noting"
            ],
            'comparative_insights': [
                "Your {zone} is {percentage}% better than the average person your age",
                "Compared to others, your {zone} shows {percentage}% improvement potential",
                "Your {zone} is performing {percentage}% above typical {age_group} skin"
            ]
        }
        
        self.body_parts = {
            'left_side': ['left cheek', 'left side', 'left temple', 'left jawline'],
            'right_side': ['right cheek', 'right side', 'right temple', 'right jawline'],
            'zones': ['T-zone', 'cheeks', 'forehead', 'nose', 'chin', 'jawline', 'temples'],
            'sides': ['left', 'right']
        }
        
        self.concerns = ['sun damage', 'pigmentation', 'fine lines', 'texture issues', 'pore congestion']
        self.metrics = ['hydration', 'smoothness', 'pore health', 'skin tone', 'texture']
        self.lifestyle_factors = ['sun protection', 'hydration', 'skincare', 'sleep', 'stress management']
        self.pattern_types = ['pore distribution', 'texture variation', 'pigmentation', 'wrinkle formation']
        self.sleep_positions = ['side', 'back', 'stomach']
        self.age_groups = ['20s', '30s', '40s', '50s+']
        
    def generate_surprising_insight(self, analysis_results: Dict, user_profile: Dict = None) -> Dict:
        """
        Generate a unique, surprising insight based on analysis results
        
        Args:
            analysis_results: Dictionary containing all analysis data
            user_profile: Optional user profile information
            
        Returns:
            Dictionary containing the insight and supporting data
        """
        # Analyze the data for unique patterns
        patterns = self._analyze_patterns(analysis_results)
        
        # Generate different types of insights
        insight_candidates = []
        
        # Asymmetry insights
        if patterns.get('asymmetry'):
            insight_candidates.extend(self._generate_asymmetry_insights(patterns['asymmetry']))
        
        # Sleep pattern insights
        if patterns.get('sleep_patterns'):
            insight_candidates.extend(self._generate_sleep_insights(patterns['sleep_patterns']))
        
        # Lifestyle insights
        if patterns.get('lifestyle_patterns'):
            insight_candidates.extend(self._generate_lifestyle_insights(patterns['lifestyle_patterns']))
        
        # Early warning insights
        if patterns.get('early_signs'):
            insight_candidates.extend(self._generate_early_warning_insights(patterns['early_signs']))
        
        # Unique pattern insights
        if patterns.get('unique_patterns'):
            insight_candidates.extend(self._generate_unique_pattern_insights(patterns['unique_patterns']))
        
        # Comparative insights
        if patterns.get('comparative_data'):
            insight_candidates.extend(self._generate_comparative_insights(patterns['comparative_data']))
        
        # Select the most surprising and relevant insight
        selected_insight = self._select_best_insight(insight_candidates, analysis_results)
        
        # Generate supporting evidence
        supporting_evidence = self._generate_supporting_evidence(selected_insight, analysis_results)
        
        # Generate follow-up recommendations
        follow_up_recommendations = self._generate_follow_up_recommendations(selected_insight)
        
        return {
            'insight': selected_insight,
            'supporting_evidence': supporting_evidence,
            'follow_up_recommendations': follow_up_recommendations,
            'insight_type': selected_insight.get('type', 'general'),
            'confidence_score': selected_insight.get('confidence', 0.8)
        }
    
    def _analyze_patterns(self, analysis_results: Dict) -> Dict:
        """Analyze analysis results for interesting patterns"""
        patterns = {}
        
        # Check for asymmetry between left and right sides
        asymmetry = self._detect_asymmetry(analysis_results)
        if asymmetry:
            patterns['asymmetry'] = asymmetry
        
        # Check for sleep pattern indicators
        sleep_patterns = self._detect_sleep_patterns(analysis_results)
        if sleep_patterns:
            patterns['sleep_patterns'] = sleep_patterns
        
        # Check for lifestyle indicators
        lifestyle_patterns = self._detect_lifestyle_patterns(analysis_results)
        if lifestyle_patterns:
            patterns['lifestyle_patterns'] = lifestyle_patterns
        
        # Check for early warning signs
        early_signs = self._detect_early_signs(analysis_results)
        if early_signs:
            patterns['early_signs'] = early_signs
        
        # Check for unique patterns
        unique_patterns = self._detect_unique_patterns(analysis_results)
        if unique_patterns:
            patterns['unique_patterns'] = unique_patterns
        
        # Generate comparative data
        comparative_data = self._generate_comparative_data(analysis_results)
        if comparative_data:
            patterns['comparative_data'] = comparative_data
        
        return patterns
    
    def _detect_asymmetry(self, analysis_results: Dict) -> Dict:
        """Detect asymmetry between left and right sides of the face"""
        asymmetry_data = {}
        
        # Check for regional differences
        if 'regions' in analysis_results:
            regions = analysis_results['regions']
            
            # Compare left vs right cheeks
            if 'cheek_left' in regions and 'cheek_right' in regions:
                left_cheek = regions['cheek_left']
                right_cheek = regions['cheek_right']
                
                # Compare different metrics
                for metric in ['acne_count', 'pig_area_pct', 'wrinkle_density']:
                    if metric in left_cheek and metric in right_cheek:
                        left_val = left_cheek[metric] or 0
                        right_val = right_cheek[metric] or 0
                        
                        if left_val != 0 or right_val != 0:
                            if left_val > right_val:
                                percentage = ((left_val - right_val) / max(left_val, 1)) * 100
                                asymmetry_data[f'left_cheek_{metric}'] = {
                                    'left': left_val,
                                    'right': right_val,
                                    'difference': percentage,
                                    'side': 'left'
                                }
                            elif right_val > left_val:
                                percentage = ((right_val - left_val) / max(right_val, 1)) * 100
                                asymmetry_data[f'right_cheek_{metric}'] = {
                                    'left': left_val,
                                    'right': right_val,
                                    'difference': percentage,
                                    'side': 'right'
                                }
        
        return asymmetry_data
    
    def _detect_sleep_patterns(self, analysis_results: Dict) -> Dict:
        """Detect sleep pattern indicators from skin analysis"""
        sleep_data = {}
        
        # Analyze texture differences that might indicate sleep position
        if 'regions' in analysis_results:
            regions = analysis_results['regions']
            
            # Check for texture differences between sides
            if 'cheek_left' in regions and 'cheek_right' in regions:
                left_wrinkles = regions['cheek_left'].get('wrinkle_density', 0) or 0
                right_wrinkles = regions['cheek_right'].get('wrinkle_density', 0) or 0
                
                # Significant difference might indicate side sleeping
                if abs(left_wrinkles - right_wrinkles) > 0.01:  # Threshold for significance
                    if left_wrinkles > right_wrinkles:
                        sleep_data['side_sleeping'] = {
                            'position': 'left',
                            'evidence': f'Left cheek shows {((left_wrinkles - right_wrinkles) / max(left_wrinkles, 0.001)) * 100:.1f}% more wrinkle density',
                            'confidence': min(0.9, abs(left_wrinkles - right_wrinkles) * 10)
                        }
                    else:
                        sleep_data['side_sleeping'] = {
                            'position': 'right',
                            'evidence': f'Right cheek shows {((right_wrinkles - left_wrinkles) / max(right_wrinkles, 0.001)) * 100:.1f}% more wrinkle density',
                            'confidence': min(0.9, abs(left_wrinkles - right_wrinkles) * 10)
                        }
        
        return sleep_data
    
    def _detect_lifestyle_patterns(self, analysis_results: Dict) -> Dict:
        """Detect lifestyle pattern indicators"""
        lifestyle_data = {}
        
        # Analyze hydration patterns
        if 'hydration_score' in analysis_results:
            hydration_score = analysis_results['hydration_score']
            if hydration_score < 50:
                lifestyle_data['hydration'] = {
                    'status': 'needs_improvement',
                    'score': hydration_score,
                    'suggestion': 'Increase water intake and use hydrating products'
                }
            elif hydration_score > 80:
                lifestyle_data['hydration'] = {
                    'status': 'excellent',
                    'score': hydration_score,
                    'suggestion': 'Maintain current hydration habits'
                }
        
        # Analyze UV damage patterns
        if 'uv_damage_score' in analysis_results:
            uv_score = analysis_results['uv_damage_score']
            if uv_score < 60:
                lifestyle_data['sun_protection'] = {
                    'status': 'needs_improvement',
                    'score': uv_score,
                    'suggestion': 'Increase sun protection and avoid peak hours'
                }
        
        return lifestyle_data
    
    def _detect_early_signs(self, analysis_results: Dict) -> Dict:
        """Detect early warning signs of skin concerns"""
        early_signs = {}
        
        # Check for early wrinkle formation
        if 'regions' in analysis_results:
            regions = analysis_results['regions']
            
            # Look for areas with early wrinkle indicators
            for region_name, region_data in regions.items():
                if region_data.get('wrinkle_density', 0) > 0.02:  # Threshold for early signs
                    early_signs[f'{region_name}_wrinkles'] = {
                        'region': region_name,
                        'severity': 'early',
                        'density': region_data['wrinkle_density'],
                        'recommendation': 'Consider preventive treatments'
                    }
        
        # Check for early pigmentation
        if 'regions' in analysis_results:
            for region_name, region_data in regions.items():
                if region_data.get('pig_area_pct', 0) > 5:  # Threshold for early pigmentation
                    early_signs[f'{region_name}_pigmentation'] = {
                        'region': region_name,
                        'severity': 'early',
                        'percentage': region_data['pig_area_pct'],
                        'recommendation': 'Use brightening products and sun protection'
                    }
        
        return early_signs
    
    def _detect_unique_patterns(self, analysis_results: Dict) -> Dict:
        """Detect unique or unusual patterns"""
        unique_patterns = {}
        
        # Check for unusual pore distribution
        if 'pore_analysis' in analysis_results:
            pore_data = analysis_results['pore_analysis']
            if 'pore_distribution' in pore_data:
                uniformity = pore_data['pore_distribution'].get('uniformity', 0)
                if uniformity < 0.3:  # Very uneven distribution
                    unique_patterns['pore_distribution'] = {
                        'type': 'unusual_distribution',
                        'uniformity': uniformity,
                        'description': 'Highly irregular pore distribution pattern'
                    }
        
        # Check for unusual texture patterns
        if 'hydration_analysis' in analysis_results:
            hydration_data = analysis_results['hydration_analysis']
            if 'texture_analysis' in hydration_data:
                texture_entropy = hydration_data['texture_analysis'].get('texture_entropy', 0)
                if texture_entropy > 3.0:  # High texture complexity
                    unique_patterns['texture_complexity'] = {
                        'type': 'high_complexity',
                        'entropy': texture_entropy,
                        'description': 'Unusually complex skin texture pattern'
                    }
        
        return unique_patterns
    
    def _generate_comparative_data(self, analysis_results: Dict) -> Dict:
        """Generate comparative data for insights"""
        comparative_data = {}
        
        # Calculate overall skin health score
        if all(key in analysis_results for key in ['acne_score', 'pigmentation_score', 'wrinkles_score']):
            overall_score = (
                analysis_results.get('acne_score', 0) * 0.4 +
                analysis_results.get('pigmentation_score', 0) * 0.3 +
                analysis_results.get('wrinkles_score', 0) * 0.3
            )
            
            # Compare to age-appropriate benchmarks
            if overall_score > 80:
                comparative_data['overall_performance'] = {
                    'status': 'above_average',
                    'score': overall_score,
                    'comparison': 'Your skin is performing above average for your age group'
                }
            elif overall_score < 50:
                comparative_data['overall_performance'] = {
                    'status': 'below_average',
                    'score': overall_score,
                    'comparison': 'Your skin could benefit from targeted treatments'
                }
        
        return comparative_data
    
    def _generate_asymmetry_insights(self, asymmetry_data: Dict) -> List[Dict]:
        """Generate insights about facial asymmetry"""
        insights = []
        
        for metric, data in asymmetry_data.items():
            if data['difference'] > 10:  # Only report significant differences
                insight = {
                    'type': 'asymmetry',
                    'text': f"Your {data['side']} side shows {data['difference']:.1f}% more {metric.split('_')[-1]} than your other side",
                    'confidence': min(0.9, data['difference'] / 100),
                    'metric': metric,
                    'data': data
                }
                insights.append(insight)
        
        return insights
    
    def _generate_sleep_insights(self, sleep_patterns: Dict) -> List[Dict]:
        """Generate insights about sleep patterns"""
        insights = []
        
        if 'side_sleeping' in sleep_patterns:
            data = sleep_patterns['side_sleeping']
            insight = {
                'type': 'sleep_patterns',
                'text': f"Your skin texture suggests you're a {data['position']} side sleeper",
                'confidence': data['confidence'],
                'evidence': data['evidence'],
                'recommendation': 'Consider sleeping on your back to reduce facial asymmetry'
            }
            insights.append(insight)
        
        return insights
    
    def _generate_lifestyle_insights(self, lifestyle_patterns: Dict) -> List[Dict]:
        """Generate insights about lifestyle factors"""
        insights = []
        
        for factor, data in lifestyle_patterns.items():
            if data['status'] == 'needs_improvement':
                insight = {
                    'type': 'lifestyle',
                    'text': f"Your {factor} habits could be improved to enhance skin health",
                    'confidence': 0.8,
                    'factor': factor,
                    'suggestion': data['suggestion']
                }
                insights.append(insight)
            elif data['status'] == 'excellent':
                insight = {
                    'type': 'lifestyle',
                    'text': f"Excellent {factor} habits! Your skin is benefiting from your routine",
                    'confidence': 0.9,
                    'factor': factor,
                    'suggestion': 'Maintain these healthy habits'
                }
                insights.append(insight)
        
        return insights
    
    def _generate_early_warning_insights(self, early_signs: Dict) -> List[Dict]:
        """Generate early warning insights"""
        insights = []
        
        for sign, data in early_signs.items():
            insight = {
                'type': 'early_warning',
                'text': f"Early signs suggest you may develop {sign.split('_')[-1]} in your {data['region']}",
                'confidence': 0.7,
                'region': data['region'],
                'concern': sign.split('_')[-1],
                'recommendation': data['recommendation']
            }
            insights.append(insight)
        
        return insights
    
    def _generate_unique_pattern_insights(self, unique_patterns: Dict) -> List[Dict]:
        """Generate insights about unique patterns"""
        insights = []
        
        for pattern, data in unique_patterns.items():
            insight = {
                'type': 'unique_pattern',
                'text': f"Your {pattern} shows a distinctive {data['type']} that's quite rare",
                'confidence': 0.8,
                'pattern': pattern,
                'description': data['description']
            }
            insights.append(insight)
        
        return insights
    
    def _generate_comparative_insights(self, comparative_data: Dict) -> List[Dict]:
        """Generate comparative insights"""
        insights = []
        
        for metric, data in comparative_data.items():
            if data['status'] == 'above_average':
                insight = {
                    'type': 'comparative',
                    'text': f"Your skin is performing {data['score']:.0f}/100, which is above average for your age group!",
                    'confidence': 0.85,
                    'score': data['score'],
                    'comparison': data['comparison']
                }
                insights.append(insight)
            elif data['status'] == 'below_average':
                insight = {
                    'type': 'comparative',
                    'text': f"Your current skin score is {data['score']:.0f}/100. With the right care, you could reach 80+!",
                    'confidence': 0.8,
                    'score': data['score'],
                    'comparison': data['comparison']
                }
                insights.append(insight)
        
        return insights
    
    def _select_best_insight(self, insight_candidates: List[Dict], analysis_results: Dict) -> Dict:
        """Select the best insight from candidates"""
        if not insight_candidates:
            # Generate a default insight
            return self._generate_default_insight(analysis_results)
        
        # Score insights based on relevance and surprise factor
        scored_insights = []
        for insight in insight_candidates:
            score = self._score_insight(insight, analysis_results)
            scored_insights.append((score, insight))
        
        # Sort by score and select the best
        scored_insights.sort(key=lambda x: x[0], reverse=True)
        return scored_insights[0][1]
    
    def _score_insight(self, insight: Dict, analysis_results: Dict) -> float:
        """Score an insight based on relevance and surprise factor"""
        score = 0.0
        
        # Base score from confidence
        score += insight.get('confidence', 0.5) * 0.4
        
        # Relevance score based on analysis results
        if insight['type'] in ['asymmetry', 'sleep_patterns']:
            score += 0.3  # High relevance for facial analysis
        
        # Surprise factor
        if insight['type'] in ['unique_pattern', 'early_warning']:
            score += 0.3  # High surprise factor
        
        # Specificity score
        if 'data' in insight or 'evidence' in insight:
            score += 0.2  # More specific insights get higher scores
        
        return score
    
    def _generate_default_insight(self, analysis_results: Dict) -> Dict:
        """Generate a default insight when no specific patterns are detected"""
        # Find the best performing metric
        scores = {}
        for key in ['acne_score', 'pigmentation_score', 'wrinkles_score']:
            if key in analysis_results:
                scores[key] = analysis_results[key]
        
        if scores:
            best_metric = max(scores, key=scores.get)
            best_score = scores[best_metric]
            
            metric_name = best_metric.replace('_score', '').title()
            
            if best_score > 80:
                insight_text = f"Excellent {metric_name}! Your skin is in great condition in this area."
            elif best_score > 60:
                insight_text = f"Good {metric_name} score. There's room for improvement to reach 80+!"
            else:
                insight_text = f"Your {metric_name} could use some attention. With proper care, you could improve significantly!"
        else:
            insight_text = "Your skin analysis reveals several areas for improvement. Let's work on getting you to 90+!"
        
        return {
            'type': 'general',
            'text': insight_text,
            'confidence': 0.7,
            'recommendation': 'Focus on your weakest areas first for maximum improvement potential'
        }
    
    def _generate_supporting_evidence(self, insight: Dict, analysis_results: Dict) -> List[str]:
        """Generate supporting evidence for the insight"""
        evidence = []
        
        if insight['type'] == 'asymmetry':
            data = insight.get('data', {})
            if 'difference' in data:
                evidence.append(f"Left side: {data['left']:.2f}, Right side: {data['right']:.2f}")
                evidence.append(f"Difference: {data['difference']:.1f}%")
        
        elif insight['type'] == 'sleep_patterns':
            if 'evidence' in insight:
                evidence.append(insight['evidence'])
        
        elif insight['type'] == 'early_warning':
            if 'region' in insight and 'concern' in insight:
                evidence.append(f"Early indicators detected in {insight['region']}")
                evidence.append(f"Focus on preventive measures for {insight['concern']}")
        
        # Add general evidence based on scores
        if 'acne_score' in analysis_results:
            evidence.append(f"Acne score: {analysis_results['acne_score']}/100")
        if 'pigmentation_score' in analysis_results:
            evidence.append(f"Pigmentation score: {analysis_results['pigmentation_score']}/100")
        if 'wrinkles_score' in analysis_results:
            evidence.append(f"Wrinkles score: {analysis_results['wrinkles_score']}/100")
        
        return evidence
    
    def _generate_follow_up_recommendations(self, insight: Dict) -> List[str]:
        """Generate follow-up recommendations based on the insight"""
        recommendations = []
        
        if insight['type'] == 'asymmetry':
            recommendations.extend([
                "Consider sleeping on your back to reduce facial asymmetry",
                "Use targeted treatments on the more affected side",
                "Monitor for changes in asymmetry over time"
            ])
        
        elif insight['type'] == 'sleep_patterns':
            recommendations.extend([
                "Try sleeping on your back to reduce side-sleeping effects",
                "Use silk pillowcases to minimize friction",
                "Consider facial massage to improve circulation"
            ])
        
        elif insight['type'] == 'early_warning':
            recommendations.extend([
                "Start preventive treatments early",
                "Increase sun protection in affected areas",
                "Consider professional consultation for treatment options"
            ])
        
        elif insight['type'] == 'lifestyle':
            if 'factor' in insight:
                recommendations.extend([
                    f"Focus on improving your {insight['factor']} habits",
                    "Set specific goals for lifestyle improvements",
                    "Track progress over time"
                ])
        
        # Add general recommendations
        recommendations.extend([
            "Schedule a follow-up analysis in 4-6 weeks",
            "Track your progress with regular self-assessments",
            "Consider professional consultation for personalized advice"
        ])
        
        return recommendations
