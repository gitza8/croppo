import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Wrench, AlertTriangle, Clock, DollarSign, Calendar, Plus, Settings, BarChart3, TrendingUp, X } from 'lucide-react-native';
import { theme } from '@/components/designSystem';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface Equipment {
  id: number;
  name: string;
  type: 'tractor' | 'harvester' | 'planter' | 'sprayer' | 'cultivator' | 'other';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  status: 'active' | 'maintenance' | 'repair' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  operatingHours: number;
  fuelType?: string;
  fuelConsumption?: number; // per hour
  specifications: { [key: string]: string };
  warranty: {
    provider: string;
    expiryDate: string;
    coverage: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverage: number;
  };
  documents: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  equipmentName: string;
  type: 'routine' | 'repair' | 'inspection' | 'overhaul';
  description: string;
  date: string;
  operatingHours: number;
  cost: number;
  laborHours: number;
  parts: MaintenancePart[];
  technician: string;
  vendor?: string;
  invoiceNumber?: string;
  nextMaintenanceDate?: string;
  nextMaintenanceHours?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface MaintenancePart {
  id: number;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
}

interface UsageRecord {
  id: number;
  equipmentId: number;
  equipmentName: string;
  operator: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  operatingHours: number;
  fieldId?: number;
  fieldName?: string;
  taskType: string;
  fuelUsed?: number;
  fuelCost?: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceSchedule {
  id: number;
  equipmentId: number;
  equipmentName: string;
  type: 'routine' | 'inspection' | 'overhaul';
  description: string;
  frequency: 'hours' | 'days' | 'months';
  interval: number;
  lastPerformed?: string;
  nextDue: string;
  isOverdue: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedCost: number;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
}

interface EquipmentManagementInterfaceProps {
  onDataChange?: (data: { equipment: Equipment[]; maintenance: MaintenanceRecord[] }) => void;
}

export default function EquipmentManagementInterface({ onDataChange }: EquipmentManagementInterfaceProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRecord | null>(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'equipment' | 'maintenance' | 'usage' | 'analytics'>('overview');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [equipmentFormData, setEquipmentFormData] = useState({
    name: '',
    type: 'tractor',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    location: '',
    fuelType: '',
    fuelConsumption: '',
    warrantyProvider: '',
    warrantyExpiry: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiry: '',
    insuranceCoverage: '',
    notes: '',
  });
  const [maintenanceFormData, setMaintenanceFormData] = useState({
    equipmentId: '',
    type: 'routine',
    description: '',
    date: '',
    cost: '',
    laborHours: '',
    technician: '',
    vendor: '',
    invoiceNumber: '',
    nextMaintenanceDate: '',
    nextMaintenanceHours: '',
    priority: 'medium',
    notes: '',
  });

  // Mock data for equipment types and fields
  const equipmentTypes = [
    { name: 'tractor', label: 'Tractor' },
    { name: 'harvester', label: 'Harvester' },
    { name: 'planter', label: 'Planter' },
    { name: 'sprayer', label: 'Sprayer' },
    { name: 'cultivator', label: 'Cultivator' },
    { name: 'other', label: 'Other' },
  ];

  const fields = [
    { id: 1, name: 'Field A - North', area: 25.5 },
    { id: 2, name: 'Field B - South', area: 18.2 },
    { id: 3, name: 'Field C - East', area: 32.1 },
  ];

  useEffect(() => {
    loadEquipmentData();
  }, []);

  const loadEquipmentData = async () => {
    await Promise.all([
      loadEquipment(),
      loadMaintenanceRecords(),
      loadUsageRecords(),
      loadMaintenanceSchedules(),
    ]);
  };

  const loadEquipment = async () => {
    // Mock data - in real app, this would fetch from API
    const mockEquipment: Equipment[] = [
      {
        id: 1,
        name: 'John Deere 8370R',
        type: 'tractor',
        brand: 'John Deere',
        model: '8370R',
        serialNumber: 'JD8370R001',
        purchaseDate: '2020-03-15',
        purchasePrice: 350000,
        currentValue: 280000,
        depreciationRate: 0.08,
        status: 'active',
        condition: 'good',
        location: 'Main Barn',
        operatingHours: 1250,
        fuelType: 'Diesel',
        fuelConsumption: 25.5,
        specifications: {
          'Engine Power': '370 HP',
          'Transmission': 'AutoPowr',
          'Hydraulics': 'Closed Center',
          'PTO': '540/1000 RPM',
        },
        warranty: {
          provider: 'John Deere',
          expiryDate: '2025-03-15',
          coverage: 'Powertrain',
        },
        insurance: {
          provider: 'Farm Bureau Insurance',
          policyNumber: 'FB-2024-001',
          expiryDate: '2024-12-31',
          coverage: 300000,
        },
        documents: ['manual.pdf', 'warranty.pdf', 'insurance.pdf'],
        notes: 'Primary tractor for field operations',
        createdAt: '2020-03-15',
        updatedAt: '2024-03-15',
      },
      {
        id: 2,
        name: 'Case IH Axial-Flow 9250',
        type: 'harvester',
        brand: 'Case IH',
        model: 'Axial-Flow 9250',
        serialNumber: 'CIH9250001',
        purchaseDate: '2019-08-20',
        purchasePrice: 550000,
        currentValue: 420000,
        depreciationRate: 0.10,
        status: 'maintenance',
        condition: 'good',
        location: 'Equipment Shed',
        operatingHours: 850,
        fuelType: 'Diesel',
        fuelConsumption: 35.2,
        specifications: {
          'Engine Power': '473 HP',
          'Grain Tank': '350 bu',
          'Cleaning System': 'Twin Rotor',
          'Unloading Rate': '3.2 bu/sec',
        },
        warranty: {
          provider: 'Case IH',
          expiryDate: '2024-08-20',
          coverage: 'Extended Warranty',
        },
        insurance: {
          provider: 'Farm Bureau Insurance',
          policyNumber: 'FB-2024-002',
          expiryDate: '2024-12-31',
          coverage: 450000,
        },
        documents: ['manual.pdf', 'warranty.pdf'],
        notes: 'Scheduled for routine maintenance',
        createdAt: '2019-08-20',
        updatedAt: '2024-03-10',
      },
      {
        id: 3,
        name: 'John Deere DB120',
        type: 'planter',
        brand: 'John Deere',
        model: 'DB120',
        serialNumber: 'JDDB120001',
        purchaseDate: '2021-02-10',
        purchasePrice: 180000,
        currentValue: 150000,
        depreciationRate: 0.07,
        status: 'active',
        condition: 'excellent',
        location: 'Implement Shed',
        operatingHours: 320,
        specifications: {
          'Rows': '48',
          'Row Spacing': '15 inches',
          'Seed Capacity': '240 bu',
          'Fertilizer Capacity': '3200 lbs',
        },
        warranty: {
          provider: 'John Deere',
          expiryDate: '2026-02-10',
          coverage: 'Full Coverage',
        },
        insurance: {
          provider: 'Farm Bureau Insurance',
          policyNumber: 'FB-2024-003',
          expiryDate: '2024-12-31',
          coverage: 160000,
        },
        documents: ['manual.pdf', 'warranty.pdf'],
        notes: 'Recently purchased, excellent condition',
        createdAt: '2021-02-10',
        updatedAt: '2024-03-12',
      },
    ];
    setEquipment(mockEquipment);
  };

  const loadMaintenanceRecords = async () => {
    // Mock maintenance data
    const mockMaintenance: MaintenanceRecord[] = [
      {
        id: 1,
        equipmentId: 1,
        equipmentName: 'John Deere 8370R',
        type: 'routine',
        description: 'Oil change and filter replacement',
        date: '2024-03-10',
        operatingHours: 1200,
        cost: 450,
        laborHours: 3,
        parts: [
          {
            id: 1,
            name: 'Engine Oil',
            partNumber: 'JD-OIL-15W40',
            quantity: 8,
            unitCost: 25,
            totalCost: 200,
            supplier: 'John Deere Parts',
          },
          {
            id: 2,
            name: 'Oil Filter',
            partNumber: 'JD-FILTER-001',
            quantity: 1,
            unitCost: 45,
            totalCost: 45,
            supplier: 'John Deere Parts',
          },
        ],
        technician: 'Mike Johnson',
        vendor: 'John Deere Service',
        invoiceNumber: 'JD-2024-001',
        nextMaintenanceDate: '2024-06-10',
        nextMaintenanceHours: 1500,
        status: 'completed',
        priority: 'medium',
        notes: 'Regular maintenance completed successfully',
        attachments: ['invoice.pdf', 'photos.jpg'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10',
      },
      {
        id: 2,
        equipmentId: 2,
        equipmentName: 'Case IH Axial-Flow 9250',
        type: 'repair',
        description: 'Hydraulic pump replacement',
        date: '2024-03-15',
        operatingHours: 850,
        cost: 2500,
        laborHours: 8,
        parts: [
          {
            id: 3,
            name: 'Hydraulic Pump',
            partNumber: 'CIH-PUMP-001',
            quantity: 1,
            unitCost: 1800,
            totalCost: 1800,
            supplier: 'Case IH Parts',
          },
        ],
        technician: 'Sarah Wilson',
        vendor: 'Case IH Service',
        invoiceNumber: 'CIH-2024-001',
        status: 'in_progress',
        priority: 'high',
        notes: 'Hydraulic pump failed during harvest season',
        attachments: ['diagnostic.pdf'],
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
      },
    ];
    setMaintenanceRecords(mockMaintenance);
  };

  const loadUsageRecords = async () => {
    // Mock usage data
    const mockUsage: UsageRecord[] = [
      {
        id: 1,
        equipmentId: 1,
        equipmentName: 'John Deere 8370R',
        operator: 'John Smith',
        startTime: '2024-03-15T08:00:00',
        endTime: '2024-03-15T16:00:00',
        duration: 8,
        operatingHours: 1250,
        fieldId: 1,
        fieldName: 'Field A - North',
        taskType: 'Plowing',
        fuelUsed: 204,
        fuelCost: 612,
        notes: 'Plowed 25 acres for spring planting',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
      },
      {
        id: 2,
        equipmentId: 2,
        equipmentName: 'Case IH Axial-Flow 9250',
        operator: 'Mike Johnson',
        startTime: '2024-03-12T09:00:00',
        endTime: '2024-03-12T17:00:00',
        duration: 8,
        operatingHours: 850,
        fieldId: 2,
        fieldName: 'Field B - South',
        taskType: 'Harvesting',
        fuelUsed: 282,
        fuelCost: 846,
        notes: 'Harvested corn from south field',
        createdAt: '2024-03-12',
        updatedAt: '2024-03-12',
      },
    ];
    setUsageRecords(mockUsage);
  };

  const loadMaintenanceSchedules = async () => {
    // Mock schedule data
    const mockSchedules: MaintenanceSchedule[] = [
      {
        id: 1,
        equipmentId: 1,
        equipmentName: 'John Deere 8370R',
        type: 'routine',
        description: 'Engine oil change',
        frequency: 'hours',
        interval: 250,
        lastPerformed: '2024-03-10',
        nextDue: '2024-06-10',
        isOverdue: false,
        priority: 'medium',
        estimatedCost: 450,
        estimatedDuration: 3,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-10',
      },
      {
        id: 2,
        equipmentId: 2,
        equipmentName: 'Case IH Axial-Flow 9250',
        type: 'inspection',
        description: 'Pre-harvest inspection',
        frequency: 'months',
        interval: 12,
        lastPerformed: '2023-08-15',
        nextDue: '2024-08-15',
        isOverdue: false,
        priority: 'high',
        estimatedCost: 800,
        estimatedDuration: 6,
        createdAt: '2023-08-15',
        updatedAt: '2023-08-15',
      },
    ];
    setMaintenanceSchedules(mockSchedules);
  };

  const handleCreateEquipment = () => {
    setEquipmentFormData({
      name: '',
      type: 'tractor',
      brand: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      purchasePrice: '',
      location: '',
      fuelType: '',
      fuelConsumption: '',
      warrantyProvider: '',
      warrantyExpiry: '',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      insuranceExpiry: '',
      insuranceCoverage: '',
      notes: '',
    });
    setSelectedEquipment(null);
    setShowEquipmentModal(true);
  };

  const handleSaveEquipment = () => {
    if (!equipmentFormData.name || !equipmentFormData.brand || !equipmentFormData.model) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newEquipment: Equipment = {
      id: selectedEquipment?.id || Date.now(),
      name: equipmentFormData.name,
      type: equipmentFormData.type as any,
      brand: equipmentFormData.brand,
      model: equipmentFormData.model,
      serialNumber: equipmentFormData.serialNumber,
      purchaseDate: equipmentFormData.purchaseDate,
      purchasePrice: parseFloat(equipmentFormData.purchasePrice) || 0,
      currentValue: parseFloat(equipmentFormData.purchasePrice) || 0,
      depreciationRate: 0.08,
      status: 'active',
      condition: 'good',
      location: equipmentFormData.location,
      operatingHours: 0,
      fuelType: equipmentFormData.fuelType,
      fuelConsumption: parseFloat(equipmentFormData.fuelConsumption) || undefined,
      specifications: {},
      warranty: {
        provider: equipmentFormData.warrantyProvider,
        expiryDate: equipmentFormData.warrantyExpiry,
        coverage: 'Standard',
      },
      insurance: {
        provider: equipmentFormData.insuranceProvider,
        policyNumber: equipmentFormData.insurancePolicyNumber,
        expiryDate: equipmentFormData.insuranceExpiry,
        coverage: parseFloat(equipmentFormData.insuranceCoverage) || 0,
      },
      documents: [],
      notes: equipmentFormData.notes,
      createdAt: selectedEquipment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedEquipment) {
      setEquipment(prev => prev.map(eq => eq.id === selectedEquipment.id ? newEquipment : eq));
    } else {
      setEquipment(prev => [...prev, newEquipment]);
    }

    setShowEquipmentModal(false);
    Alert.alert('Success', 'Equipment saved successfully');
  };

  const handleCreateMaintenance = () => {
    setMaintenanceFormData({
      equipmentId: '',
      type: 'routine',
      description: '',
      date: '',
      cost: '',
      laborHours: '',
      technician: '',
      vendor: '',
      invoiceNumber: '',
      nextMaintenanceDate: '',
      nextMaintenanceHours: '',
      priority: 'medium',
      notes: '',
    });
    setSelectedMaintenance(null);
    setShowMaintenanceModal(true);
  };

  const handleSaveMaintenance = () => {
    if (!maintenanceFormData.equipmentId || !maintenanceFormData.description || !maintenanceFormData.date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const equipment = equipment.find(eq => eq.id.toString() === maintenanceFormData.equipmentId);
    if (!equipment) return;

    const newMaintenance: MaintenanceRecord = {
      id: selectedMaintenance?.id || Date.now(),
      equipmentId: parseInt(maintenanceFormData.equipmentId),
      equipmentName: equipment.name,
      type: maintenanceFormData.type as any,
      description: maintenanceFormData.description,
      date: maintenanceFormData.date,
      operatingHours: equipment.operatingHours,
      cost: parseFloat(maintenanceFormData.cost) || 0,
      laborHours: parseFloat(maintenanceFormData.laborHours) || 0,
      parts: [],
      technician: maintenanceFormData.technician,
      vendor: maintenanceFormData.vendor,
      invoiceNumber: maintenanceFormData.invoiceNumber,
      nextMaintenanceDate: maintenanceFormData.nextMaintenanceDate,
      nextMaintenanceHours: parseFloat(maintenanceFormData.nextMaintenanceHours) || undefined,
      status: 'scheduled',
      priority: maintenanceFormData.priority as any,
      notes: maintenanceFormData.notes,
      attachments: [],
      createdAt: selectedMaintenance?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedMaintenance) {
      setMaintenanceRecords(prev => prev.map(m => m.id === selectedMaintenance.id ? newMaintenance : m));
    } else {
      setMaintenanceRecords(prev => [...prev, newMaintenance]);
    }

    setShowMaintenanceModal(false);
    Alert.alert('Success', 'Maintenance record saved successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success[500];
      case 'maintenance': return theme.colors.warning[500];
      case 'repair': return theme.colors.error[500];
      case 'retired': return theme.colors.neutral[500];
      default: return theme.colors.neutral[500];
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return theme.colors.success[500];
      case 'good': return theme.colors.primary[500];
      case 'fair': return theme.colors.warning[500];
      case 'poor': return theme.colors.error[500];
      default: return theme.colors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return theme.colors.error[500];
      case 'high': return theme.colors.warning[500];
      case 'medium': return theme.colors.primary[500];
      case 'low': return theme.colors.neutral[500];
      default: return theme.colors.neutral[500];
    }
  };

  const filteredEquipment = equipment.filter(eq => {
    const matchesType = filterType === 'all' || eq.type === filterType;
    const matchesStatus = filterStatus === 'all' || eq.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const calculateEquipmentSummary = () => {
    const totalEquipment = equipment.length;
    const totalValue = equipment.reduce((sum, eq) => sum + eq.currentValue, 0);
    const activeEquipment = equipment.filter(eq => eq.status === 'active').length;
    const maintenanceNeeded = equipment.filter(eq => eq.status === 'maintenance' || eq.status === 'repair').length;
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);

    return {
      totalEquipment,
      totalValue,
      activeEquipment,
      maintenanceNeeded,
      totalMaintenanceCost,
    };
  };

  const renderOverview = () => {
    const summary = calculateEquipmentSummary();
    const overdueSchedules = maintenanceSchedules.filter(s => s.isOverdue);
    
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Equipment Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Settings size={24} color={theme.colors.primary[500]} />
              <Text style={styles.summaryTitle}>Total Equipment</Text>
            </View>
            <Text style={styles.summaryValue}>{summary.totalEquipment}</Text>
            <Text style={styles.summaryChange}>Active fleet</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <DollarSign size={24} color={theme.colors.success[500]} />
              <Text style={styles.summaryTitle}>Total Value</Text>
            </View>
            <Text style={styles.summaryValue}>${summary.totalValue.toLocaleString()}</Text>
            <Text style={styles.summaryChange}>Current asset value</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <TrendingUp size={24} color={theme.colors.success[500]} />
              <Text style={styles.summaryTitle}>Active Units</Text>
            </View>
            <Text style={styles.summaryValue}>{summary.activeEquipment}</Text>
            <Text style={styles.summaryChange}>Ready for operation</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <AlertTriangle size={24} color={theme.colors.warning[500]} />
              <Text style={styles.summaryTitle}>Maintenance</Text>
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.warning[500] }]}>
              {summary.maintenanceNeeded}
            </Text>
            <Text style={styles.summaryChange}>Units need attention</Text>
          </Card>
        </View>

        {/* Maintenance Alerts */}
        {overdueSchedules.length > 0 && (
          <Card style={styles.alertsCard}>
            <View style={styles.alertsHeader}>
              <AlertTriangle size={20} color={theme.colors.error[500]} />
              <Text style={styles.alertsTitle}>Overdue Maintenance</Text>
            </View>
            {overdueSchedules.slice(0, 3).map(schedule => (
              <View key={schedule.id} style={styles.alertRow}>
                <Text style={styles.alertEquipmentName}>{schedule.equipmentName}</Text>
                <Text style={styles.alertDescription}>{schedule.description}</Text>
              </View>
            ))}
            {overdueSchedules.length > 3 && (
              <TouchableOpacity style={styles.viewAllButton} onPress={() => setActiveTab('maintenance')}>
                <Text style={styles.viewAllText}>View All Overdue Items</Text>
              </TouchableOpacity>
            )}
          </Card>
        )}

        {/* Recent Maintenance */}
        <Card style={styles.recentMaintenance}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Maintenance</Text>
            <Button
              title="View All"
              onPress={() => setActiveTab('maintenance')}
              variant="ghost"
              size="sm"
            />
          </View>
          {maintenanceRecords.slice(0, 5).map(record => (
            <View key={record.id} style={styles.maintenanceRow}>
              <View style={styles.maintenanceInfo}>
                <Text style={styles.maintenanceEquipment}>{record.equipmentName}</Text>
                <Text style={styles.maintenanceDescription}>{record.description}</Text>
                <Text style={styles.maintenanceDate}>{record.date}</Text>
              </View>
              <View style={styles.maintenanceDetails}>
                <Text style={styles.maintenanceCost}>${record.cost.toLocaleString()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getPriorityColor(record.priority) + '20' }]}>
                  <Text style={[styles.statusText, { color: getPriorityColor(record.priority) }]}>
                    {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Equipment Status Overview */}
        <Card style={styles.statusOverview}>
          <Text style={styles.sectionTitle}>Equipment Status</Text>
          <View style={styles.statusGrid}>
            {equipment.slice(0, 4).map(eq => (
              <View key={eq.id} style={styles.statusItem}>
                <Text style={styles.statusEquipmentName}>{eq.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(eq.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(eq.status) }]}>
                    {eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
                  </Text>
                </View>
                <Text style={styles.statusHours}>{eq.operatingHours} hours</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    );
  };

  const renderEquipmentCard = (eq: Equipment) => (
    <Card key={eq.id} style={styles.equipmentCard}>
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentInfo}>
          <Text style={styles.equipmentName}>{eq.name}</Text>
          <Text style={styles.equipmentModel}>{eq.brand} {eq.model}</Text>
        </View>
        <View style={styles.equipmentStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(eq.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(eq.status) }]}>
              {eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
            </Text>
          </View>
          <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(eq.condition) + '20' }]}>
            <Text style={[styles.conditionText, { color: getConditionColor(eq.condition) }]}>
              {eq.condition.charAt(0).toUpperCase() + eq.condition.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.equipmentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Serial Number:</Text>
          <Text style={styles.detailValue}>{eq.serialNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Operating Hours:</Text>
          <Text style={styles.detailValue}>{eq.operatingHours} hours</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Current Value:</Text>
          <Text style={styles.detailValue}>${eq.currentValue.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{eq.location}</Text>
        </View>
        {eq.fuelType && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fuel Type:</Text>
            <Text style={styles.detailValue}>{eq.fuelType}</Text>
          </View>
        )}
      </View>

      <View style={styles.equipmentFooter}>
        <Button
          title="Edit"
          onPress={() => {
            setSelectedEquipment(eq);
            setEquipmentFormData({
              name: eq.name,
              type: eq.type,
              brand: eq.brand,
              model: eq.model,
              serialNumber: eq.serialNumber,
              purchaseDate: eq.purchaseDate,
              purchasePrice: eq.purchasePrice.toString(),
              location: eq.location,
              fuelType: eq.fuelType || '',
              fuelConsumption: eq.fuelConsumption?.toString() || '',
              warrantyProvider: eq.warranty.provider,
              warrantyExpiry: eq.warranty.expiryDate,
              insuranceProvider: eq.insurance.provider,
              insurancePolicyNumber: eq.insurance.policyNumber,
              insuranceExpiry: eq.insurance.expiryDate,
              insuranceCoverage: eq.insurance.coverage.toString(),
              notes: eq.notes,
            });
            setShowEquipmentModal(true);
          }}
          variant="outline"
          size="sm"
        />
        <Button
          title="Maintenance"
          onPress={() => {
            setMaintenanceFormData({
              equipmentId: eq.id.toString(),
              type: 'routine',
              description: '',
              date: new Date().toISOString().split('T')[0],
              cost: '',
              laborHours: '',
              technician: '',
              vendor: '',
              invoiceNumber: '',
              nextMaintenanceDate: '',
              nextMaintenanceHours: '',
              priority: 'medium',
              notes: '',
            });
            setShowMaintenanceModal(true);
          }}
          variant="ghost"
          size="sm"
          icon={<Wrench size={16} color={theme.colors.primary[500]} />}
        />
      </View>
    </Card>
  );

  const renderMaintenanceCard = (record: MaintenanceRecord) => (
    <Card key={record.id} style={styles.maintenanceCard}>
      <View style={styles.maintenanceHeader}>
        <View style={styles.maintenanceInfo}>
          <Text style={styles.maintenanceEquipment}>{record.equipmentName}</Text>
          <Text style={styles.maintenanceDescription}>{record.description}</Text>
          <Text style={styles.maintenanceDate}>{record.date}</Text>
        </View>
        <View style={styles.maintenanceMeta}>
          <Text style={styles.maintenanceCost}>${record.cost.toLocaleString()}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(record.priority) + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(record.priority) }]}>
              {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.maintenanceDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{record.type.charAt(0).toUpperCase() + record.type.slice(1)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Technician:</Text>
          <Text style={styles.detailValue}>{record.technician}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Labor Hours:</Text>
          <Text style={styles.detailValue}>{record.laborHours} hours</Text>
        </View>
        {record.vendor && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vendor:</Text>
            <Text style={styles.detailValue}>{record.vendor}</Text>
          </View>
        )}
        {record.nextMaintenanceDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Next Due:</Text>
            <Text style={styles.detailValue}>{record.nextMaintenanceDate}</Text>
          </View>
        )}
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
        <Text style={styles.title}>Equipment Management</Text>
        <View style={styles.headerActions}>
          <Button
            title="Add Equipment"
            onPress={handleCreateEquipment}
            icon={<Plus size={16} color={theme.colors.neutral[50]} />}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {renderTabButton('overview', 'Overview')}
        {renderTabButton('equipment', 'Equipment')}
        {renderTabButton('maintenance', 'Maintenance')}
        {renderTabButton('usage', 'Usage')}
        {renderTabButton('analytics', 'Analytics')}
      </ScrollView>

      <View style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        
        {activeTab === 'equipment' && (
          <View style={styles.equipmentContainer}>
            <View style={styles.filtersContainer}>
              <Dropdown
                value={filterType}
                onValueChange={setFilterType}
                options={[
                  { label: 'All Types', value: 'all' },
                  ...equipmentTypes.map(t => ({ label: t.label, value: t.name }))
                ]}
                style={styles.filterDropdown}
              />
              <Dropdown
                value={filterStatus}
                onValueChange={setFilterStatus}
                options={[
                  { label: 'All Status', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Maintenance', value: 'maintenance' },
                  { label: 'Repair', value: 'repair' },
                  { label: 'Retired', value: 'retired' },
                ]}
                style={styles.filterDropdown}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredEquipment.length === 0 ? (
                <Card style={styles.emptyState}>
                  <Settings size={48} color={theme.colors.neutral[400]} />
                  <Text style={styles.emptyStateText}>No equipment found</Text>
                  <Text style={styles.emptyStateSubtext}>Add your first equipment to get started</Text>
                  <Button
                    title="Add Equipment"
                    onPress={handleCreateEquipment}
                    style={styles.emptyStateButton}
                  />
                </Card>
              ) : (
                filteredEquipment.map(renderEquipmentCard)
              )}
            </ScrollView>
          </View>
        )}

        {activeTab === 'maintenance' && (
          <View style={styles.maintenanceContainer}>
            <View style={styles.maintenanceHeader}>
              <Button
                title="Schedule Maintenance"
                onPress={handleCreateMaintenance}
                icon={<Plus size={16} color={theme.colors.neutral[50]} />}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {maintenanceRecords.length === 0 ? (
                <Card style={styles.emptyState}>
                  <Wrench size={48} color={theme.colors.neutral[400]} />
                  <Text style={styles.emptyStateText}>No maintenance records</Text>
                  <Text style={styles.emptyStateSubtext}>Schedule your first maintenance</Text>
                  <Button
                    title="Schedule Maintenance"
                    onPress={handleCreateMaintenance}
                    style={styles.emptyStateButton}
                  />
                </Card>
              ) : (
                maintenanceRecords.map(renderMaintenanceCard)
              )}
            </ScrollView>
          </View>
        )}

        {(activeTab === 'usage' || activeTab === 'analytics') && (
          <Card style={styles.comingSoonCard}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
            <Text style={styles.comingSoonSubtext}>
              {activeTab === 'usage' && 'Equipment usage tracking and reporting'}
              {activeTab === 'analytics' && 'Equipment analytics and performance metrics'}
            </Text>
          </Card>
        )}
      </View>

      {/* Add/Edit Equipment Modal */}
      <Modal visible={showEquipmentModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedEquipment ? 'Edit Equipment' : 'Add Equipment'}
            </Text>
            <TouchableOpacity onPress={() => setShowEquipmentModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <FormField
              label="Equipment Name"
              value={equipmentFormData.name}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, name: text }))}
              placeholder="e.g., John Deere 8370R"
              required
            />

            <Dropdown
              label="Type"
              value={equipmentFormData.type}
              onValueChange={(value) => setEquipmentFormData(prev => ({ ...prev, type: value }))}
              options={equipmentTypes.map(t => ({ label: t.label, value: t.name }))}
              required
            />

            <FormField
              label="Brand"
              value={equipmentFormData.brand}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, brand: text }))}
              placeholder="e.g., John Deere"
              required
            />

            <FormField
              label="Model"
              value={equipmentFormData.model}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, model: text }))}
              placeholder="e.g., 8370R"
              required
            />

            <FormField
              label="Serial Number"
              value={equipmentFormData.serialNumber}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, serialNumber: text }))}
              placeholder="Serial number"
            />

            <FormField
              label="Purchase Date"
              value={equipmentFormData.purchaseDate}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, purchaseDate: text }))}
              placeholder="YYYY-MM-DD"
            />

            <FormField
              label="Purchase Price"
              value={equipmentFormData.purchasePrice}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, purchasePrice: text }))}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <FormField
              label="Location"
              value={equipmentFormData.location}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, location: text }))}
              placeholder="Storage location"
            />

            <FormField
              label="Fuel Type"
              value={equipmentFormData.fuelType}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, fuelType: text }))}
              placeholder="e.g., Diesel"
            />

            <FormField
              label="Fuel Consumption (per hour)"
              value={equipmentFormData.fuelConsumption}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, fuelConsumption: text }))}
              placeholder="Liters per hour"
              keyboardType="numeric"
            />

            <FormField
              label="Warranty Provider"
              value={equipmentFormData.warrantyProvider}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, warrantyProvider: text }))}
              placeholder="Warranty provider"
            />

            <FormField
              label="Warranty Expiry"
              value={equipmentFormData.warrantyExpiry}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, warrantyExpiry: text }))}
              placeholder="YYYY-MM-DD"
            />

            <FormField
              label="Insurance Provider"
              value={equipmentFormData.insuranceProvider}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, insuranceProvider: text }))}
              placeholder="Insurance provider"
            />

            <FormField
              label="Insurance Policy Number"
              value={equipmentFormData.insurancePolicyNumber}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, insurancePolicyNumber: text }))}
              placeholder="Policy number"
            />

            <FormField
              label="Insurance Expiry"
              value={equipmentFormData.insuranceExpiry}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, insuranceExpiry: text }))}
              placeholder="YYYY-MM-DD"
            />

            <FormField
              label="Insurance Coverage"
              value={equipmentFormData.insuranceCoverage}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, insuranceCoverage: text }))}
              placeholder="Coverage amount"
              keyboardType="numeric"
            />

            <FormField
              label="Notes"
              value={equipmentFormData.notes}
              onChangeText={(text) => setEquipmentFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Additional notes"
              multiline
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowEquipmentModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Save Equipment"
              onPress={handleSaveEquipment}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Add Maintenance Modal */}
      <Modal visible={showMaintenanceModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Schedule Maintenance</Text>
            <TouchableOpacity onPress={() => setShowMaintenanceModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Dropdown
              label="Equipment"
              value={maintenanceFormData.equipmentId}
              onValueChange={(value) => setMaintenanceFormData(prev => ({ ...prev, equipmentId: value }))}
              options={equipment.map(eq => ({ label: eq.name, value: eq.id.toString() }))}
              placeholder="Select equipment"
              required
            />

            <Dropdown
              label="Type"
              value={maintenanceFormData.type}
              onValueChange={(value) => setMaintenanceFormData(prev => ({ ...prev, type: value }))}
              options={[
                { label: 'Routine', value: 'routine' },
                { label: 'Repair', value: 'repair' },
                { label: 'Inspection', value: 'inspection' },
                { label: 'Overhaul', value: 'overhaul' },
              ]}
              required
            />

            <FormField
              label="Description"
              value={maintenanceFormData.description}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, description: text }))}
              placeholder="Maintenance description"
              required
            />

            <FormField
              label="Date"
              value={maintenanceFormData.date}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, date: text }))}
              placeholder="YYYY-MM-DD"
              required
            />

            <FormField
              label="Estimated Cost"
              value={maintenanceFormData.cost}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, cost: text }))}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <FormField
              label="Labor Hours"
              value={maintenanceFormData.laborHours}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, laborHours: text }))}
              placeholder="Hours"
              keyboardType="numeric"
            />

            <FormField
              label="Technician"
              value={maintenanceFormData.technician}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, technician: text }))}
              placeholder="Technician name"
            />

            <FormField
              label="Vendor"
              value={maintenanceFormData.vendor}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, vendor: text }))}
              placeholder="Service vendor"
            />

            <FormField
              label="Invoice Number"
              value={maintenanceFormData.invoiceNumber}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, invoiceNumber: text }))}
              placeholder="Invoice/Work order number"
            />

            <FormField
              label="Next Maintenance Date"
              value={maintenanceFormData.nextMaintenanceDate}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, nextMaintenanceDate: text }))}
              placeholder="YYYY-MM-DD"
            />

            <FormField
              label="Next Maintenance Hours"
              value={maintenanceFormData.nextMaintenanceHours}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, nextMaintenanceHours: text }))}
              placeholder="Operating hours"
              keyboardType="numeric"
            />

            <Dropdown
              label="Priority"
              value={maintenanceFormData.priority}
              onValueChange={(value) => setMaintenanceFormData(prev => ({ ...prev, priority: value }))}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
              ]}
            />

            <FormField
              label="Notes"
              value={maintenanceFormData.notes}
              onChangeText={(text) => setMaintenanceFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Additional notes"
              multiline
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowMaintenanceModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Schedule Maintenance"
              onPress={handleSaveMaintenance}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  tabContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  summaryCard: {
    width: '48%',
    padding: theme.spacing[4],
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing[2],
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  summaryChange: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
  },
  alertsCard: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.error[50],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error[500],
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  alertsTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.error[700],
    marginLeft: theme.spacing[2],
  },
  alertRow: {
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.error[200],
  },
  alertEquipmentName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.error[700],
    marginBottom: theme.spacing[1],
  },
  alertDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[600],
  },
  viewAllButton: {
    marginTop: theme.spacing[2],
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  recentMaintenance: {
    marginBottom: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  maintenanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  maintenanceInfo: {
    flex: 1,
  },
  maintenanceEquipment: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  maintenanceDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  maintenanceDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  maintenanceDetails: {
    alignItems: 'flex-end',
  },
  maintenanceCost: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  statusOverview: {
    marginBottom: theme.spacing[4],
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    marginTop: theme.spacing[3],
  },
  statusItem: {
    width: '48%',
    padding: theme.spacing[3],
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.radii.md,
  },
  statusEquipmentName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  statusHours: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing[1],
  },
  equipmentContainer: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  filterDropdown: {
    flex: 1,
  },
  equipmentCard: {
    marginBottom: theme.spacing[3],
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  equipmentModel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  equipmentStatus: {
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
  conditionBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
  },
  conditionText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  equipmentDetails: {
    marginBottom: theme.spacing[3],
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
  equipmentFooter: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  maintenanceContainer: {
    flex: 1,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing[4],
  },
  maintenanceCard: {
    marginBottom: theme.spacing[3],
  },
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  maintenanceMeta: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
    marginTop: theme.spacing[1],
  },
  priorityText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  comingSoonCard: {
    alignItems: 'center',
    padding: theme.spacing[8],
  },
  comingSoonText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  comingSoonSubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[600],
    textAlign: 'center',
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