import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar, CircleCheck as CheckCircle, Clock, TrendingUp, TriangleAlert as AlertTriangle, Users } from 'lucide-react-native';
import { useOperations } from '@/hooks/useOperations';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const operationsData = useOperations();

  const { 
    farms, 
    fields, 
    tasks, 
    plantings, 
    harvests, 
    treatments, 
    fertilizations, 
    irrigations,
    getOverdueTasks,
    getTasksByStatus 
  } = operationsData;

  // Calculate summary data from actual operations
  const summaryData = [
    { 
      title: 'Active Fields', 
      value: fields.length.toString(), 
      icon: 'field', 
      color: '#10B981' 
    },
    { 
      title: 'Pending Tasks', 
      value: getTasksByStatus('To Do').length.toString(), 
      icon: 'tasks', 
      color: '#F59E0B' 
    },
    { 
      title: 'Recent Operations', 
      value: (plantings.length + harvests.length + treatments.length + fertilizations.length + irrigations.length).toString(), 
      icon: 'operations', 
      color: '#3B82F6' 
    },
    { 
      title: 'Overdue Tasks', 
      value: getOverdueTasks().length.toString(), 
      icon: 'inventory', 
      color: '#EF4444' 
    },
  ];

  // Get recent tasks
  const upcomingTasks = tasks.slice(0, 4);

  // Get recent activities from all operations
  const recentActivities = [
    ...plantings.map(p => ({ 
      id: `planting-${p.id}`, 
      activity: `Planted ${p.cropName} in ${p.fieldName}`, 
      time: p.date, 
      type: 'planting' 
    })),
    ...harvests.map(h => ({ 
      id: `harvest-${h.id}`, 
      activity: `Harvested ${h.cropName} from ${h.fieldName}`, 
      time: h.date, 
      type: 'harvest' 
    })),
    ...treatments.map(t => ({ 
      id: `treatment-${t.id}`, 
      activity: `Applied ${t.productName} to ${t.fieldName}`, 
      time: t.date, 
      type: 'treatment' 
    })),
    ...fertilizations.map(f => ({ 
      id: `fertilization-${f.id}`, 
      activity: `Applied ${f.productName} to ${f.fieldName}`, 
      time: f.date, 
      type: 'fertilization' 
    })),
    ...irrigations.map(i => ({ 
      id: `irrigation-${i.id}`, 
      activity: `Irrigated ${i.fieldName} for ${i.duration} hours`, 
      time: i.date, 
      type: 'irrigation' 
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

  const renderSummaryCard = (item: any, index: number) => (
    <View key={index} style={styles.summaryCard}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        {item.icon === 'field' && <Calendar size={24} color={item.color} />}
        {item.icon === 'tasks' && <Clock size={24} color={item.color} />}
        {item.icon === 'operations' && <CheckCircle size={24} color={item.color} />}
        {item.icon === 'inventory' && <AlertTriangle size={24} color={item.color} />}
      </View>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryValue}>{item.value}</Text>
        <Text style={styles.summaryTitle}>{item.title}</Text>
      </View>
    </View>
  );

  const renderTaskRow = (task: any) => (
    <View key={task.id} style={styles.taskRow}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDate}>{task.dueDate}</Text>
      </View>
      <View style={styles.taskMeta}>
        <View style={styles.operatorContainer}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.operatorText}>{task.assignee}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>{task.status}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>{task.priority}</Text>
        </View>
      </View>
    </View>
  );

  const renderActivityRow = (activity: any) => (
    <View key={activity.id} style={styles.activityRow}>
      <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) + '20' }]}>
        <CheckCircle size={16} color={getActivityColor(activity.type)} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{activity.activity}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Farm Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back! Here's your farm overview</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          {summaryData.map((item, index) => renderSummaryCard(item, index))}
        </View>

        {/* Charts Section */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Farm Analytics</Text>
            <View style={styles.periodSelector}>
              {['week', 'month', 'year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive
                  ]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={48} color="#10B981" />
            <Text style={styles.chartPlaceholderText}>Operations Trend</Text>
            <Text style={styles.chartPlaceholderSubtext}>
              {summaryData[2].value} operations this {selectedPeriod}
            </Text>
          </View>
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          {upcomingTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tasks created yet</Text>
              <Text style={styles.emptyStateSubtext}>Create tasks in the Operations tab</Text>
            </View>
          ) : (
            <View style={styles.taskContainer}>
              {upcomingTasks.map(renderTaskRow)}
            </View>
          )}
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {recentActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No activities yet</Text>
              <Text style={styles.emptyStateSubtext}>Start adding operations to see activities</Text>
            </View>
          ) : (
            <View style={styles.activityContainer}>
              {recentActivities.map(renderActivityRow)}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'To Do': return '#F59E0B';
    case 'In Progress': return '#3B82F6';
    case 'Done': return '#10B981';
    default: return '#6B7280';
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'High': return '#EF4444';
    case 'Medium': return '#F59E0B';
    case 'Low': return '#10B981';
    default: return '#6B7280';
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'planting': return '#10B981';
    case 'harvest': return '#F59E0B';
    case 'treatment': return '#EF4444';
    case 'fertilization': return '#3B82F6';
    case 'irrigation': return '#06B6D4';
    default: return '#6B7280';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  chartSection: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#10B981',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
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
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  taskContainer: {
    marginTop: 16,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  taskDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  taskMeta: {
    alignItems: 'flex-end',
  },
  operatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  operatorText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activityContainer: {
    marginTop: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});