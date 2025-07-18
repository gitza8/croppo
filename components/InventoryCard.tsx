import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package, TriangleAlert as AlertTriangle, TrendingDown } from 'lucide-react-native';
import { colors, typography, spacing, radii } from './designSystem';

interface InventoryCardProps {
  item: {
    id: number;
    name: string;
    category: string;
    stock: number;
    unit: string;
    minStock: number;
    status: string;
    costPerUnit: number;
    totalValue: number;
    supplier: string;
    location: string;
    expiryDate?: string;
  };
  onPress?: () => void;
}

export default function InventoryCard({ item, onPress }: InventoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return '#10B981';
      case 'Low': return '#F59E0B';
      case 'Critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good': return <Package size={20} color="#10B981" />;
      case 'Low': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'Critical': return <TrendingDown size={20} color="#EF4444" />;
      default: return <Package size={20} color="#6B7280" />;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {getStatusIcon(item.status)}
          <View style={styles.titleText}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.stockInfo}>
        <View style={styles.stockContainer}>
          <Text style={styles.stockValue}>{item.stock}</Text>
          <Text style={styles.stockUnit}>{item.unit}</Text>
        </View>
        <Text style={styles.minStock}>Min: {item.minStock} {item.unit}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Value:</Text>
          <Text style={styles.detailValue}>${item.totalValue.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Unit Cost:</Text>
          <Text style={styles.detailValue}>${item.costPerUnit}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Supplier:</Text>
          <Text style={styles.detailValue}>{item.supplier}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>📍 {item.location}</Text>
        </View>
        {item.expiryDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expires:</Text>
            <Text style={styles.detailValue}>{item.expiryDate}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: typography.fontSize.xs,
    color: colors.subtitle,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radii.md,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stockValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  stockUnit: {
    fontSize: typography.fontSize.sm,
    color: colors.subtitle,
    marginLeft: spacing.xs,
  },
  minStock: {
    fontSize: typography.fontSize.xs,
    color: colors.subtitle,
  },
  details: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.subtitle,
  },
  detailValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    color: colors.text,
  },
});