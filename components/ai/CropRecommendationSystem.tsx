import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Brain, TrendingUp, MapPin, CloudRain, DollarSign, Leaf, BarChart3, AlertCircle, CheckCircle } from 'lucide-react-native';
import { theme } from '@/components/designSystem';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/Dropdown';

interface SoilData {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  temperature: number;
  salinity: number;
  texture: 'sandy' | 'loamy' | 'clay';
  drainage: 'poor' | 'moderate' | 'good' | 'excellent';
}

interface WeatherData {
  averageTemperature: number;
  minTemperature: number;
  maxTemperature: number;
  rainfall: number;
  humidity: number;
  sunlightHours: number;
  windSpeed: number;
  frostDays: number;
  growingSeason: number;
}

interface MarketData {
  price: number;
  demand: 'low' | 'medium' | 'high';
  trend: 'declining' | 'stable' | 'growing';
  volatility: number;
  seasonalVariation: number;
  localMarketSize: number;
  exportPotential: number;
}

interface CropSuitability {
  cropId: number;
  cropName: string;
  variety?: string;
  suitabilityScore: number;
  confidence: number;
  factors: {
    soil: number;
    weather: number;
    market: number;
    sustainability: number;
  };
  expectedYield: number;
  expectedRevenue: number;
  expectedProfit: number;
  riskLevel: 'low' | 'medium' | 'high';
  waterRequirement: number;
  fertilizerRequirement: number;
  laborRequirement: number;
  growthDuration: number;
  plantingWindow: string;
  harvestWindow: string;
  advantages: string[];
  challenges: string[];
  recommendations: string[];
}

interface RecommendationRequest {
  fieldId: number;
  fieldSize: number;
  location: {
    latitude: number;
    longitude: number;
    region: string;
  };
  soilData: SoilData;
  weatherData: WeatherData;
  marketPreferences: {
    focusOnProfit: boolean;
    focusOnSustainability: boolean;
    focusOnRiskReduction: boolean;
    preferredCrops: string[];
    avoidCrops: string[];
  };
  farmingExperience: 'beginner' | 'intermediate' | 'expert';
  availableResources: {
    irrigation: boolean;
    machinery: string[];
    laborAvailability: 'low' | 'medium' | 'high';
    budget: number;
  };
}

interface CropRecommendationSystemProps {
  onRecommendationGenerated?: (recommendations: CropSuitability[]) => void;
}

export default function CropRecommendationSystem({ onRecommendationGenerated }: CropRecommendationSystemProps) {
  const [recommendations, setRecommendations] = useState<CropSuitability[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropSuitability | null>(null);
  const [activeView, setActiveView] = useState<'setup' | 'results' | 'details'>('setup');
  const [preferences, setPreferences] = useState({
    focusOnProfit: true,
    focusOnSustainability: false,
    focusOnRiskReduction: false,
    farmingExperience: 'intermediate',
    hasIrrigation: false,
    laborAvailability: 'medium',
    budget: 50000,
  });

  // Mock data for fields
  const fields = [
    { 
      id: 1, 
      name: 'Field A - North', 
      area: 25.5, 
      soilType: 'loamy',
      lastCrop: 'Corn',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    { 
      id: 2, 
      name: 'Field B - South', 
      area: 18.2, 
      soilType: 'sandy',
      lastCrop: 'Wheat',
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    { 
      id: 3, 
      name: 'Field C - East', 
      area: 32.1, 
      soilType: 'clay',
      lastCrop: 'Soybeans',
      coordinates: { lat: 40.6892, lng: -74.0445 }
    },
  ];

  // Mock crop database
  const cropDatabase = [
    {
      id: 1,
      name: 'Corn',
      varieties: ['Sweet Corn', 'Field Corn', 'Popcorn'],
      optimalConditions: {
        temperature: { min: 15, max: 35 },
        rainfall: { min: 500, max: 1000 },
        pH: { min: 6.0, max: 6.8 },
        soilTypes: ['loamy', 'sandy'],
      },
      marketData: {
        avgPrice: 180,
        demand: 'high',
        trend: 'stable',
      },
      growthDuration: 120,
      waterRequirement: 600,
    },
    {
      id: 2,
      name: 'Wheat',
      varieties: ['Winter Wheat', 'Spring Wheat', 'Durum'],
      optimalConditions: {
        temperature: { min: 10, max: 25 },
        rainfall: { min: 300, max: 700 },
        pH: { min: 6.0, max: 7.5 },
        soilTypes: ['loamy', 'clay'],
      },
      marketData: {
        avgPrice: 220,
        demand: 'medium',
        trend: 'growing',
      },
      growthDuration: 180,
      waterRequirement: 450,
    },
    {
      id: 3,
      name: 'Soybeans',
      varieties: ['Edamame', 'Oil Soybeans', 'Food Grade'],
      optimalConditions: {
        temperature: { min: 18, max: 30 },
        rainfall: { min: 450, max: 800 },
        pH: { min: 6.0, max: 7.0 },
        soilTypes: ['loamy', 'sandy'],
      },
      marketData: {
        avgPrice: 350,
        demand: 'high',
        trend: 'growing',
      },
      growthDuration: 100,
      waterRequirement: 500,
    },
    {
      id: 4,
      name: 'Tomatoes',
      varieties: ['Cherry', 'Beefsteak', 'Roma'],
      optimalConditions: {
        temperature: { min: 18, max: 29 },
        rainfall: { min: 400, max: 600 },
        pH: { min: 6.0, max: 6.8 },
        soilTypes: ['loamy'],
      },
      marketData: {
        avgPrice: 1200,
        demand: 'high',
        trend: 'stable',
      },
      growthDuration: 80,
      waterRequirement: 400,
    },
    {
      id: 5,
      name: 'Potatoes',
      varieties: ['Russet', 'Red', 'Fingerling'],
      optimalConditions: {
        temperature: { min: 15, max: 20 },
        rainfall: { min: 400, max: 600 },
        pH: { min: 5.0, max: 6.5 },
        soilTypes: ['sandy', 'loamy'],
      },
      marketData: {
        avgPrice: 300,
        demand: 'medium',
        trend: 'stable',
      },
      growthDuration: 90,
      waterRequirement: 350,
    },
  ];

  const generateRecommendations = async () => {
    if (!selectedField) {
      Alert.alert('Error', 'Please select a field first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const field = fields.find(f => f.id.toString() === selectedField);
    if (!field) return;

    // Mock soil and weather data based on field
    const mockSoilData: SoilData = {
      pH: 6.5,
      nitrogen: 45,
      phosphorus: 25,
      potassium: 180,
      organicMatter: 3.2,
      moisture: 22,
      temperature: 18,
      salinity: 0.8,
      texture: field.soilType as any,
      drainage: 'good',
    };

    const mockWeatherData: WeatherData = {
      averageTemperature: 22,
      minTemperature: 8,
      maxTemperature: 32,
      rainfall: 650,
      humidity: 65,
      sunlightHours: 8,
      windSpeed: 12,
      frostDays: 15,
      growingSeason: 180,
    };

    // Generate recommendations using mock AI algorithm
    const cropRecommendations = cropDatabase.map(crop => {
      const soilScore = calculateSoilSuitability(crop, mockSoilData);
      const weatherScore = calculateWeatherSuitability(crop, mockWeatherData);
      const marketScore = calculateMarketSuitability(crop, preferences);
      const sustainabilityScore = calculateSustainabilityScore(crop, mockSoilData);

      const overallScore = (
        soilScore * 0.3 +
        weatherScore * 0.3 +
        marketScore * 0.25 +
        sustainabilityScore * 0.15
      );

      const expectedYield = calculateExpectedYield(crop, field.area, soilScore, weatherScore);
      const expectedRevenue = expectedYield * crop.marketData.avgPrice;
      const expectedCosts = calculateExpectedCosts(crop, field.area, preferences);
      const expectedProfit = expectedRevenue - expectedCosts;

      return {
        cropId: crop.id,
        cropName: crop.name,
        variety: crop.varieties[0],
        suitabilityScore: overallScore,
        confidence: Math.min(95, 70 + (overallScore * 25)),
        factors: {
          soil: soilScore,
          weather: weatherScore,
          market: marketScore,
          sustainability: sustainabilityScore,
        },
        expectedYield,
        expectedRevenue,
        expectedProfit,
        riskLevel: calculateRiskLevel(overallScore, crop.marketData.trend),
        waterRequirement: crop.waterRequirement,
        fertilizerRequirement: calculateFertilizerRequirement(crop, mockSoilData),
        laborRequirement: calculateLaborRequirement(crop, field.area),
        growthDuration: crop.growthDuration,
        plantingWindow: calculatePlantingWindow(crop),
        harvestWindow: calculateHarvestWindow(crop),
        advantages: generateAdvantages(crop, overallScore),
        challenges: generateChallenges(crop, overallScore),
        recommendations: generateRecommendations(crop, mockSoilData, preferences),
      } as CropSuitability;
    });

    // Sort by suitability score
    const sortedRecommendations = cropRecommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    setRecommendations(sortedRecommendations);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setActiveView('results');

    if (onRecommendationGenerated) {
      onRecommendationGenerated(sortedRecommendations);
    }
  };

  const calculateSoilSuitability = (crop: any, soil: SoilData): number => {
    let score = 0;
    
    // pH suitability
    const optimalPH = crop.optimalConditions.pH;
    if (soil.pH >= optimalPH.min && soil.pH <= optimalPH.max) {
      score += 30;
    } else {
      const deviation = Math.min(Math.abs(soil.pH - optimalPH.min), Math.abs(soil.pH - optimalPH.max));
      score += Math.max(0, 30 - (deviation * 10));
    }

    // Soil type suitability
    if (crop.optimalConditions.soilTypes.includes(soil.texture)) {
      score += 25;
    } else {
      score += 10;
    }

    // Nutrient levels
    score += Math.min(25, soil.nitrogen / 2);
    score += Math.min(20, soil.organicMatter * 5);

    return Math.min(100, score);
  };

  const calculateWeatherSuitability = (crop: any, weather: WeatherData): number => {
    let score = 0;
    
    // Temperature suitability
    const tempRange = crop.optimalConditions.temperature;
    if (weather.averageTemperature >= tempRange.min && weather.averageTemperature <= tempRange.max) {
      score += 40;
    } else {
      const deviation = Math.min(
        Math.abs(weather.averageTemperature - tempRange.min),
        Math.abs(weather.averageTemperature - tempRange.max)
      );
      score += Math.max(0, 40 - (deviation * 2));
    }

    // Rainfall suitability
    const rainfallRange = crop.optimalConditions.rainfall;
    if (weather.rainfall >= rainfallRange.min && weather.rainfall <= rainfallRange.max) {
      score += 35;
    } else {
      const deviation = Math.min(
        Math.abs(weather.rainfall - rainfallRange.min),
        Math.abs(weather.rainfall - rainfallRange.max)
      );
      score += Math.max(0, 35 - (deviation / 20));
    }

    // Growing season length
    if (weather.growingSeason >= crop.growthDuration) {
      score += 25;
    } else {
      score += (weather.growingSeason / crop.growthDuration) * 25;
    }

    return Math.min(100, score);
  };

  const calculateMarketSuitability = (crop: any, prefs: any): number => {
    let score = 0;
    
    // Demand level
    const demandScore = crop.marketData.demand === 'high' ? 40 : 
                       crop.marketData.demand === 'medium' ? 25 : 10;
    score += demandScore;

    // Price trend
    const trendScore = crop.marketData.trend === 'growing' ? 30 : 
                      crop.marketData.trend === 'stable' ? 20 : 5;
    score += trendScore;

    // Price level
    score += Math.min(30, crop.marketData.avgPrice / 50);

    return Math.min(100, score);
  };

  const calculateSustainabilityScore = (crop: any, soil: SoilData): number => {
    let score = 50; // Base score

    // Water efficiency
    if (crop.waterRequirement < 400) score += 20;
    else if (crop.waterRequirement < 600) score += 10;

    // Soil health impact
    if (crop.name === 'Soybeans') score += 20; // Nitrogen fixing
    if (crop.name === 'Corn' && soil.organicMatter > 3) score += 10;

    // Pest resistance
    if (crop.name === 'Potatoes') score += 10;

    return Math.min(100, score);
  };

  const calculateExpectedYield = (crop: any, area: number, soilScore: number, weatherScore: number): number => {
    const baseYield = {
      'Corn': 9.5,
      'Wheat': 3.2,
      'Soybeans': 2.8,
      'Tomatoes': 45,
      'Potatoes': 35,
    }[crop.name] || 5;

    const conditionMultiplier = ((soilScore + weatherScore) / 200) * 0.5 + 0.75;
    return baseYield * area * conditionMultiplier;
  };

  const calculateExpectedCosts = (crop: any, area: number, prefs: any): number => {
    const baseCostPerHectare = {
      'Corn': 1200,
      'Wheat': 800,
      'Soybeans': 900,
      'Tomatoes': 3500,
      'Potatoes': 2200,
    }[crop.name] || 1000;

    let totalCost = baseCostPerHectare * area;

    // Adjust for irrigation
    if (prefs.hasIrrigation) {
      totalCost *= 1.15;
    }

    // Adjust for labor availability
    if (prefs.laborAvailability === 'low') {
      totalCost *= 1.25;
    }

    return totalCost;
  };

  const calculateRiskLevel = (suitabilityScore: number, trend: string): 'low' | 'medium' | 'high' => {
    if (suitabilityScore > 80 && trend === 'growing') return 'low';
    if (suitabilityScore > 60 && trend !== 'declining') return 'medium';
    return 'high';
  };

  const calculateFertilizerRequirement = (crop: any, soil: SoilData): number => {
    const baseRequirement = {
      'Corn': 180,
      'Wheat': 120,
      'Soybeans': 60,
      'Tomatoes': 200,
      'Potatoes': 150,
    }[crop.name] || 100;

    // Adjust based on soil nutrients
    const adjustment = 1 - (soil.nitrogen / 100);
    return baseRequirement * (1 + adjustment);
  };

  const calculateLaborRequirement = (crop: any, area: number): number => {
    const baseLaborPerHectare = {
      'Corn': 12,
      'Wheat': 8,
      'Soybeans': 10,
      'Tomatoes': 45,
      'Potatoes': 25,
    }[crop.name] || 15;

    return baseLaborPerHectare * area;
  };

  const calculatePlantingWindow = (crop: any): string => {
    const windows = {
      'Corn': 'April - May',
      'Wheat': 'September - October',
      'Soybeans': 'May - June',
      'Tomatoes': 'March - April',
      'Potatoes': 'March - April',
    };
    return windows[crop.name] || 'Spring';
  };

  const calculateHarvestWindow = (crop: any): string => {
    const windows = {
      'Corn': 'August - September',
      'Wheat': 'June - July',
      'Soybeans': 'September - October',
      'Tomatoes': 'July - August',
      'Potatoes': 'June - July',
    };
    return windows[crop.name] || 'Fall';
  };

  const generateAdvantages = (crop: any, score: number): string[] => {
    const advantages = [];
    
    if (score > 80) {
      advantages.push('Excellent growing conditions');
      advantages.push('High yield potential');
    }
    
    if (crop.marketData.demand === 'high') {
      advantages.push('Strong market demand');
    }
    
    if (crop.marketData.trend === 'growing') {
      advantages.push('Positive price trend');
    }
    
    if (crop.waterRequirement < 500) {
      advantages.push('Water efficient crop');
    }
    
    return advantages;
  };

  const generateChallenges = (crop: any, score: number): string[] => {
    const challenges = [];
    
    if (score < 60) {
      challenges.push('Suboptimal growing conditions');
    }
    
    if (crop.marketData.demand === 'low') {
      challenges.push('Limited market demand');
    }
    
    if (crop.waterRequirement > 600) {
      challenges.push('High water requirements');
    }
    
    if (crop.name === 'Tomatoes') {
      challenges.push('Requires intensive management');
    }
    
    return challenges;
  };

  const generateRecommendations = (crop: any, soil: SoilData, prefs: any): string[] => {
    const recommendations = [];
    
    if (soil.pH < crop.optimalConditions.pH.min) {
      recommendations.push('Consider lime application to raise soil pH');
    }
    
    if (soil.nitrogen < 40) {
      recommendations.push('Apply nitrogen fertilizer before planting');
    }
    
    if (!prefs.hasIrrigation && crop.waterRequirement > 500) {
      recommendations.push('Consider installing irrigation system');
    }
    
    if (crop.name === 'Tomatoes') {
      recommendations.push('Use disease-resistant varieties');
      recommendations.push('Implement integrated pest management');
    }
    
    return recommendations;
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return theme.colors.success[500];
    if (score >= 60) return theme.colors.warning[500];
    return theme.colors.error[500];
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return theme.colors.success[500];
      case 'medium': return theme.colors.warning[500];
      case 'high': return theme.colors.error[500];
      default: return theme.colors.neutral[500];
    }
  };

  const renderSetupView = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={styles.setupCard}>
        <View style={styles.setupHeader}>
          <Brain size={32} color={theme.colors.primary[500]} />
          <Text style={styles.setupTitle}>AI Crop Recommendation</Text>
          <Text style={styles.setupSubtitle}>
            Get personalized crop recommendations based on your field conditions, weather patterns, and market trends
          </Text>
        </View>

        <View style={styles.setupForm}>
          <Dropdown
            label="Select Field"
            value={selectedField}
            onValueChange={setSelectedField}
            options={fields.map(f => ({ 
              label: `${f.name} (${f.area} ha)`, 
              value: f.id.toString() 
            }))}
            placeholder="Choose a field for analysis"
            required
          />

          <View style={styles.preferencesSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.preferenceItem}>
              <TouchableOpacity
                style={[styles.checkbox, preferences.focusOnProfit && styles.checkboxChecked]}
                onPress={() => setPreferences(prev => ({ ...prev, focusOnProfit: !prev.focusOnProfit }))}
              >
                {preferences.focusOnProfit && <CheckCircle size={16} color={theme.colors.neutral[50]} />}
              </TouchableOpacity>
              <Text style={styles.preferenceLabel}>Focus on profitability</Text>
            </View>

            <View style={styles.preferenceItem}>
              <TouchableOpacity
                style={[styles.checkbox, preferences.focusOnSustainability && styles.checkboxChecked]}
                onPress={() => setPreferences(prev => ({ ...prev, focusOnSustainability: !prev.focusOnSustainability }))}
              >
                {preferences.focusOnSustainability && <CheckCircle size={16} color={theme.colors.neutral[50]} />}
              </TouchableOpacity>
              <Text style={styles.preferenceLabel}>Focus on sustainability</Text>
            </View>

            <View style={styles.preferenceItem}>
              <TouchableOpacity
                style={[styles.checkbox, preferences.focusOnRiskReduction && styles.checkboxChecked]}
                onPress={() => setPreferences(prev => ({ ...prev, focusOnRiskReduction: !prev.focusOnRiskReduction }))}
              >
                {preferences.focusOnRiskReduction && <CheckCircle size={16} color={theme.colors.neutral[50]} />}
              </TouchableOpacity>
              <Text style={styles.preferenceLabel}>Focus on risk reduction</Text>
            </View>
          </View>

          <Dropdown
            label="Farming Experience"
            value={preferences.farmingExperience}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, farmingExperience: value }))}
            options={[
              { label: 'Beginner', value: 'beginner' },
              { label: 'Intermediate', value: 'intermediate' },
              { label: 'Expert', value: 'expert' },
            ]}
          />

          <View style={styles.resourcesSection}>
            <Text style={styles.sectionTitle}>Available Resources</Text>
            
            <View style={styles.preferenceItem}>
              <TouchableOpacity
                style={[styles.checkbox, preferences.hasIrrigation && styles.checkboxChecked]}
                onPress={() => setPreferences(prev => ({ ...prev, hasIrrigation: !prev.hasIrrigation }))}
              >
                {preferences.hasIrrigation && <CheckCircle size={16} color={theme.colors.neutral[50]} />}
              </TouchableOpacity>
              <Text style={styles.preferenceLabel}>Irrigation system available</Text>
            </View>

            <Dropdown
              label="Labor Availability"
              value={preferences.laborAvailability}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, laborAvailability: value }))}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
            />
          </View>
        </View>

        <Button
          title={isAnalyzing ? "Analyzing..." : "Generate Recommendations"}
          onPress={generateRecommendations}
          disabled={isAnalyzing || !selectedField}
          loading={isAnalyzing}
          style={styles.analyzeButton}
        />
      </Card>
    </ScrollView>
  );

  const renderResultsView = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={styles.resultsHeader}>
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsTitle}>Crop Recommendations</Text>
          <Text style={styles.resultsSubtitle}>
            Based on analysis of {fields.find(f => f.id.toString() === selectedField)?.name}
          </Text>
        </View>
        <Button
          title="New Analysis"
          onPress={() => setActiveView('setup')}
          variant="outline"
          size="sm"
        />
      </Card>

      {recommendations.map((crop, index) => (
        <Card key={crop.cropId} style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <View style={styles.recommendationInfo}>
              <Text style={styles.cropName}>{crop.cropName}</Text>
              <Text style={styles.cropVariety}>{crop.variety}</Text>
            </View>
            <View style={styles.recommendationScore}>
              <Text style={[styles.suitabilityScore, { color: getSuitabilityColor(crop.suitabilityScore) }]}>
                {crop.suitabilityScore.toFixed(0)}%
              </Text>
              <Text style={styles.confidenceScore}>
                {crop.confidence.toFixed(0)}% confidence
              </Text>
            </View>
          </View>

          <View style={styles.factorScores}>
            <View style={styles.factorItem}>
              <MapPin size={16} color={theme.colors.neutral[500]} />
              <Text style={styles.factorLabel}>Soil</Text>
              <Text style={styles.factorScore}>{crop.factors.soil.toFixed(0)}%</Text>
            </View>
            <View style={styles.factorItem}>
              <CloudRain size={16} color={theme.colors.neutral[500]} />
              <Text style={styles.factorLabel}>Weather</Text>
              <Text style={styles.factorScore}>{crop.factors.weather.toFixed(0)}%</Text>
            </View>
            <View style={styles.factorItem}>
              <DollarSign size={16} color={theme.colors.neutral[500]} />
              <Text style={styles.factorLabel}>Market</Text>
              <Text style={styles.factorScore}>{crop.factors.market.toFixed(0)}%</Text>
            </View>
            <View style={styles.factorItem}>
              <Leaf size={16} color={theme.colors.neutral[500]} />
              <Text style={styles.factorLabel}>Sustainability</Text>
              <Text style={styles.factorScore}>{crop.factors.sustainability.toFixed(0)}%</Text>
            </View>
          </View>

          <View style={styles.projections}>
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Expected Yield</Text>
              <Text style={styles.projectionValue}>{crop.expectedYield.toFixed(1)} tons</Text>
            </View>
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Expected Revenue</Text>
              <Text style={styles.projectionValue}>${crop.expectedRevenue.toLocaleString()}</Text>
            </View>
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Expected Profit</Text>
              <Text style={[styles.projectionValue, { color: crop.expectedProfit > 0 ? theme.colors.success[500] : theme.colors.error[500] }]}>
                ${crop.expectedProfit.toLocaleString()}
              </Text>
            </View>
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Risk Level</Text>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(crop.riskLevel) + '20' }]}>
                <Text style={[styles.riskText, { color: getRiskColor(crop.riskLevel) }]}>
                  {crop.riskLevel.charAt(0).toUpperCase() + crop.riskLevel.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.recommendationFooter}>
            <Button
              title="View Details"
              onPress={() => {
                setSelectedCrop(crop);
                setActiveView('details');
              }}
              variant="outline"
              size="sm"
            />
            {index === 0 && (
              <Button
                title="Select This Crop"
                onPress={() => Alert.alert('Success', `${crop.cropName} selected for planting!`)}
                size="sm"
              />
            )}
          </View>
        </Card>
      ))}
    </ScrollView>
  );

  const renderDetailsView = () => {
    if (!selectedCrop) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.detailsHeader}>
          <View style={styles.detailsInfo}>
            <Text style={styles.detailsTitle}>{selectedCrop.cropName}</Text>
            <Text style={styles.detailsSubtitle}>{selectedCrop.variety}</Text>
          </View>
          <Button
            title="Back to Results"
            onPress={() => setActiveView('results')}
            variant="outline"
            size="sm"
          />
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Growth Information</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsLabel}>Growth Duration</Text>
              <Text style={styles.detailsValue}>{selectedCrop.growthDuration} days</Text>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsLabel}>Planting Window</Text>
              <Text style={styles.detailsValue}>{selectedCrop.plantingWindow}</Text>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsLabel}>Harvest Window</Text>
              <Text style={styles.detailsValue}>{selectedCrop.harvestWindow}</Text>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsLabel}>Water Requirement</Text>
              <Text style={styles.detailsValue}>{selectedCrop.waterRequirement} mm</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Resource Requirements</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsLabel}>Fertilizer</Text>
              <Text style={styles.detailsValue}>{selectedCrop.fertilizerRequirement.toFixed(0)} kg/ha</Text>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsLabel}>Labor</Text>
              <Text style={styles.detailsValue}>{selectedCrop.laborRequirement.toFixed(0)} hours</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Advantages</Text>
          {selectedCrop.advantages.map((advantage, index) => (
            <View key={index} style={styles.listItem}>
              <CheckCircle size={16} color={theme.colors.success[500]} />
              <Text style={styles.listText}>{advantage}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Challenges</Text>
          {selectedCrop.challenges.map((challenge, index) => (
            <View key={index} style={styles.listItem}>
              <AlertCircle size={16} color={theme.colors.warning[500]} />
              <Text style={styles.listText}>{challenge}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.detailsSectionTitle}>Recommendations</Text>
          {selectedCrop.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{recommendation}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Crop Recommendations</Text>
        {analysisComplete && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Analysis Complete</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {activeView === 'setup' && renderSetupView()}
        {activeView === 'results' && renderResultsView()}
        {activeView === 'details' && renderDetailsView()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  headerBadge: {
    backgroundColor: theme.colors.success[500],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.full,
  },
  headerBadgeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[50],
    fontWeight: theme.typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    padding: theme.spacing[4],
  },
  setupCard: {
    padding: theme.spacing[6],
  },
  setupHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  setupTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  setupSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  setupForm: {
    marginBottom: theme.spacing[6],
  },
  preferencesSection: {
    marginTop: theme.spacing[4],
  },
  resourcesSection: {
    marginTop: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[3],
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.radii.sm,
    marginRight: theme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  preferenceLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  analyzeButton: {
    marginTop: theme.spacing[4],
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  resultsInfo: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  resultsSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  recommendationCard: {
    marginBottom: theme.spacing[4],
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  recommendationInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  cropVariety: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  recommendationScore: {
    alignItems: 'flex-end',
  },
  suitabilityScore: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[1],
  },
  confidenceScore: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  factorScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  factorItem: {
    alignItems: 'center',
    flex: 1,
  },
  factorLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing[1],
    marginBottom: theme.spacing[1],
  },
  factorScore: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  projections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  projectionItem: {
    width: '48%',
  },
  projectionLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  projectionValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  riskBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
    alignSelf: 'flex-start',
  },
  riskText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  recommendationFooter: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  detailsInfo: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  detailsSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[600],
  },
  detailsCard: {
    marginBottom: theme.spacing[4],
  },
  detailsSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[3],
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  detailsItem: {
    width: '48%',
  },
  detailsLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  detailsValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[2],
  },
  listText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginLeft: theme.spacing[2],
    flex: 1,
  },
  bulletPoint: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[600],
    marginRight: theme.spacing[2],
  },
});