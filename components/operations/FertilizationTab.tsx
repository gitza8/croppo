import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface FertilizationTabProps {
  operationsData: any;
}

export default function FertilizationTab({ operationsData }: FertilizationTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFertilization, setEditingFertilization] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    fieldId: '',
    cropId: '',
    productName: '',
    rate: '',
    unit: '',
    npkRatio: '',
    cost: '',
    operator: '',
    quantityUsed: '',
    applicationMethod: '',
  });

  const { fertilizations, fields, crops, addFertilization, updateFertilization, deleteFertilization } = operationsData;

  const resetForm = () => {
    setFormData({
      date: '',
      fieldId: '',
      cropId: '',
      productName: '',
      rate: '',
      unit: '',
      npkRatio: '',
      cost: '',
      operator: '',
      quantityUsed: '',
      applicationMethod: '',
    });
    setEditingFertilization(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (fertilization: any) => {
    setFormData({
      date: fertilization.date,
      fieldId: fertilization.fieldId?.toString() || '',
      cropId: fertilization.cropId?.toString() || '',
      productName: fertilization.productName,
      rate: fertilization.rate?.toString() || '',
      unit: fertilization.unit,
      npkRatio: fertilization.npkRatio,
      cost: fertilization.cost?.toString() || '',
      operator: fertilization.operator,
      quantityUsed: fertilization.quantityUsed?.toString() || '',
      applicationMethod: fertilization.applicationMethod || '',
    });
    setEditingFertilization(fertilization);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Fertilization',
      'Are you sure you want to delete this fertilization record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteFertilization(id);
            if (result) {
              Alert.alert('Success', 'Fertilization deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.date || !formData.fieldId || !formData.productName || !formData.operator) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const fertilizationData = {
      date: formData.date,
      fieldId: parseInt(formData.fieldId),
      cropId: formData.cropId ? parseInt(formData.cropId) : undefined,
      productId: 1, // This would come from inventory
      productName: formData.productName,
      rate: formData.rate ? parseFloat(formData.rate) : 0,
      unit: formData.unit,
      npkRatio: formData.npkRatio,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
      operator: formData.operator,
      quantityUsed: formData.quantityUsed ? parseFloat(formData.quantityUsed) : 0,
      applicationMethod: formData.applicationMethod,
      attachments: [],
    };

    let result;
    if (editingFertilization) {
      result = await updateFertilization(editingFertilization.id, fertilizationData);
    } else {
      result = await addFertilization(fertilizationData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `Fertilization ${editingFertilization ? 'updated' : 'added'} successfully`);
    }
  };

  const fieldOptions = fields.map((field: any) => ({ 
    label: `${field.name} (${field.farmName})`, 
    value: field.id.toString() 
  }));

  const cropOptions = crops.map((crop: any) => ({ 
    label: `${crop.name} - ${crop.variety}`, 
    value: crop.id.toString() 
  }));

  const methodOptions = [
    { label: 'Broadcast', value: 'Broadcast' },
    { label: 'Band Application', value: 'Band Application' },
    { label: 'Foliar Spray', value: 'Foliar Spray' },
    { label: 'Fertigation', value: 'Fertigation' },
    { label: 'Side Dress', value: 'Side Dress' },
  ];

  const unitOptions = [
    { label: 'kg/ha', value: 'kg/ha' },
    { label: 'L/ha', value: 'L/ha' },
    { label: 'g/ha', value: 'g/ha' },
    { label: 'mL/ha', value: 'mL/ha' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Fertilization</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Fertilization</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Field</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Product</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>NPK Ratio</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Rate</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Actions</Text>
          </View>

          {fertilizations.map((fertilization: any) => (
            <View key={fertilization.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{fertilization.date}</Text>
              <Text style={styles.tableCell}>{fertilization.fieldName}</Text>
              <Text style={styles.tableCell}>{fertilization.productName}</Text>
              <Text style={styles.tableCell}>{fertilization.npkRatio}</Text>
              <Text style={styles.tableCell}>{fertilization.rate} {fertilization.unit}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEdit(fertilization)}
                >
                  <Edit3 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDelete(fertilization.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add/Edit Modal */}
        <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFertilization ? 'Edit Fertilization' : 'Add Fertilization'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <FormField
                label="Date"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                required
              />

              <Dropdown
                label="Field"
                options={fieldOptions}
                value={formData.fieldId}
                onSelect={(value) => setFormData({ ...formData, fieldId: value })}
                placeholder="Select field"
                required
              />

              <Dropdown
                label="Crop"
                options={cropOptions}
                value={formData.cropId}
                onSelect={(value) => setFormData({ ...formData, cropId: value })}
                placeholder="Select crop"
              />

              <FormField
                label="Product Name"
                value={formData.productName}
                onChangeText={(text) => setFormData({ ...formData, productName: text })}
                placeholder="Enter fertilizer product name"
                required
              />

              <FormField
                label="NPK Ratio"
                value={formData.npkRatio}
                onChangeText={(text) => setFormData({ ...formData, npkRatio: text })}
                placeholder="e.g., 20-10-10"
                required
              />

              <FormField
                label="Rate"
                value={formData.rate}
                onChangeText={(text) => setFormData({ ...formData, rate: text })}
                placeholder="Enter application rate"
                keyboardType="numeric"
                required
              />

              <Dropdown
                label="Unit"
                options={unitOptions}
                value={formData.unit}
                onSelect={(value) => setFormData({ ...formData, unit: value })}
                placeholder="Select unit"
                required
              />

              <Dropdown
                label="Application Method"
                options={methodOptions}
                value={formData.applicationMethod}
                onSelect={(value) => setFormData({ ...formData, applicationMethod: value })}
                placeholder="Select application method"
                required
              />

              <FormField
                label="Operator"
                value={formData.operator}
                onChangeText={(text) => setFormData({ ...formData, operator: text })}
                placeholder="Enter operator name"
                required
              />

              <FormField
                label="Quantity Used"
                value={formData.quantityUsed}
                onChangeText={(text) => setFormData({ ...formData, quantityUsed: text })}
                placeholder="Enter total quantity used"
                keyboardType="numeric"
              />

              <FormField
                label="Cost"
                value={formData.cost}
                onChangeText={(text) => setFormData({ ...formData, cost: text })}
                placeholder="Enter total cost"
                keyboardType="numeric"
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {editingFertilization ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tableHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  tableCellHeader: {
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#F9FAFB',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});