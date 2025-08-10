
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RotateCcw, Download, Share2, AlertCircle, Zap, Clock, Sun, Droplets, Target, TrendingUp, Lightbulb, Star } from 'lucide-react';
import { SkinAnalysisData } from '../App';

interface AnalysisReportProps {
  data: SkinAnalysisData;
  capturedImage: string;
  onStartOver: () => void;
}

export function AnalysisReport({ data, capturedImage, onStartOver }: AnalysisReportProps) {
  // Add null checks and fallbacks for data
  const safeData = data || {};
  
  const getSeverityColor = (severity: 'low' | 'moderate' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-benotia-beige text-benotia-text-light border-benotia-brown/20';
    }
  };



  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600';
    if (grade.includes('B')) return 'text-benotia-brown';
    if (grade.includes('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const downloadReport = () => {
    // Create a downloadable report
    const reportData = {
      timestamp: new Date().toISOString(),
      analysis: safeData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skin-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check if we have valid analysis data
  const hasValidData = safeData.acne || safeData.hyperpigmentation || safeData.aging || 
                      safeData.uvDamage || safeData.poreCongestion || safeData.hydration || 
                      safeData.apiResult;
  
  // If no valid data, show error state
  if (!hasValidData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-red-800 mb-2">Analysis Failed</h1>
            <p className="text-red-600 mb-6">
              We couldn't complete the skin analysis. This might be due to:
            </p>
            <ul className="text-red-600 text-left max-w-md mx-auto space-y-2 mb-6">
              <li>• No face detected in the image</li>
              <li>• Poor image quality or lighting</li>
              <li>• Technical issues during analysis</li>
            </ul>
            <Button onClick={onStartOver} className="bg-red-600 hover:bg-red-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 text-benotia-text-dark font-bold">Your AI-Powered Skin Analysis Report</h1>
          <p className="text-benotia-text-light">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Overall Score - Hero Section */}
        {(safeData.overall || (safeData.apiResult && safeData.apiResult.scores)) && (
          <Card className="mb-8 border-2 border-benotia-gold/30 bg-gradient-to-r from-benotia-cream to-benotia-beige/50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-benotia-brown mb-2">Overall Skin Health Score</CardTitle>
              <div className="text-7xl my-6 font-bold">
                                  <span className="text-benotia-brown">
                  {safeData.apiResult?.scores?.overall || safeData.overall?.skinHealth || 0}
                </span>
                <span className="text-3xl text-benotia-text-light">/100</span>
              </div>
              {safeData.overall?.grade && (
                <div className="mb-4">
                  <Badge className={`text-lg px-4 py-2 ${getGradeColor(safeData.overall.grade)} bg-white border-2`}>
                    Grade: {safeData.overall.grade}
                  </Badge>
                </div>
              )}
              <Progress 
                value={safeData.apiResult?.scores?.overall || safeData.overall?.skinHealth || 0} 
                className="w-full max-w-md mx-auto h-4" 
              />
              <p className="text-blue-600 mt-4 text-lg">
                {safeData.overall?.nextSteps || 'Your personalized skin journey starts here!'}
              </p>
            </CardHeader>
          </Card>
        )}

        {/* Surprising Insights Section */}
        {safeData.insights && safeData.insights.length > 0 && (
          <Card className="mb-8 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-600 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Surprising Insights
              </CardTitle>
              <CardDescription>AI discoveries that might surprise you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {safeData.insights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    insight.type === 'surprising' ? 'border-orange-300 bg-orange-100' :
                    insight.type === 'positive' ? 'border-green-300 bg-green-100' :
                    'border-blue-300 bg-blue-100'
                  }`}>
                    <div className="flex items-start">
                      <div className={`w-3 h-3 rounded-full mt-2 mr-3 ${
                        insight.impact === 'high' ? 'bg-red-500' :
                        insight.impact === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <div>
                                          <h4 className="font-semibold text-benotia-text-dark mb-2">{insight.title}</h4>
                  <p className="text-benotia-text-light text-sm">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Before/After Simulation */}
        {safeData.beforeAfter && (
          <Card className="mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Your Skin Journey Projection
              </CardTitle>
              <CardDescription>See your potential improvement with consistent care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-benotia-text-dark mb-4 text-center">Current State</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Acne</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.current.acne} className="w-20 mr-2" />
                        <span className="text-sm font-medium">{safeData.beforeAfter.current.acne}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Pigmentation</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.current.pigmentation} className="w-20 mr-2" />
                        <span className="text-sm font-medium">{safeData.beforeAfter.current.pigmentation}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Texture</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.current.texture} className="w-20 mr-2" />
                        <span className="text-sm font-medium">{safeData.beforeAfter.current.texture}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Hydration</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.current.hydration} className="w-20 mr-2" />
                        <span className="text-sm font-medium">{safeData.beforeAfter.current.hydration}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Anti-aging</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.current.aging} className="w-20 mr-2" />
                        <span className="text-sm font-medium">{safeData.beforeAfter.current.aging}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-benotia-text-dark mb-4 text-center">Projected Improvement</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Acne</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.projected.acne} className="w-20 mr-2" />
                        <span className="text-sm font-medium text-green-600">{safeData.beforeAfter.projected.acne}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Pigmentation</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.projected.pigmentation} className="w-20 mr-2" />
                        <span className="text-sm font-medium text-green-600">{safeData.beforeAfter.projected.pigmentation}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Texture</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.projected.texture} className="w-20 mr-2" />
                        <span className="text-sm font-medium text-green-600">{safeData.beforeAfter.projected.texture}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Hydration</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.projected.hydration} className="w-20 mr-2" />
                        <span className="text-sm font-medium text-green-600">{safeData.beforeAfter.projected.hydration}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-benotia-text-light">Anti-aging</span>
                      <div className="flex items-center">
                        <Progress value={safeData.beforeAfter.projected.aging} className="w-20 mr-2" />
                        <span className="text-sm font-medium text-green-600">{safeData.beforeAfter.projected.aging}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Timeline: {safeData.beforeAfter.timeline}
                </Badge>
                <p className="text-sm text-benotia-text-light mt-2">
                  Confidence Level: <span className="font-medium capitalize">{safeData.beforeAfter.confidence}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Metrics Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Acne Score */}
          {safeData.acne && (
            <Card className="text-center border-2 border-red-200">
              <CardContent className="p-4">
                <div className="text-3xl mb-2">🩹</div>
                                  <h3 className="font-semibold text-benotia-text-dark mb-1">Acne</h3>
                <div className="text-2xl font-bold text-red-600 mb-2">{safeData.acne.score}/100</div>
                <Badge className={getSeverityColor(safeData.acne.severity)}>
                  {safeData.acne.severity}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* UV Damage Score */}
          {safeData.uvDamage && (
            <Card className="text-center border-2 border-orange-200">
              <CardContent className="p-4">
                <div className="text-3xl mb-2">☀️</div>
                                  <h3 className="font-semibold text-benotia-text-dark mb-1">UV Damage</h3>
                <div className="text-2xl font-bold text-orange-600 mb-2">{safeData.uvDamage.score}/100</div>
                <Badge className={getSeverityColor(safeData.uvDamage.severity)}>
                  {safeData.uvDamage.severity}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Hydration Score */}
          {safeData.hydration && (
            <Card className="text-center border-2 border-blue-200">
              <CardContent className="p-4">
                <div className="text-3xl mb-2">💧</div>
                                  <h3 className="font-semibold text-benotia-text-dark mb-1">Hydration</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">{safeData.hydration.score}/100</div>
                <Badge className="bg-blue-100 text-blue-800">
                  {safeData.hydration.status}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Aging Score */}
          {safeData.aging && (
            <Card className="text-center border-2 border-purple-200">
              <CardContent className="p-4">
                <div className="text-3xl mb-2">⏰</div>
                                  <h3 className="font-semibold text-benotia-text-dark mb-1">Anti-Aging</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">{safeData.aging.score}/100</div>
                <Badge className={getSeverityColor(safeData.aging.severity)}>
                  {safeData.aging.severity}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Image and Summary Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Captured Image */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Photo</CardTitle>
              <CardDescription>Analysis based on this image</CardDescription>
            </CardHeader>
            <CardContent>
              <img 
                src={capturedImage} 
                alt="Captured face"
                className="w-full rounded-lg shadow-md"
              />
            </CardContent>
          </Card>

          {/* Enhanced Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
              <CardDescription>Key findings and insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {safeData.acne && (
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl mb-1">🩹</div>
                    <p className="text-sm text-benotia-text-light">Acne</p>
                    <Badge className={getSeverityColor(safeData.acne.severity)}>
                      {safeData.acne.severity}
                    </Badge>
                    <p className="text-xs text-benotia-text-light mt-1">{safeData.acne.count} spots detected</p>
                  </div>
                )}
                
                {safeData.hyperpigmentation && (
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl mb-1">✨</div>
                    <p className="text-sm text-benotia-text-light">Pigmentation</p>
                    <Badge className={getSeverityColor(safeData.hyperpigmentation.severity)}>
                      {safeData.hyperpigmentation.severity}
                    </Badge>
                    <p className="text-xs text-benotia-text-light mt-1">{safeData.hyperpigmentation.percentage}% coverage</p>
                  </div>
                )}
                
                {safeData.uvDamage && (
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl mb-1">☀️</div>
                    <p className="text-sm text-benotia-text-light">UV Damage</p>
                    <Badge className={getSeverityColor(safeData.uvDamage.severity)}>
                      {safeData.uvDamage.severity}
                    </Badge>
                    <p className="text-xs text-benotia-text-light mt-1">{safeData.uvDamage.percentage}% affected</p>
                  </div>
                )}
                
                {safeData.poreCongestion && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">🎯</div>
                    <p className="text-sm text-benotia-text-light">Texture</p>
                    <Badge className={getSeverityColor(safeData.poreCongestion.severity)}>
                      {safeData.poreCongestion.severity}
                    </Badge>
                    <p className="text-xs text-benotia-text-light mt-1">{safeData.poreCongestion.percentage}% congestion</p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <h4 className="mb-3 font-semibold text-gray-800">Top Recommendations:</h4>
                <ul className="space-y-2">
                  {(safeData.overall?.recommendations || []).slice(0, 4).map((recommendation, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <Star className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            {safeData.acne && (
              <TabsTrigger value="acne" className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Acne
              </TabsTrigger>
            )}
            {safeData.hyperpigmentation && (
              <TabsTrigger value="pigmentation" className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Pigmentation
              </TabsTrigger>
            )}
            {safeData.uvDamage && (
              <TabsTrigger value="uv" className="flex items-center">
                <Sun className="w-4 h-4 mr-2" />
                UV Damage
              </TabsTrigger>
            )}
            {safeData.hydration && (
              <TabsTrigger value="hydration" className="flex items-center">
                <Droplets className="w-4 h-4 mr-2" />
                Hydration
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Complete Skin Health Overview</CardTitle>
                <CardDescription>Comprehensive analysis of all skin concerns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {safeData.apiResult?.analysis && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Primary Concern</h4>
                      <p className="text-blue-700">{safeData.apiResult.analysis.primaryConcern}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Skin Type</h4>
                      <p className="text-green-700">{safeData.apiResult.analysis.skinType}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  {safeData.acne && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                        Acne Analysis
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium">{safeData.acne.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Affected Areas:</span>
                          <span className="text-right">{safeData.acne.areas.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Score:</span>
                          <span className="font-medium">{safeData.acne.score}/100</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {safeData.uvDamage && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Sun className="w-4 h-4 mr-2 text-orange-500" />
                        UV Damage Analysis
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Visible:</span>
                          <span className={safeData.uvDamage.visible ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {safeData.uvDamage.visible ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Affected Areas:</span>
                          <span className="text-right">{safeData.uvDamage.areas.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Score:</span>
                          <span className="font-medium">{safeData.uvDamage.score}/100</span>
                        </div>
                      </div>
                      {safeData.uvDamage.recommendation && (
                        <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-800">
                          {safeData.uvDamage.recommendation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Acne Tab */}
          {safeData.acne && (
            <TabsContent value="acne">
              <Card>
                <CardHeader>
                  <CardTitle>Acne Analysis</CardTitle>
                  <CardDescription>Detection and analysis of acne-related skin concerns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="mb-3">Detection Results</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Severity Level:</span>
                          <Badge className={getSeverityColor(safeData.acne.severity)}>
                            {safeData.acne.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Spots Detected:</span>
                          <span>{safeData.acne.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skin Score:</span>
                          <span>{safeData.acne.score}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{safeData.acne.type}</span>
                        </div>
                      </div>
                      <Progress value={safeData.acne.score} className="mt-3" />
                    </div>
                    <div>
                      <h4 className="mb-3">Affected Areas</h4>
                      <div className="space-y-2">
                        {safeData.acne.areas.map((area, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Hyperpigmentation Tab */}
          {safeData.hyperpigmentation && (
            <TabsContent value="pigmentation">
              <Card>
                <CardHeader>
                  <CardTitle>Hyperpigmentation Analysis</CardTitle>
                  <CardDescription>Assessment of dark spots and uneven skin tone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="mb-3">Detection Results</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Severity Level:</span>
                          <Badge className={getSeverityColor(safeData.hyperpigmentation.severity)}>
                            {safeData.hyperpigmentation.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Coverage:</span>
                          <span>{safeData.hyperpigmentation.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skin Score:</span>
                          <span>{safeData.hyperpigmentation.score}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{safeData.hyperpigmentation.type}</span>
                        </div>
                      </div>
                      <Progress value={safeData.hyperpigmentation.score} className="mt-3" />
                    </div>
                    <div>
                      <h4 className="mb-3">Affected Areas</h4>
                      <div className="space-y-2">
                        {safeData.hyperpigmentation.areas.map((area, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* UV Damage Tab */}
          {safeData.uvDamage && (
            <TabsContent value="uv">
              <Card>
                <CardHeader>
                  <CardTitle>UV Damage Analysis</CardTitle>
                  <CardDescription>Assessment of sun damage and UV-related skin concerns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="mb-3">Detection Results</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Severity Level:</span>
                          <Badge className={getSeverityColor(safeData.uvDamage.severity)}>
                            {safeData.uvDamage.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Coverage:</span>
                          <span>{safeData.uvDamage.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skin Score:</span>
                          <span>{safeData.uvDamage.score}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Visible Damage:</span>
                          <span className={safeData.uvDamage.visible ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {safeData.uvDamage.visible ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                      <Progress value={safeData.uvDamage.score} className="mt-3" />
                    </div>
                    <div>
                      <h4 className="mb-3">Affected Areas</h4>
                      <div className="space-y-2">
                        {safeData.uvDamage.areas.map((area, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                            <span className="text-sm">{area}</span>
                          </div>
                        ))}
                      </div>
                      {safeData.uvDamage.recommendation && (
                        <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                          <h5 className="font-semibold text-orange-800 mb-2">Immediate Action Required:</h5>
                          <p className="text-orange-700 text-sm">{safeData.uvDamage.recommendation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Hydration Tab */}
          {safeData.hydration && (
            <TabsContent value="hydration">
              <Card>
                <CardHeader>
                  <CardTitle>Hydration Analysis</CardTitle>
                  <CardDescription>Assessment of skin moisture levels and hydration status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="mb-3">Detection Results</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Hydration Level:</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {safeData.hydration.level}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Coverage:</span>
                          <span>{safeData.hydration.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skin Score:</span>
                          <span>{safeData.hydration.score}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="capitalize">{safeData.hydration.status}</span>
                        </div>
                      </div>
                      <Progress value={safeData.hydration.score} className="mt-3" />
                    </div>
                    <div>
                      <h4 className="mb-3">Hydration Insights</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-1">Current Status</h5>
                          <p className="text-blue-700 text-sm">
                            Your skin is currently showing {safeData.hydration.status} hydration levels. 
                            {safeData.hydration.score < 50 ? ' This may be contributing to other skin concerns.' : ' This is helping maintain your skin health.'}
                          </p>
                        </div>
                        {safeData.hydration.score < 60 && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <h5 className="font-semibold text-yellow-800 mb-1">Improvement Needed</h5>
                            <p className="text-yellow-700 text-sm">
                              Increasing hydration can improve texture, reduce fine lines, and enhance overall skin appearance.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={downloadReport} variant="outline" className="px-6">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" className="px-6">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Button onClick={onStartOver} className="bg-blue-600 hover:bg-blue-700 px-6">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            <strong>Medical Disclaimer:</strong> This analysis is for educational and informational purposes only. 
            Results should not be used for medical diagnosis or treatment decisions. 
            Please consult with a qualified dermatologist for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}