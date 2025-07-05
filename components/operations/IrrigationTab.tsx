import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface IrrigationTabProps {
  operationsData: any;
}

export default function IrrigationTab({ operationsData }: IrrigationTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIrrigation, setEditingIrrigation] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    fieldId: '',
    duration: '',
    waterApplied: '',
    soilMoisture: '',
    cost: '',
    operator: '',
    method: '',
    flowRate: '',
    pressure: '',
    weatherConditions: '',
  });

  const { irrigations, fields, addIrrigation, updateIrrigation, deleteIrrigation } = operationsData;

  const resetForm = () => {
    setFormData({
      date: '',
      fieldId: '',
      duration: '',
      waterApplied: '',
      soilMoisture: '',
      cost: '',
      operator: '',
      method: '',
      flowRate: '',
      pressure: '',
      weatherConditions: '',
    });
    setEditingIrrigation(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (irrigation: any) => {
    setFormData({
      date: irrigation.date,
      fieldId: irrigation.fieldId?.toString() || '',
      duration: irrigation.duration?.toString() || '',
      waterApplied: irrigation.waterApplied?.toString() || '',
      soilMoisture: irrigation.soilMoisture,
      cost: irrigation.cost?.toString() || '',
      operator: irrigation.operator,
      method: irrigation.method,
      flowRate: irrigation.flowRate?.toString() || '',
      pressure: irrigation.pressure?.toString() || '',
      weatherConditions: irrigation.weatherConditions || '',
    });
    setEditingIrrigation(irrigation);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Irrigation',
      'Are you sure you want to delete this irrigation record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteIrrigation(id);
            if (result) {
              Alert.alert('Success', 'Irrigation deleted successfully');
            }
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.date || !formData.fieldId || !formData.duration || !formData.operator) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const irrigationData = {
      date: formData.date,
      fieldId: parseInt(formData.fieldId),
      duration: formData.duration ? parseFloat(formData.duration) : 0,
      waterApplied: formData.waterApplied ? parseFloat(formData.waterApplied) : 0,
      soilMoisture: formData.soilMoisture,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
      operator: formData.operator,
      method: formData.method,
      flowRate: formData.flowRate ? parseFloat(formData.flowRate) : undefined,
      pressure: formData.pressure ? parseFloat(formData.pressure) : undefined,
      weatherConditions: formData.weatherConditions,
    };

    let result;
    if (editingIrrigation) {
      result = await updateIrrigation(editingIrrigation.id, irrigationData);
    } else {
      result = await addIrrigation(irrigationData);
    }

    if (result) {
      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', `Irrigation ${editingIrrigation ? 'updated' : 'added'} successfully`);
    }
  };

  const fieldOptions = fields.map((field: any) => ({ 
    label: `${field.name} (${field.farmName})`, 
    value: field.id.toString() 
  }));

  const methodOptions = [
    { label: 'Pivot', value: 'Pivot' },
    { label: 'Drip', value: 'Drip' },
    { label: 'Sprinkler', value: 'Sprinkler' },
    { label: 'Flood', value: 'Flood' },
    { label: 'Furrow', value: 'Furrow' },
    { label: 'Micro-spray', value: 'Micro-spray' },
  ];

  const soilMoistureOptions = [
    { label: 'Dry', value: 'Dry' },
    { label: 'Adequate', value: 'Adequate' },
    { label: 'Moist', value: 'Moist' },
    { label: 'Saturated', value: 'Saturated' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Irrigation</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Irrigation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Date</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Field</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Duration</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Water Applied</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Method</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Actions</Text>
          </View>

          {irrigations.map((irrigation: any) => (
            <View key={irrigation.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{irrigation.date}</Text>
              <Text style={styles.tableCell}>{irrigation.fieldName}</Text>
              <Text style={styles.tableCell}>{irrigation.duration} hrs</Text>
              <Text style={styles.tableCell}>{irrigation.waterApplied} mm</Text>
              <Text style={styles.tableCell}>{irrigation.method}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEdit(irrigation)}
                >
                  <Edit3 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDelete(irrigation.id)}
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
                {editingIrrigation ? 'Edit Irrigation' : 'Add Irrigation'}
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

              <FormField
                label="Duration (hours)"
                value={formData.duration}
                onChangeText={(text) => setFormData({ ...formData, duration: text })}
                placeholder="Enter duration in hours"
                keyboardType="numeric"
                required
              />

              <FormField
                label="Water Applied (mm)"
                value={formData.waterApplied}
                onChangeText={(text) => setFormData({ ...formData, waterApplied: text })}
                placeholder="Enter water applied in mm"
                keyboardType="numeric"
                required
              />

              <Dropdown
                label="Irrigation Method"
                options={methodOptions}
                value={formData.method}
                onSelect={(value) => setFormData({ ...formData, method: value })}
                placeholder="Select irrigation method"
                required
              />

              <Dropdown
                label="Soil Moisture"
                options={soilMoistureOptions}
                value={formData.soilMoisture}
                onSelect={(value) => setFormData({ ...formData, soilMoisture: value })}
                placeholder="Select soil moisture level"
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
                label="Flow Rate (L/min)"
                value={formData.flowRate}
                onChangeText={(text) => setFormData({ ...formData, flowRate: text })}
                placeholder="Enter flow rate"
                keyboardType="numeric"
              />

              <FormField
                label="Pressure (bar)"
                value={formData.pressure}
                onChangeText={(text) => setFormData({ ...formData, pressure: text })}
                placeholder="Enter pressure"
                keyboardType="numeric"
              />

              <FormField
                label="Cost"
                value={formData.cost}
                onChangeText={(text) => setFormData({ ...formData, cost: text })}
                placeholder="Enter total cost"
                keyboardType="numeric"
              />

              <FormField
                label="Weather Conditions"
                value={formData.weatherConditions}
                onChangeText={(text) => setFormData({ ...formData, weatherConditions: text })}
                placeholder="Enter weather conditions"
                multiline
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
                  {editingIrrigation ? 'Update' : 'Save'}
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