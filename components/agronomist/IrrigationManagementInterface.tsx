import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Droplets, Thermometer, Cloud, Calendar, Clock, TrendingUp, MapPin, Plus, Play, Pause, X } from 'lucide-react-native';
import { theme } from '@/components/designSystem';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface IrrigationSchedule {
  id: number;
  fieldId: number;
  fieldName: string;
  scheduledDate: string;
  startTime: string;
  duration: number; // minutes
  waterAmount: number; // liters
  method: 'sprinkler' | 'drip' | 'flood' | 'center-pivot';
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  sensorThreshold?: number;
  autoTrigger: boolean;
  weatherDependent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SoilMoistureData {
  id: number;
  fieldId: number;
  fieldName: string;
  sensorId: string;
  timestamp: string;
  moistureLevel: number; // percentage
  temperature: number; // celsius
  depth: number; // cm
  location: {
    lat: number;
    lng: number;
  };
}

interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  conditions: string;
}

interface WaterBalance {
  fieldId: number;
  fieldName: string;
  totalWaterApplied: number; // liters
  cropWaterRequirement: number; // liters
  waterDeficit: number; // liters
  waterUseEfficiency: number; // percentage
  stressPrevention: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

interface IrrigationManagementInterfaceProps {
  onDataChange?: (data: { schedules: IrrigationSchedule[]; soilMoisture: SoilMoistureData[] }) => void;
}

export default function IrrigationManagementInterface({ onDataChange }: IrrigationManagementInterfaceProps) {
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([]);
  const [soilMoistureData, setSoilMoistureData] = useState<SoilMoistureData[]>([]);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);
  const [waterBalance, setWaterBalance] = useState<WaterBalance[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<IrrigationSchedule | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showWaterBalanceModal, setShowWaterBalanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedules' | 'monitoring' | 'analytics'>('dashboard');
  const [scheduleFormData, setScheduleFormData] = useState({
    fieldId: '',
    scheduledDate: '',
    startTime: '',
    duration: '',
    waterAmount: '',
    method: '',
    priority: 'medium',
    autoTrigger: false,
    weatherDependent: true,
    sensorThreshold: '',
  });

  // Mock data for fields
  const fields = [
    { id: 1, name: 'Field A - North', area: 25.5, cropType: 'Corn' },
    { id: 2, name: 'Field B - South', area: 18.2, cropType: 'Wheat' },
    { id: 3, name: 'Field C - East', area: 32.1, cropType: 'Soybeans' },
  ];

  const irrigationMethods = [
    { label: 'Sprinkler', value: 'sprinkler' },
    { label: 'Drip', value: 'drip' },
    { label: 'Flood', value: 'flood' },
    { label: 'Center Pivot', value: 'center-pivot' },
  ];

  useEffect(() => {
    loadIrrigationData();
    // Set up real-time updates
    const interval = setInterval(loadSoilMoistureData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadIrrigationData = async () => {
    await Promise.all([
      loadSchedules(),
      loadSoilMoistureData(),
      loadWeatherForecast(),
      loadWaterBalance(),
    ]);
  };

  const loadSchedules = async () => {
    // Mock data - in real app, this would fetch from API
    const mockSchedules: IrrigationSchedule[] = [
      {
        id: 1,
        fieldId: 1,
        fieldName: 'Field A - North',
        scheduledDate: '2024-03-20',
        startTime: '06:00',
        duration: 120,
        waterAmount: 5000,
        method: 'sprinkler',
        priority: 'high',
        status: 'scheduled',
        sensorThreshold: 30,
        autoTrigger: true,
        weatherDependent: true,
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
      },
      {
        id: 2,
        fieldId: 2,
        fieldName: 'Field B - South',
        scheduledDate: '2024-03-21',
        startTime: '05:30',
        duration: 90,
        waterAmount: 3500,
        method: 'drip',
        priority: 'medium',
        status: 'active',
        sensorThreshold: 25,
        autoTrigger: false,
        weatherDependent: true,
        createdAt: '2024-03-16',
        updatedAt: '2024-03-16',
      },
    ];
    setSchedules(mockSchedules);
  };

  const loadSoilMoistureData = async () => {
    // Mock real-time soil moisture data
    const mockData: SoilMoistureData[] = [
      {
        id: 1,
        fieldId: 1,
        fieldName: 'Field A - North',
        sensorId: 'SM001',
        timestamp: new Date().toISOString(),
        moistureLevel: 28,
        temperature: 22.5,
        depth: 20,
        location: { lat: 40.7128, lng: -74.0060 },
      },
      {
        id: 2,
        fieldId: 2,
        fieldName: 'Field B - South',
        sensorId: 'SM002',
        timestamp: new Date().toISOString(),
        moistureLevel: 35,
        temperature: 24.1,
        depth: 15,
        location: { lat: 40.7130, lng: -74.0065 },
      },
      {
        id: 3,
        fieldId: 3,
        fieldName: 'Field C - East',
        sensorId: 'SM003',
        timestamp: new Date().toISOString(),
        moistureLevel: 42,
        temperature: 23.8,
        depth: 25,
        location: { lat: 40.7125, lng: -74.0055 },
      },
    ];
    setSoilMoistureData(mockData);
  };

  const loadWeatherForecast = async () => {
    // Mock weather forecast data
    const mockForecast: WeatherForecast[] = [
      {
        date: '2024-03-20',
        temperature: { min: 18, max: 28 },
        humidity: 65,
        precipitation: 0,
        precipitationProbability: 10,
        windSpeed: 12,
        conditions: 'Sunny',
      },
      {
        date: '2024-03-21',
        temperature: { min: 20, max: 30 },
        humidity: 70,
        precipitation: 2.5,
        precipitationProbability: 60,
        windSpeed: 15,
        conditions: 'Light Rain',
      },
      {
        date: '2024-03-22',
        temperature: { min: 16, max: 24 },
        humidity: 80,
        precipitation: 8.2,
        precipitationProbability: 90,
        windSpeed: 20,
        conditions: 'Heavy Rain',
      },
    ];
    setWeatherForecast(mockForecast);
  };

  const loadWaterBalance = async () => {
    // Mock water balance data
    const mockBalance: WaterBalance[] = [
      {
        fieldId: 1,
        fieldName: 'Field A - North',
        totalWaterApplied: 15000,
        cropWaterRequirement: 18000,
        waterDeficit: 3000,
        waterUseEfficiency: 85,
        stressPrevention: 'medium',
        lastUpdated: new Date().toISOString(),
      },
      {
        fieldId: 2,
        fieldName: 'Field B - South',
        totalWaterApplied: 12000,
        cropWaterRequirement: 14000,
        waterDeficit: 2000,
        waterUseEfficiency: 92,
        stressPrevention: 'high',
        lastUpdated: new Date().toISOString(),
      },
    ];
    setWaterBalance(mockBalance);
  };

  const handleCreateSchedule = () => {
    setScheduleFormData({
      fieldId: '',
      scheduledDate: '',
      startTime: '',
      duration: '',
      waterAmount: '',
      method: '',
      priority: 'medium',
      autoTrigger: false,
      weatherDependent: true,
      sensorThreshold: '',
    });
    setSelectedSchedule(null);
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    if (!scheduleFormData.fieldId || !scheduleFormData.scheduledDate || !scheduleFormData.startTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const field = fields.find(f => f.id.toString() === scheduleFormData.fieldId);
    if (!field) return;

    const newSchedule: IrrigationSchedule = {
      id: selectedSchedule?.id || Date.now(),
      fieldId: parseInt(scheduleFormData.fieldId),
      fieldName: field.name,
      scheduledDate: scheduleFormData.scheduledDate,
      startTime: scheduleFormData.startTime,
      duration: parseInt(scheduleFormData.duration) || 60,
      waterAmount: parseInt(scheduleFormData.waterAmount) || 1000,
      method: scheduleFormData.method as any,
      priority: scheduleFormData.priority as any,
      status: 'scheduled',
      sensorThreshold: parseInt(scheduleFormData.sensorThreshold) || undefined,
      autoTrigger: scheduleFormData.autoTrigger,
      weatherDependent: scheduleFormData.weatherDependent,
      createdAt: selectedSchedule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedSchedule) {
      setSchedules(prev => prev.map(s => s.id === selectedSchedule.id ? newSchedule : s));
    } else {
      setSchedules(prev => [...prev, newSchedule]);
    }

    setShowScheduleModal(false);
    Alert.alert('Success', 'Irrigation schedule saved successfully');
  };

  const handleStartIrrigation = (schedule: IrrigationSchedule) => {
    Alert.alert(
      'Start Irrigation',
      `Start irrigation for ${schedule.fieldName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            setSchedules(prev => prev.map(s => 
              s.id === schedule.id ? { ...s, status: 'active' } : s
            ));
            Alert.alert('Success', 'Irrigation started');
          },
        },
      ]
    );
  };

  const handleStopIrrigation = (schedule: IrrigationSchedule) => {
    Alert.alert(
      'Stop Irrigation',
      `Stop irrigation for ${schedule.fieldName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          onPress: () => {
            setSchedules(prev => prev.map(s => 
              s.id === schedule.id ? { ...s, status: 'completed' } : s
            ));
            Alert.alert('Success', 'Irrigation stopped');
          },
        },
      ]
    );
  };

  const getMoistureColor = (level: number) => {
    if (level < 25) return theme.colors.error[500];
    if (level < 40) return theme.colors.warning[500];
    return theme.colors.success[500];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success[500];
      case 'scheduled': return theme.colors.primary[500];
      case 'completed': return theme.colors.neutral[500];
      case 'cancelled': return theme.colors.error[500];
      default: return theme.colors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error[500];
      case 'medium': return theme.colors.warning[500];
      case 'low': return theme.colors.success[500];
      default: return theme.colors.neutral[500];
    }
  };

  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Current Conditions */}
      <Card style={styles.dashboardCard}>
        <Text style={styles.sectionTitle}>Current Conditions</Text>
        <View style={styles.conditionsGrid}>
          {soilMoistureData.map(data => (
            <View key={data.id} style={styles.conditionCard}>
              <View style={styles.conditionHeader}>
                <Text style={styles.conditionField}>{data.fieldName}</Text>
                <View style={[styles.moistureIndicator, { backgroundColor: getMoistureColor(data.moistureLevel) }]} />
              </View>
              <View style={styles.conditionMetrics}>
                <View style={styles.metricItem}>
                  <Droplets size={16} color={theme.colors.primary[500]} />
                  <Text style={styles.metricValue}>{data.moistureLevel}%</Text>
                </View>
                <View style={styles.metricItem}>
                  <Thermometer size={16} color={theme.colors.warning[500]} />
                  <Text style={styles.metricValue}>{data.temperature}°C</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Weather Forecast */}
      <Card style={styles.dashboardCard}>
        <Text style={styles.sectionTitle}>Weather Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.weatherContainer}>
            {weatherForecast.map((forecast, index) => (
              <View key={index} style={styles.weatherCard}>
                <Text style={styles.weatherDate}>{forecast.date}</Text>
                <Cloud size={32} color={theme.colors.primary[500]} />
                <Text style={styles.weatherTemp}>
                  {forecast.temperature.min}°-{forecast.temperature.max}°
                </Text>
                <Text style={styles.weatherCondition}>{forecast.conditions}</Text>
                <Text style={styles.weatherRain}>
                  {forecast.precipitation}mm ({forecast.precipitationProbability}%)
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Card>

      {/* Active Schedules */}
      <Card style={styles.dashboardCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Irrigation</Text>
          <Button
            title="View All"
            onPress={() => setActiveTab('schedules')}
            variant="ghost"
            size="sm"
          />
        </View>
        {schedules.filter(s => s.status === 'active').length === 0 ? (
          <Text style={styles.emptyText}>No active irrigation</Text>
        ) : (
          schedules.filter(s => s.status === 'active').map(schedule => (
            <View key={schedule.id} style={styles.activeScheduleCard}>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleName}>{schedule.fieldName}</Text>
                <Text style={styles.scheduleDetails}>
                  {schedule.method} • {schedule.duration} min • {schedule.waterAmount}L
                </Text>
              </View>
              <Button
                title="Stop"
                onPress={() => handleStopIrrigation(schedule)}
                variant="danger"
                size="sm"
                icon={<Pause size={16} color={theme.colors.neutral[50]} />}
              />
            </View>
          ))
        )}
      </Card>

      {/* Water Balance Summary */}
      <Card style={styles.dashboardCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Water Balance</Text>
          <Button
            title="Details"
            onPress={() => setShowWaterBalanceModal(true)}
            variant="ghost"
            size="sm"
          />
        </View>
        <View style={styles.balanceGrid}>
          {waterBalance.map(balance => (
            <View key={balance.fieldId} style={styles.balanceCard}>
              <Text style={styles.balanceField}>{balance.fieldName}</Text>
              <View style={styles.balanceMetrics}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Efficiency</Text>
                  <Text style={styles.balanceValue}>{balance.waterUseEfficiency}%</Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Deficit</Text>
                  <Text style={[styles.balanceValue, { color: theme.colors.error[500] }]}>
                    {balance.waterDeficit}L
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );

  const renderScheduleCard = (schedule: IrrigationSchedule) => (
    <Card key={schedule.id} style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleName}>{schedule.fieldName}</Text>
          <Text style={styles.scheduleDate}>
            <Calendar size={14} color={theme.colors.neutral[500]} />
            {schedule.scheduledDate} at {schedule.startTime}
          </Text>
        </View>
        <View style={styles.scheduleStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(schedule.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(schedule.status) }]}>
              {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(schedule.priority) + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(schedule.priority) }]}>
              {schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.scheduleDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Method:</Text>
          <Text style={styles.detailValue}>{schedule.method}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{schedule.duration} minutes</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Water Amount:</Text>
          <Text style={styles.detailValue}>{schedule.waterAmount} liters</Text>
        </View>
        {schedule.sensorThreshold && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trigger Threshold:</Text>
            <Text style={styles.detailValue}>{schedule.sensorThreshold}%</Text>
          </View>
        )}
      </View>

      <View style={styles.scheduleFooter}>
        {schedule.status === 'scheduled' && (
          <Button
            title="Start Now"
            onPress={() => handleStartIrrigation(schedule)}
            variant="primary"
            size="sm"
            icon={<Play size={16} color={theme.colors.neutral[50]} />}
          />
        )}
        {schedule.status === 'active' && (
          <Button
            title="Stop"
            onPress={() => handleStopIrrigation(schedule)}
            variant="danger"
            size="sm"
            icon={<Pause size={16} color={theme.colors.neutral[50]} />}
          />
        )}
        <Button
          title="Edit"
          onPress={() => {
            setSelectedSchedule(schedule);
            setScheduleFormData({
              fieldId: schedule.fieldId.toString(),
              scheduledDate: schedule.scheduledDate,
              startTime: schedule.startTime,
              duration: schedule.duration.toString(),
              waterAmount: schedule.waterAmount.toString(),
              method: schedule.method,
              priority: schedule.priority,
              autoTrigger: schedule.autoTrigger,
              weatherDependent: schedule.weatherDependent,
              sensorThreshold: schedule.sensorThreshold?.toString() || '',
            });
            setShowScheduleModal(true);
          }}
          variant="outline"
          size="sm"
        />
      </View>
    </Card>
  );

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
        <Text style={styles.title}>Irrigation Management</Text>
        <Button
          title="New Schedule"
          onPress={handleCreateSchedule}
          icon={<Plus size={16} color={theme.colors.neutral[50]} />}
        />
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('dashboard', 'Dashboard')}
        {renderTabButton('schedules', 'Schedules')}
        {renderTabButton('monitoring', 'Monitoring')}
        {renderTabButton('analytics', 'Analytics')}
      </View>

      <View style={styles.content}>
        {activeTab === 'dashboard' && renderDashboard()}
        
        {activeTab === 'schedules' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {schedules.length === 0 ? (
              <Card style={styles.emptyState}>
                <Droplets size={48} color={theme.colors.neutral[400]} />
                <Text style={styles.emptyStateText}>No irrigation schedules yet</Text>
                <Text style={styles.emptyStateSubtext}>Create your first irrigation schedule</Text>
                <Button
                  title="Create Schedule"
                  onPress={handleCreateSchedule}
                  style={styles.emptyStateButton}
                />
              </Card>
            ) : (
              schedules.map(renderScheduleCard)
            )}
          </ScrollView>
        )}

        {activeTab === 'monitoring' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card style={styles.monitoringCard}>
              <Text style={styles.sectionTitle}>Real-time Soil Moisture</Text>
              {soilMoistureData.map(data => (
                <View key={data.id} style={styles.sensorCard}>
                  <View style={styles.sensorHeader}>
                    <Text style={styles.sensorField}>{data.fieldName}</Text>
                    <Text style={styles.sensorId}>Sensor: {data.sensorId}</Text>
                  </View>
                  <View style={styles.sensorMetrics}>
                    <View style={styles.sensorMetric}>
                      <Text style={styles.metricLabel}>Moisture Level</Text>
                      <Text style={[styles.metricValue, { color: getMoistureColor(data.moistureLevel) }]}>
                        {data.moistureLevel}%
                      </Text>
                    </View>
                    <View style={styles.sensorMetric}>
                      <Text style={styles.metricLabel}>Temperature</Text>
                      <Text style={styles.metricValue}>{data.temperature}°C</Text>
                    </View>
                    <View style={styles.sensorMetric}>
                      <Text style={styles.metricLabel}>Depth</Text>
                      <Text style={styles.metricValue}>{data.depth}cm</Text>
                    </View>
                  </View>
                  <Text style={styles.sensorTimestamp}>
                    Last updated: {new Date(data.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </Card>
          </ScrollView>
        )}

        {activeTab === 'analytics' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card style={styles.analyticsCard}>
              <View style={styles.analyticsHeader}>
                <TrendingUp size={24} color={theme.colors.primary[500]} />
                <Text style={styles.analyticsTitle}>Irrigation Analytics</Text>
              </View>
              <Text style={styles.analyticsSubtext}>
                Track water usage, efficiency, and crop response over time
              </Text>
              <View style={styles.chartPlaceholder}>
                <TrendingUp size={48} color={theme.colors.neutral[400]} />
                <Text style={styles.chartPlaceholderText}>Water Usage Chart</Text>
                <Text style={styles.chartPlaceholderSubtext}>
                  Historical irrigation data will be displayed here
                </Text>
              </View>
            </Card>
          </ScrollView>
        )}
      </View>

      {/* Create/Edit Schedule Modal */}
      <Modal visible={showScheduleModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedSchedule ? 'Edit Schedule' : 'Create Schedule'}
            </Text>
            <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Dropdown
              label="Field"
              value={scheduleFormData.fieldId}
              onValueChange={(value) => setScheduleFormData(prev => ({ ...prev, fieldId: value }))}
              options={fields.map(f => ({ label: f.name, value: f.id.toString() }))}
              placeholder="Select field"
              required
            />

            <FormField
              label="Scheduled Date"
              value={scheduleFormData.scheduledDate}
              onChangeText={(text) => setScheduleFormData(prev => ({ ...prev, scheduledDate: text }))}
              placeholder="YYYY-MM-DD"
              required
            />

            <FormField
              label="Start Time"
              value={scheduleFormData.startTime}
              onChangeText={(text) => setScheduleFormData(prev => ({ ...prev, startTime: text }))}
              placeholder="HH:MM"
              required
            />

            <FormField
              label="Duration (minutes)"
              value={scheduleFormData.duration}
              onChangeText={(text) => setScheduleFormData(prev => ({ ...prev, duration: text }))}
              placeholder="60"
              keyboardType="numeric"
            />

            <FormField
              label="Water Amount (liters)"
              value={scheduleFormData.waterAmount}
              onChangeText={(text) => setScheduleFormData(prev => ({ ...prev, waterAmount: text }))}
              placeholder="1000"
              keyboardType="numeric"
            />

            <Dropdown
              label="Irrigation Method"
              value={scheduleFormData.method}
              onValueChange={(value) => setScheduleFormData(prev => ({ ...prev, method: value }))}
              options={irrigationMethods}
              placeholder="Select method"
            />

            <Dropdown
              label="Priority"
              value={scheduleFormData.priority}
              onValueChange={(value) => setScheduleFormData(prev => ({ ...prev, priority: value }))}
              options={[
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' },
              ]}
            />

            <FormField
              label="Sensor Threshold (%)"
              value={scheduleFormData.sensorThreshold}
              onChangeText={(text) => setScheduleFormData(prev => ({ ...prev, sensorThreshold: text }))}
              placeholder="30"
              keyboardType="numeric"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowScheduleModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Save Schedule"
              onPress={handleSaveSchedule}
              style={styles.modalButton}
            />
          </View>
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
  dashboardCard: {
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  conditionCard: {
    width: '48%',
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  conditionField: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  moistureIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  conditionMetrics: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  metricValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  weatherContainer: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[1],
  },
  weatherCard: {
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
    alignItems: 'center',
    minWidth: 120,
  },
  weatherDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  weatherTemp: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginTop: theme.spacing[1],
  },
  weatherCondition: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing[1],
  },
  weatherRain: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary[500],
    marginTop: theme.spacing[1],
  },
  activeScheduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing[2],
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  scheduleDetails: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  scheduleDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  balanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  balanceCard: {
    width: '48%',
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
  },
  balanceField: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  balanceMetrics: {
    gap: theme.spacing[2],
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[600],
  },
  balanceValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scheduleCard: {
    marginBottom: theme.spacing[4],
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  scheduleStatus: {
    alignItems: 'flex-end',
    gap: theme.spacing[1],
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
  priorityBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
  },
  priorityText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  scheduleFooter: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    marginTop: theme.spacing[3],
  },
  monitoringCard: {
    marginBottom: theme.spacing[4],
  },
  sensorCard: {
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing[3],
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  sensorField: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  sensorId: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
  },
  sensorMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  sensorMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  sensorTimestamp: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  analyticsCard: {
    marginBottom: theme.spacing[4],
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  analyticsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing[2],
  },
  analyticsSubtext: {
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
});