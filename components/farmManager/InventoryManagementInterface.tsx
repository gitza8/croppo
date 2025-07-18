import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Package, TrendingDown, AlertTriangle, Plus, Minus, Search, Filter, BarChart3, Calendar, X } from 'lucide-react-native';
import { theme } from '@/components/designSystem';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface InventoryItem {
  id: number;
  name: string;
  category: 'fertilizer' | 'pesticide' | 'seed' | 'equipment' | 'other';
  subcategory: string;
  currentStock: number;
  unit: string;
  reorderThreshold: number;
  reorderQuantity: number;
  costPerUnit: number;
  totalValue: number;
  supplier?: string;
  supplierContact?: string;
  barcode?: string;
  location?: string;
  msdsInfo?: string;
  usageInstructions?: string;
  expiryDate?: string;
  lastMovement?: string;
  isLowStock: boolean;
  isExpiring: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InventoryMovement {
  id: number;
  inventoryItemId: number;
  itemName: string;
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit: string;
  cost?: number;
  reason: string;
  operator: string;
  date: string;
  batchNumber?: string;
  expiryDate?: string;
  supplier?: string;
  invoiceNumber?: string;
  fieldId?: number;
  fieldName?: string;
  cropId?: number;
  cropName?: string;
  taskId?: number;
  treatmentId?: number;
  fertilizationId?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BatchLot {
  id: number;
  inventoryItemId: number;
  batchNumber: string;
  lotNumber?: string;
  quantity: number;
  unit: string;
  manufacturingDate?: string;
  expiryDate?: string;
  supplier: string;
  invoiceNumber?: string;
  cost: number;
  status: 'active' | 'expired' | 'recalled' | 'used';
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  deliveryLeadTime: number;
  rating: number;
  isActive: boolean;
  specialties: string[];
  createdAt: string;
  updatedAt: string;
}

interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseOrderItem {
  id: number;
  inventoryItemId: number;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface InventoryManagementInterfaceProps {
  onDataChange?: (data: { items: InventoryItem[]; movements: InventoryMovement[] }) => void;
}

export default function InventoryManagementInterface({ onDataChange }: InventoryManagementInterfaceProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [batchLots, setBatchLots] = useState<BatchLot[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<InventoryMovement | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showPurchaseOrderModal, setShowPurchaseOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'movements' | 'batches' | 'suppliers' | 'orders'>('overview');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: 'fertilizer',
    subcategory: '',
    currentStock: '',
    unit: '',
    reorderThreshold: '',
    reorderQuantity: '',
    costPerUnit: '',
    supplier: '',
    location: '',
    barcode: '',
    expiryDate: '',
    usageInstructions: '',
  });
  const [movementFormData, setMovementFormData] = useState({
    inventoryItemId: '',
    movementType: 'in',
    quantity: '',
    reason: '',
    operator: '',
    date: '',
    batchNumber: '',
    expiryDate: '',
    supplier: '',
    invoiceNumber: '',
    fieldId: '',
    cropId: '',
    cost: '',
    notes: '',
  });

  // Mock data for categories and subcategories
  const categories = [
    { 
      name: 'fertilizer', 
      label: 'Fertilizers',
      subcategories: ['Organic', 'Synthetic', 'Liquid', 'Granular', 'Micronutrients'] 
    },
    { 
      name: 'pesticide', 
      label: 'Pesticides',
      subcategories: ['Herbicides', 'Insecticides', 'Fungicides', 'Biological Controls'] 
    },
    { 
      name: 'seed', 
      label: 'Seeds',
      subcategories: ['Vegetables', 'Grains', 'Legumes', 'Cover Crops'] 
    },
    { 
      name: 'equipment', 
      label: 'Equipment',
      subcategories: ['Tools', 'Machinery Parts', 'Irrigation', 'Safety Equipment'] 
    },
    { 
      name: 'other', 
      label: 'Other',
      subcategories: ['Packaging', 'Fuel', 'Lubricants', 'Miscellaneous'] 
    },
  ];

  const units = [
    'kg', 'lbs', 'tons', 'liters', 'gallons', 'pieces', 'boxes', 'bags'
  ];

  const fields = [
    { id: 1, name: 'Field A - North', area: 25.5 },
    { id: 2, name: 'Field B - South', area: 18.2 },
    { id: 3, name: 'Field C - East', area: 32.1 },
  ];

  const crops = [
    { id: 1, name: 'Corn', fieldId: 1 },
    { id: 2, name: 'Wheat', fieldId: 2 },
    { id: 3, name: 'Soybeans', fieldId: 3 },
  ];

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    await Promise.all([
      loadInventoryItems(),
      loadMovements(),
      loadBatchLots(),
      loadSuppliers(),
      loadPurchaseOrders(),
    ]);
  };

  const loadInventoryItems = async () => {
    // Mock data - in real app, this would fetch from API
    const mockItems: InventoryItem[] = [
      {
        id: 1,
        name: 'Organic Compost',
        category: 'fertilizer',
        subcategory: 'Organic',
        currentStock: 500,
        unit: 'kg',
        reorderThreshold: 100,
        reorderQuantity: 1000,
        costPerUnit: 0.5,
        totalValue: 250,
        supplier: 'Green Earth Supplies',
        supplierContact: 'contact@greenearth.com',
        location: 'Warehouse A - Section 1',
        usageInstructions: 'Apply 2-3 kg per square meter',
        expiryDate: '2024-12-31',
        lastMovement: '2024-03-15',
        isLowStock: false,
        isExpiring: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15',
      },
      {
        id: 2,
        name: 'NPK Fertilizer 20-10-10',
        category: 'fertilizer',
        subcategory: 'Synthetic',
        currentStock: 50,
        unit: 'kg',
        reorderThreshold: 100,
        reorderQuantity: 500,
        costPerUnit: 1.2,
        totalValue: 60,
        supplier: 'AgriChem Solutions',
        supplierContact: 'orders@agrichem.com',
        location: 'Warehouse A - Section 2',
        usageInstructions: 'Apply 300g per plant',
        expiryDate: '2025-06-30',
        lastMovement: '2024-03-10',
        isLowStock: true,
        isExpiring: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-10',
      },
      {
        id: 3,
        name: 'Organic Pesticide BT',
        category: 'pesticide',
        subcategory: 'Biological Controls',
        currentStock: 25,
        unit: 'liters',
        reorderThreshold: 50,
        reorderQuantity: 100,
        costPerUnit: 15.0,
        totalValue: 375,
        supplier: 'BioControl Inc',
        supplierContact: 'sales@biocontrol.com',
        location: 'Warehouse B - Section 1',
        msdsInfo: 'MSDS available on request',
        usageInstructions: 'Dilute 1:100 with water',
        expiryDate: '2024-08-15',
        lastMovement: '2024-03-08',
        isLowStock: true,
        isExpiring: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-08',
      },
      {
        id: 4,
        name: 'Corn Seeds - Hybrid',
        category: 'seed',
        subcategory: 'Grains',
        currentStock: 200,
        unit: 'kg',
        reorderThreshold: 50,
        reorderQuantity: 300,
        costPerUnit: 8.0,
        totalValue: 1600,
        supplier: 'Premium Seeds Co',
        supplierContact: 'info@premiumseeds.com',
        location: 'Cold Storage - Section 1',
        usageInstructions: 'Plant 25-30 kg per hectare',
        expiryDate: '2024-12-31',
        lastMovement: '2024-03-12',
        isLowStock: false,
        isExpiring: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-12',
      },
    ];
    setInventoryItems(mockItems);
  };

  const loadMovements = async () => {
    // Mock movement data
    const mockMovements: InventoryMovement[] = [
      {
        id: 1,
        inventoryItemId: 1,
        itemName: 'Organic Compost',
        movementType: 'out',
        quantity: 100,
        unit: 'kg',
        cost: 50,
        reason: 'Field application',
        operator: 'John Doe',
        date: '2024-03-15',
        fieldId: 1,
        fieldName: 'Field A - North',
        cropId: 1,
        cropName: 'Corn',
        treatmentId: 1,
        notes: 'Applied to corn field for soil enrichment',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
      },
      {
        id: 2,
        inventoryItemId: 2,
        itemName: 'NPK Fertilizer 20-10-10',
        movementType: 'in',
        quantity: 500,
        unit: 'kg',
        cost: 600,
        reason: 'Purchase order delivery',
        operator: 'Jane Smith',
        date: '2024-03-10',
        batchNumber: 'NPK-2024-001',
        expiryDate: '2025-06-30',
        supplier: 'AgriChem Solutions',
        invoiceNumber: 'INV-2024-001',
        notes: 'Delivery from AgriChem Solutions',
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10',
      },
      {
        id: 3,
        inventoryItemId: 3,
        itemName: 'Organic Pesticide BT',
        movementType: 'out',
        quantity: 10,
        unit: 'liters',
        cost: 150,
        reason: 'Pest control application',
        operator: 'Mike Johnson',
        date: '2024-03-08',
        fieldId: 2,
        fieldName: 'Field B - South',
        cropId: 2,
        cropName: 'Wheat',
        treatmentId: 2,
        notes: 'Applied for caterpillar control',
        createdAt: '2024-03-08',
        updatedAt: '2024-03-08',
      },
    ];
    setMovements(mockMovements);
  };

  const loadBatchLots = async () => {
    // Mock batch/lot data
    const mockBatches: BatchLot[] = [
      {
        id: 1,
        inventoryItemId: 2,
        batchNumber: 'NPK-2024-001',
        lotNumber: 'LOT-001',
        quantity: 500,
        unit: 'kg',
        manufacturingDate: '2024-01-15',
        expiryDate: '2025-06-30',
        supplier: 'AgriChem Solutions',
        invoiceNumber: 'INV-2024-001',
        cost: 600,
        status: 'active',
        location: 'Warehouse A - Section 2',
        notes: 'High quality NPK fertilizer',
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10',
      },
      {
        id: 2,
        inventoryItemId: 3,
        batchNumber: 'BT-2024-001',
        lotNumber: 'LOT-002',
        quantity: 50,
        unit: 'liters',
        manufacturingDate: '2024-02-01',
        expiryDate: '2024-08-15',
        supplier: 'BioControl Inc',
        invoiceNumber: 'INV-2024-002',
        cost: 750,
        status: 'active',
        location: 'Warehouse B - Section 1',
        notes: 'Organic biological control agent',
        createdAt: '2024-02-15',
        updatedAt: '2024-02-15',
      },
    ];
    setBatchLots(mockBatches);
  };

  const loadSuppliers = async () => {
    // Mock supplier data
    const mockSuppliers: Supplier[] = [
      {
        id: 1,
        name: 'Green Earth Supplies',
        contactPerson: 'Sarah Green',
        email: 'contact@greenearth.com',
        phone: '+1-555-0101',
        address: '123 Organic Way, Green Valley, CA 90210',
        paymentTerms: 'Net 30',
        deliveryLeadTime: 7,
        rating: 4.5,
        isActive: true,
        specialties: ['Organic Fertilizers', 'Compost', 'Soil Amendments'],
        createdAt: '2024-01-01',
        updatedAt: '2024-03-01',
      },
      {
        id: 2,
        name: 'AgriChem Solutions',
        contactPerson: 'David Chen',
        email: 'orders@agrichem.com',
        phone: '+1-555-0102',
        address: '456 Chemical Drive, Industrial Park, TX 75001',
        paymentTerms: 'Net 15',
        deliveryLeadTime: 5,
        rating: 4.2,
        isActive: true,
        specialties: ['Synthetic Fertilizers', 'Plant Nutrients', 'Soil Testing'],
        createdAt: '2024-01-01',
        updatedAt: '2024-03-01',
      },
    ];
    setSuppliers(mockSuppliers);
  };

  const loadPurchaseOrders = async () => {
    // Mock purchase order data
    const mockOrders: PurchaseOrder[] = [
      {
        id: 1,
        orderNumber: 'PO-2024-001',
        supplierId: 1,
        supplierName: 'Green Earth Supplies',
        items: [
          {
            id: 1,
            inventoryItemId: 1,
            itemName: 'Organic Compost',
            quantity: 1000,
            unit: 'kg',
            unitPrice: 0.5,
            totalPrice: 500,
            notes: 'Premium quality compost',
          },
        ],
        totalAmount: 500,
        status: 'confirmed',
        orderDate: '2024-03-01',
        expectedDeliveryDate: '2024-03-08',
        actualDeliveryDate: '2024-03-07',
        notes: 'Urgent delivery requested',
        createdBy: 1,
        createdAt: '2024-03-01',
        updatedAt: '2024-03-07',
      },
    ];
    setPurchaseOrders(mockOrders);
  };

  const handleCreateItem = () => {
    setItemFormData({
      name: '',
      category: 'fertilizer',
      subcategory: '',
      currentStock: '',
      unit: '',
      reorderThreshold: '',
      reorderQuantity: '',
      costPerUnit: '',
      supplier: '',
      location: '',
      barcode: '',
      expiryDate: '',
      usageInstructions: '',
    });
    setSelectedItem(null);
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (!itemFormData.name || !itemFormData.currentStock || !itemFormData.unit) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newItem: InventoryItem = {
      id: selectedItem?.id || Date.now(),
      name: itemFormData.name,
      category: itemFormData.category as any,
      subcategory: itemFormData.subcategory,
      currentStock: parseFloat(itemFormData.currentStock),
      unit: itemFormData.unit,
      reorderThreshold: parseFloat(itemFormData.reorderThreshold) || 0,
      reorderQuantity: parseFloat(itemFormData.reorderQuantity) || 0,
      costPerUnit: parseFloat(itemFormData.costPerUnit) || 0,
      totalValue: parseFloat(itemFormData.currentStock) * parseFloat(itemFormData.costPerUnit || '0'),
      supplier: itemFormData.supplier,
      location: itemFormData.location,
      barcode: itemFormData.barcode,
      usageInstructions: itemFormData.usageInstructions,
      expiryDate: itemFormData.expiryDate,
      lastMovement: new Date().toISOString(),
      isLowStock: parseFloat(itemFormData.currentStock) <= parseFloat(itemFormData.reorderThreshold || '0'),
      isExpiring: false, // Would calculate based on expiry date
      createdAt: selectedItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedItem) {
      setInventoryItems(prev => prev.map(item => item.id === selectedItem.id ? newItem : item));
    } else {
      setInventoryItems(prev => [...prev, newItem]);
    }

    setShowItemModal(false);
    Alert.alert('Success', 'Inventory item saved successfully');
  };

  const handleCreateMovement = () => {
    setMovementFormData({
      inventoryItemId: '',
      movementType: 'in',
      quantity: '',
      reason: '',
      operator: '',
      date: '',
      batchNumber: '',
      expiryDate: '',
      supplier: '',
      invoiceNumber: '',
      fieldId: '',
      cropId: '',
      cost: '',
      notes: '',
    });
    setSelectedMovement(null);
    setShowMovementModal(true);
  };

  const handleSaveMovement = () => {
    if (!movementFormData.inventoryItemId || !movementFormData.quantity || !movementFormData.reason) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const item = inventoryItems.find(i => i.id.toString() === movementFormData.inventoryItemId);
    if (!item) return;

    const newMovement: InventoryMovement = {
      id: selectedMovement?.id || Date.now(),
      inventoryItemId: parseInt(movementFormData.inventoryItemId),
      itemName: item.name,
      movementType: movementFormData.movementType as any,
      quantity: parseFloat(movementFormData.quantity),
      unit: item.unit,
      cost: parseFloat(movementFormData.cost) || undefined,
      reason: movementFormData.reason,
      operator: movementFormData.operator,
      date: movementFormData.date,
      batchNumber: movementFormData.batchNumber,
      expiryDate: movementFormData.expiryDate,
      supplier: movementFormData.supplier,
      invoiceNumber: movementFormData.invoiceNumber,
      fieldId: movementFormData.fieldId ? parseInt(movementFormData.fieldId) : undefined,
      fieldName: fields.find(f => f.id.toString() === movementFormData.fieldId)?.name,
      cropId: movementFormData.cropId ? parseInt(movementFormData.cropId) : undefined,
      cropName: crops.find(c => c.id.toString() === movementFormData.cropId)?.name,
      notes: movementFormData.notes,
      createdAt: selectedMovement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedMovement) {
      setMovements(prev => prev.map(m => m.id === selectedMovement.id ? newMovement : m));
    } else {
      setMovements(prev => [...prev, newMovement]);
    }

    // Update inventory item stock
    const quantity = parseFloat(movementFormData.quantity);
    const multiplier = movementFormData.movementType === 'in' ? 1 : -1;
    setInventoryItems(prev => prev.map(item => 
      item.id === parseInt(movementFormData.inventoryItemId)
        ? { 
            ...item, 
            currentStock: item.currentStock + (quantity * multiplier),
            totalValue: (item.currentStock + (quantity * multiplier)) * item.costPerUnit,
            lastMovement: new Date().toISOString(),
            isLowStock: (item.currentStock + (quantity * multiplier)) <= item.reorderThreshold,
            updatedAt: new Date().toISOString(),
          }
        : item
    ));

    setShowMovementModal(false);
    Alert.alert('Success', 'Inventory movement recorded successfully');
  };

  const getStockStatusColor = (item: InventoryItem) => {
    if (item.isExpiring) return theme.colors.error[500];
    if (item.isLowStock) return theme.colors.warning[500];
    return theme.colors.success[500];
  };

  const getStockStatusText = (item: InventoryItem) => {
    if (item.isExpiring) return 'Expiring Soon';
    if (item.isLowStock) return 'Low Stock';
    return 'In Stock';
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const calculateInventorySummary = () => {
    const totalItems = inventoryItems.length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = inventoryItems.filter(item => item.isLowStock).length;
    const expiringItems = inventoryItems.filter(item => item.isExpiring).length;

    return {
      totalItems,
      totalValue,
      lowStockItems,
      expiringItems,
    };
  };

  const renderOverview = () => {
    const summary = calculateInventorySummary();
    
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Inventory Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Package size={24} color={theme.colors.primary[500]} />
              <Text style={styles.summaryTitle}>Total Items</Text>
            </View>
            <Text style={styles.summaryValue}>{summary.totalItems}</Text>
            <Text style={styles.summaryChange}>Active inventory items</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <BarChart3 size={24} color={theme.colors.success[500]} />
              <Text style={styles.summaryTitle}>Total Value</Text>
            </View>
            <Text style={styles.summaryValue}>${summary.totalValue.toLocaleString()}</Text>
            <Text style={styles.summaryChange}>Current inventory value</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <TrendingDown size={24} color={theme.colors.warning[500]} />
              <Text style={styles.summaryTitle}>Low Stock</Text>
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.warning[500] }]}>
              {summary.lowStockItems}
            </Text>
            <Text style={styles.summaryChange}>Items need reordering</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <AlertTriangle size={24} color={theme.colors.error[500]} />
              <Text style={styles.summaryTitle}>Expiring Soon</Text>
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.error[500] }]}>
              {summary.expiringItems}
            </Text>
            <Text style={styles.summaryChange}>Items expiring soon</Text>
          </Card>
        </View>

        {/* Low Stock Alerts */}
        {summary.lowStockItems > 0 && (
          <Card style={styles.alertsCard}>
            <View style={styles.alertsHeader}>
              <AlertTriangle size={20} color={theme.colors.warning[500]} />
              <Text style={styles.alertsTitle}>Low Stock Alerts</Text>
            </View>
            {inventoryItems.filter(item => item.isLowStock).slice(0, 3).map(item => (
              <View key={item.id} style={styles.alertRow}>
                <Text style={styles.alertItemName}>{item.name}</Text>
                <Text style={styles.alertStock}>
                  {item.currentStock} {item.unit} (Reorder at {item.reorderThreshold} {item.unit})
                </Text>
              </View>
            ))}
            {summary.lowStockItems > 3 && (
              <TouchableOpacity style={styles.viewAllButton} onPress={() => setActiveTab('items')}>
                <Text style={styles.viewAllText}>View All Low Stock Items</Text>
              </TouchableOpacity>
            )}
          </Card>
        )}

        {/* Recent Movements */}
        <Card style={styles.recentMovements}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Movements</Text>
            <Button
              title="View All"
              onPress={() => setActiveTab('movements')}
              variant="ghost"
              size="sm"
            />
          </View>
          {movements.slice(0, 5).map(movement => (
            <View key={movement.id} style={styles.movementRow}>
              <View style={styles.movementInfo}>
                <Text style={styles.movementItem}>{movement.itemName}</Text>
                <Text style={styles.movementDate}>{movement.date}</Text>
              </View>
              <View style={styles.movementDetails}>
                <Text style={[
                  styles.movementQuantity,
                  { color: movement.movementType === 'in' ? theme.colors.success[500] : theme.colors.error[500] }
                ]}>
                  {movement.movementType === 'in' ? '+' : '-'}{movement.quantity} {movement.unit}
                </Text>
                <Text style={styles.movementType}>
                  {movement.movementType === 'in' ? 'Stock In' : 'Stock Out'}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    );
  };

  const renderItemCard = (item: InventoryItem) => (
    <Card key={item.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.subcategory}</Text>
        </View>
        <View style={styles.itemStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStockStatusColor(item) + '20' }]}>
            <Text style={[styles.statusText, { color: getStockStatusColor(item) }]}>
              {getStockStatusText(item)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Current Stock:</Text>
          <Text style={styles.detailValue}>{item.currentStock} {item.unit}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reorder Threshold:</Text>
          <Text style={styles.detailValue}>{item.reorderThreshold} {item.unit}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Value:</Text>
          <Text style={styles.detailValue}>${item.totalValue.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{item.location || 'Not specified'}</Text>
        </View>
      </View>

      <View style={styles.itemFooter}>
        <Button
          title="Edit"
          onPress={() => {
            setSelectedItem(item);
            setItemFormData({
              name: item.name,
              category: item.category,
              subcategory: item.subcategory,
              currentStock: item.currentStock.toString(),
              unit: item.unit,
              reorderThreshold: item.reorderThreshold.toString(),
              reorderQuantity: item.reorderQuantity.toString(),
              costPerUnit: item.costPerUnit.toString(),
              supplier: item.supplier || '',
              location: item.location || '',
              barcode: item.barcode || '',
              expiryDate: item.expiryDate || '',
              usageInstructions: item.usageInstructions || '',
            });
            setShowItemModal(true);
          }}
          variant="outline"
          size="sm"
        />
        <Button
          title="Add Stock"
          onPress={() => {
            setMovementFormData({
              inventoryItemId: item.id.toString(),
              movementType: 'in',
              quantity: '',
              reason: 'Stock replenishment',
              operator: '',
              date: new Date().toISOString().split('T')[0],
              batchNumber: '',
              expiryDate: '',
              supplier: '',
              invoiceNumber: '',
              fieldId: '',
              cropId: '',
              cost: '',
              notes: '',
            });
            setShowMovementModal(true);
          }}
          variant="ghost"
          size="sm"
          icon={<Plus size={16} color={theme.colors.primary[500]} />}
        />
        <Button
          title="Use Stock"
          onPress={() => {
            setMovementFormData({
              inventoryItemId: item.id.toString(),
              movementType: 'out',
              quantity: '',
              reason: 'Field application',
              operator: '',
              date: new Date().toISOString().split('T')[0],
              batchNumber: '',
              expiryDate: '',
              supplier: '',
              invoiceNumber: '',
              fieldId: '',
              cropId: '',
              cost: '',
              notes: '',
            });
            setShowMovementModal(true);
          }}
          variant="ghost"
          size="sm"
          icon={<Minus size={16} color={theme.colors.error[500]} />}
        />
      </View>
    </Card>
  );

  const renderMovementCard = (movement: InventoryMovement) => (
    <Card key={movement.id} style={styles.movementCard}>
      <View style={styles.movementHeader}>
        <View style={styles.movementInfo}>
          <Text style={styles.movementItem}>{movement.itemName}</Text>
          <Text style={styles.movementDate}>{movement.date}</Text>
        </View>
        <View style={styles.movementMeta}>
          <Text style={[
            styles.movementQuantity,
            { color: movement.movementType === 'in' ? theme.colors.success[500] : theme.colors.error[500] }
          ]}>
            {movement.movementType === 'in' ? '+' : '-'}{movement.quantity} {movement.unit}
          </Text>
          <View style={[
            styles.movementTypeBadge,
            { backgroundColor: movement.movementType === 'in' ? theme.colors.success[500] + '20' : theme.colors.error[500] + '20' }
          ]}>
            <Text style={[
              styles.movementTypeText,
              { color: movement.movementType === 'in' ? theme.colors.success[500] : theme.colors.error[500] }
            ]}>
              {movement.movementType === 'in' ? 'Stock In' : 'Stock Out'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.movementDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reason:</Text>
          <Text style={styles.detailValue}>{movement.reason}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Operator:</Text>
          <Text style={styles.detailValue}>{movement.operator}</Text>
        </View>
        {movement.cost && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cost:</Text>
            <Text style={styles.detailValue}>${movement.cost.toLocaleString()}</Text>
          </View>
        )}
        {movement.fieldName && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Field:</Text>
            <Text style={styles.detailValue}>{movement.fieldName}</Text>
          </View>
        )}
        {movement.batchNumber && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Batch:</Text>
            <Text style={styles.detailValue}>{movement.batchNumber}</Text>
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
        <Text style={styles.title}>Inventory Management</Text>
        <View style={styles.headerActions}>
          <Button
            title="New Item"
            onPress={handleCreateItem}
            icon={<Plus size={16} color={theme.colors.neutral[50]} />}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {renderTabButton('overview', 'Overview')}
        {renderTabButton('items', 'Items')}
        {renderTabButton('movements', 'Movements')}
        {renderTabButton('batches', 'Batches')}
        {renderTabButton('suppliers', 'Suppliers')}
        {renderTabButton('orders', 'Orders')}
      </ScrollView>

      <View style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        
        {activeTab === 'items' && (
          <View style={styles.itemsContainer}>
            <View style={styles.filtersContainer}>
              <View style={styles.searchContainer}>
                <Search size={20} color={theme.colors.neutral[500]} />
                <FormField
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search items..."
                  style={styles.searchInput}
                />
              </View>
              <Dropdown
                value={filterCategory}
                onValueChange={setFilterCategory}
                options={[
                  { label: 'All Categories', value: 'all' },
                  ...categories.map(c => ({ label: c.label, value: c.name }))
                ]}
                style={styles.filterDropdown}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredItems.length === 0 ? (
                <Card style={styles.emptyState}>
                  <Package size={48} color={theme.colors.neutral[400]} />
                  <Text style={styles.emptyStateText}>No inventory items found</Text>
                  <Text style={styles.emptyStateSubtext}>Add your first inventory item to get started</Text>
                  <Button
                    title="Add Item"
                    onPress={handleCreateItem}
                    style={styles.emptyStateButton}
                  />
                </Card>
              ) : (
                filteredItems.map(renderItemCard)
              )}
            </ScrollView>
          </View>
        )}

        {activeTab === 'movements' && (
          <View style={styles.movementsContainer}>
            <View style={styles.movementsHeader}>
              <Button
                title="Record Movement"
                onPress={handleCreateMovement}
                icon={<Plus size={16} color={theme.colors.neutral[50]} />}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {movements.length === 0 ? (
                <Card style={styles.emptyState}>
                  <BarChart3 size={48} color={theme.colors.neutral[400]} />
                  <Text style={styles.emptyStateText}>No movements recorded</Text>
                  <Text style={styles.emptyStateSubtext}>Record your first inventory movement</Text>
                  <Button
                    title="Record Movement"
                    onPress={handleCreateMovement}
                    style={styles.emptyStateButton}
                  />
                </Card>
              ) : (
                movements.map(renderMovementCard)
              )}
            </ScrollView>
          </View>
        )}

        {(activeTab === 'batches' || activeTab === 'suppliers' || activeTab === 'orders') && (
          <Card style={styles.comingSoonCard}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
            <Text style={styles.comingSoonSubtext}>
              {activeTab === 'batches' && 'Batch and lot tracking features'}
              {activeTab === 'suppliers' && 'Supplier management features'}
              {activeTab === 'orders' && 'Purchase order management features'}
            </Text>
          </Card>
        )}
      </View>

      {/* Add/Edit Item Modal */}
      <Modal visible={showItemModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedItem ? 'Edit Item' : 'Add Item'}
            </Text>
            <TouchableOpacity onPress={() => setShowItemModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <FormField
              label="Item Name"
              value={itemFormData.name}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, name: text }))}
              placeholder="e.g., Organic Compost"
              required
            />

            <Dropdown
              label="Category"
              value={itemFormData.category}
              onValueChange={(value) => setItemFormData(prev => ({ ...prev, category: value, subcategory: '' }))}
              options={categories.map(c => ({ label: c.label, value: c.name }))}
              required
            />

            <Dropdown
              label="Subcategory"
              value={itemFormData.subcategory}
              onValueChange={(value) => setItemFormData(prev => ({ ...prev, subcategory: value }))}
              options={
                categories
                  .find(c => c.name === itemFormData.category)
                  ?.subcategories.map(s => ({ label: s, value: s })) || []
              }
              placeholder="Select subcategory"
              disabled={!itemFormData.category}
            />

            <FormField
              label="Current Stock"
              value={itemFormData.currentStock}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, currentStock: text }))}
              placeholder="0"
              keyboardType="numeric"
              required
            />

            <Dropdown
              label="Unit"
              value={itemFormData.unit}
              onValueChange={(value) => setItemFormData(prev => ({ ...prev, unit: value }))}
              options={units.map(u => ({ label: u, value: u }))}
              placeholder="Select unit"
              required
            />

            <FormField
              label="Reorder Threshold"
              value={itemFormData.reorderThreshold}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, reorderThreshold: text }))}
              placeholder="0"
              keyboardType="numeric"
            />

            <FormField
              label="Reorder Quantity"
              value={itemFormData.reorderQuantity}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, reorderQuantity: text }))}
              placeholder="0"
              keyboardType="numeric"
            />

            <FormField
              label="Cost Per Unit"
              value={itemFormData.costPerUnit}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, costPerUnit: text }))}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <FormField
              label="Supplier"
              value={itemFormData.supplier}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, supplier: text }))}
              placeholder="Supplier name"
            />

            <FormField
              label="Location"
              value={itemFormData.location}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, location: text }))}
              placeholder="Storage location"
            />

            <FormField
              label="Barcode"
              value={itemFormData.barcode}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, barcode: text }))}
              placeholder="Barcode/SKU"
            />

            <FormField
              label="Expiry Date"
              value={itemFormData.expiryDate}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, expiryDate: text }))}
              placeholder="YYYY-MM-DD"
            />

            <FormField
              label="Usage Instructions"
              value={itemFormData.usageInstructions}
              onChangeText={(text) => setItemFormData(prev => ({ ...prev, usageInstructions: text }))}
              placeholder="How to use this item"
              multiline
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowItemModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Save Item"
              onPress={handleSaveItem}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Add Movement Modal */}
      <Modal visible={showMovementModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Record Movement</Text>
            <TouchableOpacity onPress={() => setShowMovementModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Dropdown
              label="Item"
              value={movementFormData.inventoryItemId}
              onValueChange={(value) => setMovementFormData(prev => ({ ...prev, inventoryItemId: value }))}
              options={inventoryItems.map(item => ({ label: item.name, value: item.id.toString() }))}
              placeholder="Select item"
              required
            />

            <Dropdown
              label="Movement Type"
              value={movementFormData.movementType}
              onValueChange={(value) => setMovementFormData(prev => ({ ...prev, movementType: value }))}
              options={[
                { label: 'Stock In', value: 'in' },
                { label: 'Stock Out', value: 'out' },
                { label: 'Adjustment', value: 'adjustment' },
              ]}
              required
            />

            <FormField
              label="Quantity"
              value={movementFormData.quantity}
              onChangeText={(text) => setMovementFormData(prev => ({ ...prev, quantity: text }))}
              placeholder="0"
              keyboardType="numeric"
              required
            />

            <FormField
              label="Reason"
              value={movementFormData.reason}
              onChangeText={(text) => setMovementFormData(prev => ({ ...prev, reason: text }))}
              placeholder="Reason for movement"
              required
            />

            <FormField
              label="Operator"
              value={movementFormData.operator}
              onChangeText={(text) => setMovementFormData(prev => ({ ...prev, operator: text }))}
              placeholder="Person responsible"
            />

            <FormField
              label="Date"
              value={movementFormData.date}
              onChangeText={(text) => setMovementFormData(prev => ({ ...prev, date: text }))}
              placeholder="YYYY-MM-DD"
            />

            {movementFormData.movementType === 'in' && (
              <>
                <FormField
                  label="Batch Number"
                  value={movementFormData.batchNumber}
                  onChangeText={(text) => setMovementFormData(prev => ({ ...prev, batchNumber: text }))}
                  placeholder="Batch/Lot number"
                />

                <FormField
                  label="Supplier"
                  value={movementFormData.supplier}
                  onChangeText={(text) => setMovementFormData(prev => ({ ...prev, supplier: text }))}
                  placeholder="Supplier name"
                />

                <FormField
                  label="Invoice Number"
                  value={movementFormData.invoiceNumber}
                  onChangeText={(text) => setMovementFormData(prev => ({ ...prev, invoiceNumber: text }))}
                  placeholder="Invoice/Receipt number"
                />
              </>
            )}

            {movementFormData.movementType === 'out' && (
              <>
                <Dropdown
                  label="Field (Optional)"
                  value={movementFormData.fieldId}
                  onValueChange={(value) => setMovementFormData(prev => ({ ...prev, fieldId: value }))}
                  options={fields.map(f => ({ label: f.name, value: f.id.toString() }))}
                  placeholder="Select field"
                />

                {movementFormData.fieldId && (
                  <Dropdown
                    label="Crop (Optional)"
                    value={movementFormData.cropId}
                    onValueChange={(value) => setMovementFormData(prev => ({ ...prev, cropId: value }))}
                    options={crops
                      .filter(c => c.fieldId.toString() === movementFormData.fieldId)
                      .map(c => ({ label: c.name, value: c.id.toString() }))}
                    placeholder="Select crop"
                  />
                )}
              </>
            )}

            <FormField
              label="Cost"
              value={movementFormData.cost}
              onChangeText={(text) => setMovementFormData(prev => ({ ...prev, cost: text }))}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <FormField
              label="Notes"
              value={movementFormData.notes}
              onChangeText={(text) => setMovementFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Additional notes"
              multiline
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowMovementModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Record Movement"
              onPress={handleSaveMovement}
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
    backgroundColor: theme.colors.warning[50],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning[500],
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  alertsTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.warning[700],
    marginLeft: theme.spacing[2],
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.warning[200],
  },
  alertItemName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.warning[700],
    flex: 1,
  },
  alertStock: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.warning[600],
  },
  viewAllButton: {
    marginTop: theme.spacing[2],
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.warning[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  recentMovements: {
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
  movementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  movementInfo: {
    flex: 1,
  },
  movementItem: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  movementDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  movementDetails: {
    alignItems: 'flex-end',
  },
  movementQuantity: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing[1],
  },
  movementType: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  itemsContainer: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing[2],
  },
  filterDropdown: {
    minWidth: 150,
  },
  itemCard: {
    marginBottom: theme.spacing[3],
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  itemCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  itemStatus: {
    alignItems: 'flex-end',
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
  itemDetails: {
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
  itemFooter: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  movementsContainer: {
    flex: 1,
  },
  movementsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing[4],
  },
  movementCard: {
    marginBottom: theme.spacing[3],
  },
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  movementMeta: {
    alignItems: 'flex-end',
  },
  movementTypeBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
    marginTop: theme.spacing[1],
  },
  movementTypeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  movementDetails: {
    marginTop: theme.spacing[2],
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