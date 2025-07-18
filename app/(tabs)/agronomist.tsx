import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Sprout, TestTube, Droplets, Leaf } from 'lucide-react-native';
import CropPlanningInterface from '@/components/agronomist/CropPlanningInterface';
import SoilHealthInterface from '@/components/agronomist/SoilHealthInterface';
import IrrigationManagementInterface from '@/components/agronomist/IrrigationManagementInterface';

const agronomistTabs = [
  { id: 'crop-planning', title: 'Crop Planning', icon: 'sprout' },
  { id: 'soil-health', title: 'Soil Health', icon: 'testTube' },
  { id: 'irrigation', title: 'Irrigation', icon: 'droplets' },
];

export default function Agronomist() {
  const [activeTab, setActiveTab] = useState('crop-planning');

  const renderTabButton = (tab: any) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab.id)}
    >
      <View style={styles.tabIcon}>
        {tab.icon === 'sprout' && <Sprout size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'testTube' && <TestTube size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
        {tab.icon === 'droplets' && <Droplets size={18} color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} />}
      </View>
      <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'crop-planning':
        return <CropPlanningInterface />;
      case 'soil-health':
        return <SoilHealthInterface />;
      case 'irrigation':
        return <IrrigationManagementInterface />;
      default:
        return <CropPlanningInterface />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Leaf size={24} color="#10B981" />
          <Text style={styles.headerTitle}>Agronomist Tools</Text>
        </View>
        <Text style={styles.headerSubtitle}>Advanced crop and soil management</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {agronomistTabs.map(renderTabButton)}
      </ScrollView>

      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 32,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 12,
    minWidth: 120,
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});