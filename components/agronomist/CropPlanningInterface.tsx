import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Calendar, Clock, TrendingUp, Sprout, MapPin, Plus, Edit3, Trash2, X } from 'lucide-react-native';
import { theme } from '@/components/designSystem';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface CropPlan {
  id: number;
  name: string;
  fieldId: number;
  fieldName: string;
  cropType: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  growthStages: GrowthStage[];
  yieldForecast: YieldForecast;
  rotationPlan: RotationPlan;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface GrowthStage {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  keyActivities: string[];
  isCompleted: boolean;
}

interface YieldForecast {
  predictedYield: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  influencingFactors: string[];
  lastUpdated: string;
}

interface RotationPlan {
  previousCrop: string;
  nextCrop: string;
  rotationCycle: number;
  soilHealthImpact: 'positive' | 'neutral' | 'negative';
  recommendations: string[];
}

interface CropPlanningInterfaceProps {
  onCropPlanChange?: (plans: CropPlan[]) => void;
}

export default function CropPlanningInterface({ onCropPlanChange }: CropPlanningInterfaceProps) {
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<CropPlan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showYieldForecast, setShowYieldForecast] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'rotation' | 'forecast'>('overview');
  const [formData, setFormData] = useState({
    name: '',
    fieldId: '',
    cropType: '',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
  });

  // Mock data for fields and crop types
  const fields = [
    { id: 1, name: 'Field A - North', area: 25.5 },
    { id: 2, name: 'Field B - South', area: 18.2 },
    { id: 3, name: 'Field C - East', area: 32.1 },
  ];

  const cropTypes = [
    { id: 1, name: 'Corn', varieties: ['Sweet Corn', 'Dent Corn', 'Flint Corn'] },
    { id: 2, name: 'Wheat', varieties: ['Winter Wheat', 'Spring Wheat', 'Durum Wheat'] },
    { id: 3, name: 'Soybeans', varieties: ['Determinate', 'Indeterminate', 'Semi-Determinate'] },
    { id: 4, name: 'Rice', varieties: ['Jasmine', 'Basmati', 'Arborio'] },
  ];

  useEffect(() => {
    loadCropPlans();
  }, []);

  const loadCropPlans = async () => {
    // Mock data - in real app, this would fetch from API
    const mockPlans: CropPlan[] = [
      {
        id: 1,
        name: 'Spring Corn 2024',
        fieldId: 1,
        fieldName: 'Field A - North',
        cropType: 'Corn',
        variety: 'Sweet Corn',
        plantingDate: '2024-04-15',
        expectedHarvestDate: '2024-09-15',
        growthStages: [
          {
            id: 1,
            name: 'Germination',
            startDate: '2024-04-15',
            endDate: '2024-04-25',
            description: 'Seed germination and emergence',
            keyActivities: ['Soil preparation', 'Planting', 'Initial watering'],
            isCompleted: true,
          },
          {
            id: 2,
            name: 'Vegetative Growth',
            startDate: '2024-04-25',
            endDate: '2024-07-15',
            description: 'Leaf and stem development',
            keyActivities: ['Fertilization', 'Pest monitoring', 'Irrigation'],
            isCompleted: false,
          },
          {
            id: 3,
            name: 'Reproductive',
            startDate: '2024-07-15',
            endDate: '2024-09-15',
            description: 'Flowering and grain development',
            keyActivities: ['Pollination support', 'Disease control', 'Harvest preparation'],
            isCompleted: false,
          },
        ],
        yieldForecast: {
          predictedYield: 8.5,
          confidenceInterval: { lower: 7.2, upper: 9.8 },
          influencingFactors: ['Weather conditions', 'Soil fertility', 'Pest pressure'],
          lastUpdated: '2024-03-15',
        },
        rotationPlan: {
          previousCrop: 'Soybeans',
          nextCrop: 'Wheat',
          rotationCycle: 3,
          soilHealthImpact: 'positive',
          recommendations: ['Add nitrogen-fixing legumes', 'Monitor soil pH'],
        },
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-03-15',
      },
    ];
    setCropPlans(mockPlans);
    if (onCropPlanChange) {
      onCropPlanChange(mockPlans);
    }
  };

  const handleCreatePlan = () => {
    setFormData({
      name: '',
      fieldId: '',
      cropType: '',
      variety: '',
      plantingDate: '',
      expectedHarvestDate: '',
    });
    setSelectedPlan(null);
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan: CropPlan) => {
    setFormData({
      name: plan.name,
      fieldId: plan.fieldId.toString(),
      cropType: plan.cropType,
      variety: plan.variety,
      plantingDate: plan.plantingDate,
      expectedHarvestDate: plan.expectedHarvestDate,
    });
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleSavePlan = () => {
    if (!formData.name || !formData.fieldId || !formData.cropType) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const field = fields.find(f => f.id.toString() === formData.fieldId);
    if (!field) return;

    const newPlan: CropPlan = {
      id: selectedPlan?.id || Date.now(),
      name: formData.name,
      fieldId: parseInt(formData.fieldId),
      fieldName: field.name,
      cropType: formData.cropType,
      variety: formData.variety,
      plantingDate: formData.plantingDate,
      expectedHarvestDate: formData.expectedHarvestDate,
      growthStages: [], // Would be generated based on crop type
      yieldForecast: {
        predictedYield: 0,
        confidenceInterval: { lower: 0, upper: 0 },
        influencingFactors: [],
        lastUpdated: new Date().toISOString(),
      },
      rotationPlan: {
        previousCrop: '',
        nextCrop: '',
        rotationCycle: 1,
        soilHealthImpact: 'neutral',
        recommendations: [],
      },
      status: 'draft',
      createdAt: selectedPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedPlan) {
      setCropPlans(prev => prev.map(p => p.id === selectedPlan.id ? newPlan : p));
    } else {
      setCropPlans(prev => [...prev, newPlan]);
    }

    setShowPlanModal(false);
    Alert.alert('Success', 'Crop plan saved successfully');
  };

  const handleDeletePlan = (planId: number) => {
    Alert.alert(
      'Delete Crop Plan',
      'Are you sure you want to delete this crop plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCropPlans(prev => prev.filter(p => p.id !== planId));
            Alert.alert('Success', 'Crop plan deleted successfully');
          },
        },
      ]
    );
  };

  const renderPlanCard = (plan: CropPlan) => (
    <Card key={plan.id} style={styles.planCard}>
      <View style={styles.planHeader}>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planField}>
            <MapPin size={14} color={theme.colors.neutral[500]} />
            {plan.fieldName}
          </Text>
        </View>
        <View style={styles.planActions}>
          <TouchableOpacity onPress={() => handleEditPlan(plan)} style={styles.actionButton}>
            <Edit3 size={16} color={theme.colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletePlan(plan.id)} style={styles.actionButton}>
            <Trash2 size={16} color={theme.colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.planDetails}>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Crop:</Text>
          <Text style={styles.planValue}>{plan.cropType} - {plan.variety}</Text>
        </View>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Planting Date:</Text>
          <Text style={styles.planValue}>{plan.plantingDate}</Text>
        </View>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Expected Harvest:</Text>
          <Text style={styles.planValue}>{plan.expectedHarvestDate}</Text>
        </View>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(plan.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(plan.status) }]}>
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.planFooter}>
        <Button
          title="View Details"
          onPress={() => {
            setSelectedPlan(plan);
            setActiveTab('overview');
          }}
          variant="outline"
          size="sm"
        />
        <Button
          title="Yield Forecast"
          onPress={() => {
            setSelectedPlan(plan);
            setShowYieldForecast(true);
          }}
          variant="ghost"
          size="sm"
          icon={<TrendingUp size={16} color={theme.colors.primary[500]} />}
        />
      </View>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success[500];
      case 'completed': return theme.colors.primary[500];
      case 'draft': return theme.colors.warning[500];
      default: return theme.colors.neutral[500];
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crop Planning</Text>
        <Button
          title="New Plan"
          onPress={handleCreatePlan}
          icon={<Plus size={16} color={theme.colors.neutral[50]} />}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cropPlans.length === 0 ? (
          <Card style={styles.emptyState}>
            <Sprout size={48} color={theme.colors.neutral[400]} />
            <Text style={styles.emptyStateText}>No crop plans yet</Text>
            <Text style={styles.emptyStateSubtext}>Create your first crop plan to get started</Text>
            <Button
              title="Create Plan"
              onPress={handleCreatePlan}
              style={styles.emptyStateButton}
            />
          </Card>
        ) : (
          cropPlans.map(renderPlanCard)
        )}
      </ScrollView>

      {/* Create/Edit Plan Modal */}
      <Modal visible={showPlanModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedPlan ? 'Edit Crop Plan' : 'Create Crop Plan'}
            </Text>
            <TouchableOpacity onPress={() => setShowPlanModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <FormField
              label="Plan Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="e.g., Spring Corn 2024"
              required
            />

            <Dropdown
              label="Field"
              value={formData.fieldId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fieldId: value }))}
              options={fields.map(f => ({ label: f.name, value: f.id.toString() }))}
              placeholder="Select field"
              required
            />

            <Dropdown
              label="Crop Type"
              value={formData.cropType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))}
              options={cropTypes.map(c => ({ label: c.name, value: c.name }))}
              placeholder="Select crop type"
              required
            />

            <Dropdown
              label="Variety"
              value={formData.variety}
              onValueChange={(value) => setFormData(prev => ({ ...prev, variety: value }))}
              options={
                cropTypes
                  .find(c => c.name === formData.cropType)
                  ?.varieties.map(v => ({ label: v, value: v })) || []
              }
              placeholder="Select variety"
              disabled={!formData.cropType}
            />

            <FormField
              label="Planting Date"
              value={formData.plantingDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, plantingDate: text }))}
              placeholder="YYYY-MM-DD"
            />

            <FormField
              label="Expected Harvest Date"
              value={formData.expectedHarvestDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, expectedHarvestDate: text }))}
              placeholder="YYYY-MM-DD"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowPlanModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Save Plan"
              onPress={handleSavePlan}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Yield Forecast Modal */}
      <Modal visible={showYieldForecast} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yield Forecast</Text>
            <TouchableOpacity onPress={() => setShowYieldForecast(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          {selectedPlan && (
            <ScrollView style={styles.modalContent}>
              <Card style={styles.forecastCard}>
                <View style={styles.forecastHeader}>
                  <TrendingUp size={24} color={theme.colors.primary[500]} />
                  <Text style={styles.forecastTitle}>
                    {selectedPlan.name} - Yield Prediction
                  </Text>
                </View>

                <View style={styles.forecastMetrics}>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Predicted Yield:</Text>
                    <Text style={styles.metricValue}>
                      {selectedPlan.yieldForecast.predictedYield} tons/hectare
                    </Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Confidence Range:</Text>
                    <Text style={styles.metricValue}>
                      {selectedPlan.yieldForecast.confidenceInterval.lower} - {selectedPlan.yieldForecast.confidenceInterval.upper} tons/hectare
                    </Text>
                  </View>
                </View>

                <View style={styles.factorsSection}>
                  <Text style={styles.sectionTitle}>Influencing Factors:</Text>
                  {selectedPlan.yieldForecast.influencingFactors.map((factor, index) => (
                    <Text key={index} style={styles.factorItem}>• {factor}</Text>
                  ))}
                </View>

                <Text style={styles.lastUpdated}>
                  Last updated: {selectedPlan.yieldForecast.lastUpdated}
                </Text>
              </Card>
            </ScrollView>
          )}
        </View>
      </Modal>
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
  content: {
    flex: 1,
    padding: theme.spacing[4],
  },
  planCard: {
    marginBottom: theme.spacing[4],
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  planField: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
    flexDirection: 'row',
    alignItems: 'center',
  },
  planActions: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  actionButton: {
    padding: theme.spacing[2],
  },
  planDetails: {
    marginBottom: theme.spacing[3],
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  planLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  planValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  planFooter: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing[8],
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  emptyStateSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  emptyStateButton: {
    marginTop: theme.spacing[2],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing[4],
  },
  modalFooter: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalButton: {
    flex: 1,
  },
  forecastCard: {
    marginBottom: theme.spacing[4],
  },
  forecastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  forecastTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing[2],
  },
  forecastMetrics: {
    marginBottom: theme.spacing[4],
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  factorsSection: {
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  factorItem: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  lastUpdated: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    fontStyle: 'italic',
  },
});