import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

interface AIInsightsPanelProps {
  insights: string | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function AIInsightsPanel({ insights, loading, onRefresh }: AIInsightsPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Insights</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <RefreshCw size={18} color="#10B981" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color="#10B981" />
      ) : (
        <Text style={styles.insightsText}>{insights || 'No insights available yet.'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  refreshButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  insightsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
});