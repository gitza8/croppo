import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface FarmsFieldsCropsTabProps {
  operationsData: any;
}

export default function FarmsFieldsCropsTab({ operationsData }: FarmsFieldsCropsTabProps) {
  const [subTab, setSubTab] = useState('farms');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    location: '',
    farmId: '',
    fieldId: '',
    variety: '',
    soilType: '',
    crop: '',
  });

  const { farms, fields, crops, addFarm, addField } = operationsData;

  const handleAddFarm = async () => {
    if (!formData.name || !formData.area || !formData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const result = await addFarm({
      name: formData.name,
      area: parseFloat(formData.area),
      location: formData.location,
    });

    if (result) {
      setShowAddModal(false);
      setFormData({ name: '', area: '', location: '', farmId: '', fieldId: '', variety: '', soilType: '', crop: '' });
      Alert.alert('Success', 'Farm added successfully');
    }
  };

  const handleAddField = async () => {
    if (!formData.name || !formData.farmId || !formData.area) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const result = await addField({
      name: formData.name,
      farmId: parseInt(formData.farmId),
      area: parseFloat(formData.area),
      soilType: formData.soilType,
      crop: formData.crop,
    });

    if (result) {
      setShowAddModal(false);
      setFormData({ name: '', area: '', location: '', farmId: '', fieldId: '', variety: '', soilType: '', crop: '' });
      Alert.alert('Success', 'Field added successfully');
    }
  };

  const farmOptions = farms.map((farm: any) => ({ label: farm.name, value: farm.id.toString() }));

  return (
    <View style={styles.contentContainer}>
      <View style={styles.subTabContainer}>
        {['farms', 'fields', 'crops'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.subTabButton, subTab === tab && styles.subTabButtonActive]}
            onPress={() => setSubTab(tab)}
          >
            <Text style={[styles.subTabText, subTab === tab && styles.subTabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>
          {subTab === 'farms' ? 'Farms' : subTab === 'fields' ? 'Fields' : 'Crops'}
        </Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>
            Add {subTab.slice(0, -1)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Name</Text>
          {subTab === 'farms' && <Text style={[styles.tableCell, styles.tableCellHeader]}>Location</Text>}
          {subTab === 'fields' && <Text style={[styles.tableCell, styles.tableCellHeader]}>Farm</Text>}
          {subTab === 'crops' && <Text style={[styles.tableCell, styles.tableCellHeader]}>Field</Text>}
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Area</Text>
          <Text style={[styles.tableCell, styles.tableCellHeader]}>Actions</Text>
        </View>

        {subTab === 'farms' && farms.map((farm: any) => (
          <View key={farm.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{farm.name}</Text>
            <Text style={styles.tableCell}>{farm.location}</Text>
            <Text style={styles.tableCell}>{farm.area} ha</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Edit3 size={16} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {subTab === 'fields' && fields.map((field: any) => (
          <View key={field.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{field.name}</Text>
            <Text style={styles.tableCell}>{field.farmName}</Text>
            <Text style={styles.tableCell}>{field.area} ha</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Edit3 size={16} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {subTab === 'crops' && crops.map((crop: any) => (
          <View key={crop.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{crop.name}</Text>
            <Text style={styles.tableCell}>{crop.fieldName}</Text>
            <Text style={styles.tableCell}>{crop.variety}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Edit3 size={16} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Add {subTab === 'farms' ? 'Farm' : subTab === 'fields' ? 'Field' : 'Crop'}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <FormField
              label="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder={`Enter ${subTab.slice(0, -1)} name`}
              required
            />

            {subTab === 'farms' && (
              <>
                <FormField
                  label="Location"
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  placeholder="Enter location"
                  required
                />
                <FormField
                  label="Area (hectares)"
                  value={formData.area}
                  onChangeText={(text) => setFormData({ ...formData, area: text })}
                  placeholder="Enter area in hectares"
                  keyboardType="numeric"
                  required
                />
              </>
            )}

            {subTab === 'fields' && (
              <>
                <Dropdown
                  label="Farm"
                  options={farmOptions}
                  value={formData.farmId}
                  onSelect={(value) => setFormData({ ...formData, farmId: value })}
                  placeholder="Select farm"
                  required
                />
                <FormField
                  label="Area (hectares)"
                  value={formData.area}
                  onChangeText={(text) => setFormData({ ...formData, area: text })}
                  placeholder="Enter area in hectares"
                  keyboardType="numeric"
                  required
                />
                <FormField
                  label="Soil Type"
                  value={formData.soilType}
                  onChangeText={(text) => setFormData({ ...formData, soilType: text })}
                  placeholder="Enter soil type"
                />
              </>
            )}

            {subTab === 'crops' && (
              <>
                <Dropdown
                  label="Field"
                  options={fields.map((field: any) => ({ label: field.name, value: field.id.toString() }))}
                  value={formData.fieldId}
                  onSelect={(value) => setFormData({ ...formData, fieldId: value })}
                  placeholder="Select field"
                  required
                />
                <FormField
                  label="Variety"
                  value={formData.variety}
                  onChangeText={(text) => setFormData({ ...formData, variety: text })}
                  placeholder="Enter crop variety"
                  required
                />
              </>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={subTab === 'farms' ? handleAddFarm : subTab === 'fields' ? handleAddField : () => {}}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  subTabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  subTabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  subTabTextActive: {
    color: '#111827',
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