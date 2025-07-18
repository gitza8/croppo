import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { TestTube, TrendingUp, MapPin, Plus, Calendar, FileText, X, Download } from 'lucide-react-native';
import { theme } from '@/components/designSystem';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface SoilTest {
  id: number;
  fieldId: number;
  fieldName: string;
  testDate: string;
  labName: string;
  reportUrl?: string;
  results: SoilTestResults;
  recommendations: string[];
  status: 'pending' | 'completed' | 'expired';
  createdAt: string;
  updatedAt: string;
}

interface SoilTestResults {
  ph: number;
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  calcium: number;
  magnesium: number;
  sulfur: number;
  zinc: number;
  iron: number;
  manganese: number;
  copper: number;
  boron: number;
  cec: number; // Cation Exchange Capacity
  texture: string;
  salinity: number;
}

interface FertilizationPlan {
  id: number;
  fieldId: number;
  fieldName: string;
  soilTestId: number;
  targetNutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  recommendations: FertilizerRecommendation[];
  totalCost: number;
  applicationSchedule: ApplicationSchedule[];
  status: 'draft' | 'approved' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface FertilizerRecommendation {
  id: number;
  productName: string;
  productType: 'organic' | 'synthetic' | 'slow-release';
  npkRatio: string;
  rate: number;
  unit: string;
  cost: number;
  applicationMethod: string;
  timing: string;
  notes: string;
}

interface ApplicationSchedule {
  id: number;
  date: string;
  productName: string;
  rate: number;
  unit: string;
  method: string;
  isCompleted: boolean;
  actualDate?: string;
  notes?: string;
}

interface SoilHealthInterfaceProps {
  onDataChange?: (data: { soilTests: SoilTest[]; fertilizationPlans: FertilizationPlan[] }) => void;
}

export default function SoilHealthInterface({ onDataChange }: SoilHealthInterfaceProps) {
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [fertilizationPlans, setFertilizationPlans] = useState<FertilizationPlan[]>([]);
  const [selectedTest, setSelectedTest] = useState<SoilTest | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<FertilizationPlan | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'tests' | 'plans' | 'trends'>('tests');
  const [testFormData, setTestFormData] = useState({
    fieldId: '',
    testDate: '',
    labName: '',
    ph: '',
    organicMatter: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    calcium: '',
    magnesium: '',
    sulfur: '',
  });

  // Mock data for fields
  const fields = [
    { id: 1, name: 'Field A - North', area: 25.5 },
    { id: 2, name: 'Field B - South', area: 18.2 },
    { id: 3, name: 'Field C - East', area: 32.1 },
  ];

  const labs = [
    { id: 1, name: 'AgriLab Services' },
    { id: 2, name: 'Soil Analysis Pro' },
    { id: 3, name: 'Farm Test Solutions' },
  ];

  useEffect(() => {
    loadSoilData();
  }, []);

  const loadSoilData = async () => {
    // Mock data - in real app, this would fetch from API
    const mockTests: SoilTest[] = [
      {
        id: 1,
        fieldId: 1,
        fieldName: 'Field A - North',
        testDate: '2024-03-15',
        labName: 'AgriLab Services',
        reportUrl: '/reports/soil-test-1.pdf',
        results: {
          ph: 6.5,
          organicMatter: 3.2,
          nitrogen: 45,
          phosphorus: 28,
          potassium: 180,
          calcium: 1200,
          magnesium: 150,
          sulfur: 12,
          zinc: 2.1,
          iron: 15,
          manganese: 8,
          copper: 1.2,
          boron: 0.8,
          cec: 18.5,
          texture: 'Clay Loam',
          salinity: 0.3,
        },
        recommendations: [
          'Apply lime to raise pH to 6.8-7.0',
          'Increase organic matter through compost application',
          'Phosphorus levels are adequate',
          'Potassium levels are good for most crops',
        ],
        status: 'completed',
        createdAt: '2024-03-10',
        updatedAt: '2024-03-15',
      },
    ];

    const mockPlans: FertilizationPlan[] = [
      {
        id: 1,
        fieldId: 1,
        fieldName: 'Field A - North',
        soilTestId: 1,
        targetNutrients: {
          nitrogen: 120,
          phosphorus: 30,
          potassium: 200,
        },
        recommendations: [
          {
            id: 1,
            productName: 'Organic Compost',
            productType: 'organic',
            npkRatio: '3-2-1',
            rate: 2000,
            unit: 'kg/ha',
            cost: 150,
            applicationMethod: 'Broadcast',
            timing: 'Pre-planting',
            notes: 'Apply 2 weeks before planting',
          },
          {
            id: 2,
            productName: 'NPK Fertilizer',
            productType: 'synthetic',
            npkRatio: '20-10-10',
            rate: 300,
            unit: 'kg/ha',
            cost: 180,
            applicationMethod: 'Side-dress',
            timing: 'At planting',
            notes: 'Apply in bands 5cm from seed row',
          },
        ],
        totalCost: 330,
        applicationSchedule: [
          {
            id: 1,
            date: '2024-04-01',
            productName: 'Organic Compost',
            rate: 2000,
            unit: 'kg/ha',
            method: 'Broadcast',
            isCompleted: false,
          },
          {
            id: 2,
            date: '2024-04-15',
            productName: 'NPK Fertilizer',
            rate: 300,
            unit: 'kg/ha',
            method: 'Side-dress',
            isCompleted: false,
          },
        ],
        status: 'approved',
        createdAt: '2024-03-16',
        updatedAt: '2024-03-16',
      },
    ];

    setSoilTests(mockTests);
    setFertilizationPlans(mockPlans);
    if (onDataChange) {
      onDataChange({ soilTests: mockTests, fertilizationPlans: mockPlans });
    }
  };

  const handleAddTest = () => {
    setTestFormData({
      fieldId: '',
      testDate: '',
      labName: '',
      ph: '',
      organicMatter: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      calcium: '',
      magnesium: '',
      sulfur: '',
    });
    setSelectedTest(null);
    setShowTestModal(true);
  };

  const handleSaveTest = () => {
    if (!testFormData.fieldId || !testFormData.testDate || !testFormData.labName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const field = fields.find(f => f.id.toString() === testFormData.fieldId);
    if (!field) return;

    const newTest: SoilTest = {
      id: selectedTest?.id || Date.now(),
      fieldId: parseInt(testFormData.fieldId),
      fieldName: field.name,
      testDate: testFormData.testDate,
      labName: testFormData.labName,
      results: {
        ph: parseFloat(testFormData.ph) || 0,
        organicMatter: parseFloat(testFormData.organicMatter) || 0,
        nitrogen: parseFloat(testFormData.nitrogen) || 0,
        phosphorus: parseFloat(testFormData.phosphorus) || 0,
        potassium: parseFloat(testFormData.potassium) || 0,
        calcium: parseFloat(testFormData.calcium) || 0,
        magnesium: parseFloat(testFormData.magnesium) || 0,
        sulfur: parseFloat(testFormData.sulfur) || 0,
        zinc: 0,
        iron: 0,
        manganese: 0,
        copper: 0,
        boron: 0,
        cec: 0,
        texture: '',
        salinity: 0,
      },
      recommendations: [],
      status: 'completed',
      createdAt: selectedTest?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedTest) {
      setSoilTests(prev => prev.map(t => t.id === selectedTest.id ? newTest : t));
    } else {
      setSoilTests(prev => [...prev, newTest]);
    }

    setShowTestModal(false);
    Alert.alert('Success', 'Soil test saved successfully');
  };

  const generateFertilizationPlan = (test: SoilTest) => {
    // Mock AI-generated fertilization plan
    const plan: FertilizationPlan = {
      id: Date.now(),
      fieldId: test.fieldId,
      fieldName: test.fieldName,
      soilTestId: test.id,
      targetNutrients: {
        nitrogen: 120,
        phosphorus: 30,
        potassium: 200,
      },
      recommendations: [
        {
          id: 1,
          productName: 'Organic Compost',
          productType: 'organic',
          npkRatio: '3-2-1',
          rate: 2000,
          unit: 'kg/ha',
          cost: 150,
          applicationMethod: 'Broadcast',
          timing: 'Pre-planting',
          notes: 'Apply 2 weeks before planting',
        },
      ],
      totalCost: 150,
      applicationSchedule: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFertilizationPlans(prev => [...prev, plan]);
    Alert.alert('Success', 'Fertilization plan generated successfully');
  };

  const renderSoilTestCard = (test: SoilTest) => (
    <Card key={test.id} style={styles.testCard}>
      <View style={styles.testHeader}>
        <View style={styles.testInfo}>
          <Text style={styles.testField}>
            <MapPin size={14} color={theme.colors.neutral[500]} />
            {test.fieldName}
          </Text>
          <Text style={styles.testDate}>
            <Calendar size={14} color={theme.colors.neutral[500]} />
            {test.testDate}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getTestStatusColor(test.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getTestStatusColor(test.status) }]}>
            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.testResults}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>pH:</Text>
          <Text style={[styles.resultValue, { color: getpHColor(test.results.ph) }]}>
            {test.results.ph.toFixed(1)}
          </Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Organic Matter:</Text>
          <Text style={styles.resultValue}>{test.results.organicMatter.toFixed(1)}%</Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>N-P-K:</Text>
          <Text style={styles.resultValue}>
            {test.results.nitrogen}-{test.results.phosphorus}-{test.results.potassium}
          </Text>
        </View>
      </View>

      <View style={styles.testFooter}>
        <Button
          title="View Details"
          onPress={() => {
            setSelectedTest(test);
            setShowResultsModal(true);
          }}
          variant="outline"
          size="sm"
        />
        <Button
          title="Generate Plan"
          onPress={() => generateFertilizationPlan(test)}
          variant="ghost"
          size="sm"
          icon={<TestTube size={16} color={theme.colors.primary[500]} />}
        />
      </View>
    </Card>
  );

  const renderFertilizationPlanCard = (plan: FertilizationPlan) => (
    <Card key={plan.id} style={styles.planCard}>
      <View style={styles.planHeader}>
        <View style={styles.planInfo}>
          <Text style={styles.planField}>
            <MapPin size={14} color={theme.colors.neutral[500]} />
            {plan.fieldName}
          </Text>
          <Text style={styles.planCost}>Total Cost: ${plan.totalCost}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getPlanStatusColor(plan.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getPlanStatusColor(plan.status) }]}>
            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.planNutrients}>
        <Text style={styles.sectionTitle}>Target Nutrients (kg/ha):</Text>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>N: {plan.targetNutrients.nitrogen}</Text>
          <Text style={styles.nutrientLabel}>P: {plan.targetNutrients.phosphorus}</Text>
          <Text style={styles.nutrientLabel}>K: {plan.targetNutrients.potassium}</Text>
        </View>
      </View>

      <View style={styles.planFooter}>
        <Button
          title="View Plan"
          onPress={() => {
            setSelectedPlan(plan);
            setShowPlanModal(true);
          }}
          variant="outline"
          size="sm"
        />
        <Button
          title="Schedule"
          onPress={() => {
            // Navigate to scheduling interface
            Alert.alert('Info', 'Schedule fertilization applications');
          }}
          variant="ghost"
          size="sm"
          icon={<Calendar size={16} color={theme.colors.primary[500]} />}
        />
      </View>
    </Card>
  );

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return theme.colors.success[500];
      case 'pending': return theme.colors.warning[500];
      case 'expired': return theme.colors.error[500];
      default: return theme.colors.neutral[500];
    }
  };

  const getPlanStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return theme.colors.success[500];
      case 'active': return theme.colors.primary[500];
      case 'completed': return theme.colors.neutral[500];
      case 'draft': return theme.colors.warning[500];
      default: return theme.colors.neutral[500];
    }
  };

  const getpHColor = (ph: number) => {
    if (ph < 6.0) return theme.colors.error[500];
    if (ph > 7.5) return theme.colors.warning[500];
    return theme.colors.success[500];
  };

  const renderTabButton = (tab: string, title: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Soil Health Management</Text>
        <Button
          title="New Test"
          onPress={handleAddTest}
          icon={<Plus size={16} color={theme.colors.neutral[50]} />}
        />
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('tests', 'Soil Tests')}
        {renderTabButton('plans', 'Fertilization Plans')}
        {renderTabButton('trends', 'Trends')}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'tests' && (
          <>
            {soilTests.length === 0 ? (
              <Card style={styles.emptyState}>
                <TestTube size={48} color={theme.colors.neutral[400]} />
                <Text style={styles.emptyStateText}>No soil tests yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your first soil test to get started</Text>
                <Button
                  title="Add Test"
                  onPress={handleAddTest}
                  style={styles.emptyStateButton}
                />
              </Card>
            ) : (
              soilTests.map(renderSoilTestCard)
            )}
          </>
        )}

        {activeTab === 'plans' && (
          <>
            {fertilizationPlans.length === 0 ? (
              <Card style={styles.emptyState}>
                <FileText size={48} color={theme.colors.neutral[400]} />
                <Text style={styles.emptyStateText}>No fertilization plans yet</Text>
                <Text style={styles.emptyStateSubtext}>Generate plans from soil test results</Text>
              </Card>
            ) : (
              fertilizationPlans.map(renderFertilizationPlanCard)
            )}
          </>
        )}

        {activeTab === 'trends' && (
          <Card style={styles.trendsCard}>
            <View style={styles.trendsHeader}>
              <TrendingUp size={24} color={theme.colors.primary[500]} />
              <Text style={styles.trendsTitle}>Soil Health Trends</Text>
            </View>
            <Text style={styles.trendsSubtext}>
              Track nutrient levels and soil health metrics over time
            </Text>
            <View style={styles.chartPlaceholder}>
              <TrendingUp size={48} color={theme.colors.neutral[400]} />
              <Text style={styles.chartPlaceholderText}>Soil Health Chart</Text>
              <Text style={styles.chartPlaceholderSubtext}>
                Historical data will be displayed here
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Add/Edit Test Modal */}
      <Modal visible={showTestModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedTest ? 'Edit Soil Test' : 'Add Soil Test'}
            </Text>
            <TouchableOpacity onPress={() => setShowTestModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Dropdown
              label="Field"
              value={testFormData.fieldId}
              onValueChange={(value) => setTestFormData(prev => ({ ...prev, fieldId: value }))}
              options={fields.map(f => ({ label: f.name, value: f.id.toString() }))}
              placeholder="Select field"
              required
            />

            <FormField
              label="Test Date"
              value={testFormData.testDate}
              onChangeText={(text) => setTestFormData(prev => ({ ...prev, testDate: text }))}
              placeholder="YYYY-MM-DD"
              required
            />

            <Dropdown
              label="Laboratory"
              value={testFormData.labName}
              onValueChange={(value) => setTestFormData(prev => ({ ...prev, labName: value }))}
              options={labs.map(l => ({ label: l.name, value: l.name }))}
              placeholder="Select laboratory"
              required
            />

            <Text style={styles.sectionTitle}>Test Results</Text>

            <FormField
              label="pH"
              value={testFormData.ph}
              onChangeText={(text) => setTestFormData(prev => ({ ...prev, ph: text }))}
              placeholder="6.5"
              keyboardType="numeric"
            />

            <FormField
              label="Organic Matter (%)"
              value={testFormData.organicMatter}
              onChangeText={(text) => setTestFormData(prev => ({ ...prev, organicMatter: text }))}
              placeholder="3.2"
              keyboardType="numeric"
            />

            <FormField
              label="Nitrogen (ppm)"
              value={testFormData.nitrogen}
              onChangeText={(text) => setTestFormData(prev => ({ ...prev, nitrogen: text }))}
              placeholder="45"
              keyboardType="numeric"
            />

            <FormField
              label="Phosphorus (ppm)"
              value={testFormData.phosphorus}
              onChangeText={(text) => setTestFormData(prev => ({ ...prev, phosphorus: text }))}
              placeholder="28"
              keyboardType="numeric"
            />

            <FormField
              label="Potassium (ppm)"
              value={testFormData.potassium}
              onChangeText={(text) => setTestFormData(prev => ({ ...prev, potassium: text }))}
              placeholder="180"
              keyboardType="numeric"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowTestModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Save Test"
              onPress={handleSaveTest}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Soil Test Results Modal */}
      <Modal visible={showResultsModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Soil Test Results</Text>
            <TouchableOpacity onPress={() => setShowResultsModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          {selectedTest && (
            <ScrollView style={styles.modalContent}>
              <Card style={styles.resultsCard}>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>
                    {selectedTest.fieldName} - {selectedTest.testDate}
                  </Text>
                  <Text style={styles.resultsLab}>Lab: {selectedTest.labName}</Text>
                </View>

                <View style={styles.resultsGrid}>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>pH</Text>
                    <Text style={[styles.resultValue, { color: getpHColor(selectedTest.results.ph) }]}>
                      {selectedTest.results.ph.toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Organic Matter</Text>
                    <Text style={styles.resultValue}>{selectedTest.results.organicMatter.toFixed(1)}%</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Nitrogen</Text>
                    <Text style={styles.resultValue}>{selectedTest.results.nitrogen} ppm</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Phosphorus</Text>
                    <Text style={styles.resultValue}>{selectedTest.results.phosphorus} ppm</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Potassium</Text>
                    <Text style={styles.resultValue}>{selectedTest.results.potassium} ppm</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Calcium</Text>
                    <Text style={styles.resultValue}>{selectedTest.results.calcium} ppm</Text>
                  </View>
                </View>

                <View style={styles.recommendationsSection}>
                  <Text style={styles.sectionTitle}>Recommendations:</Text>
                  {selectedTest.recommendations.map((rec, index) => (
                    <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
                  ))}
                </View>

                {selectedTest.reportUrl && (
                  <Button
                    title="Download Report"
                    onPress={() => Alert.alert('Info', 'Download soil test report')}
                    variant="outline"
                    icon={<Download size={16} color={theme.colors.primary[500]} />}
                  />
                )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: theme.colors.primary[500],
  },
  tabText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  tabTextActive: {
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
    padding: theme.spacing[4],
  },
  testCard: {
    marginBottom: theme.spacing[4],
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  testInfo: {
    flex: 1,
  },
  testField: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  testDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
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
  testResults: {
    marginBottom: theme.spacing[3],
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  resultLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  resultValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  testFooter: {
    flexDirection: 'row',
    gap: theme.spacing[2],
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
  planField: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  planCost: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  planNutrients: {
    marginBottom: theme.spacing[3],
  },
  nutrientRow: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  nutrientLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  planFooter: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  trendsCard: {
    marginBottom: theme.spacing[4],
  },
  trendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  trendsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing[2],
  },
  trendsSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[4],
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.radii.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing[2],
  },
  chartPlaceholderSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing[1],
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
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
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
  resultsCard: {
    marginBottom: theme.spacing[4],
  },
  resultsHeader: {
    marginBottom: theme.spacing[4],
  },
  resultsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  resultsLab: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  resultItem: {
    width: '48%',
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
    alignItems: 'center',
  },
  recommendationsSection: {
    marginBottom: theme.spacing[4],
  },
  recommendationItem: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
});