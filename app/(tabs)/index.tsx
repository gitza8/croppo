import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar, CircleCheck as CheckCircle, Clock, TrendingUp, TriangleAlert as AlertTriangle, Users } from 'lucide-react-native';

const summaryData = [
  { title: 'Active Fields', value: '12', icon: 'field', color: '#10B981' },
  { title: 'Pending Tasks', value: '8', icon: 'tasks', color: '#F59E0B' },
  { title: 'Recent Operations', value: '24', icon: 'operations', color: '#3B82F6' },
  { title: 'Low Stock Items', value: '3', icon: 'inventory', color: '#EF4444' },
];

const upcomingTasks = [
  { id: 1, task: 'Fertilize Field A', dueDate: '2025-01-15', operator: 'John Smith', status: 'Pending', priority: 'High' },
  { id: 2, task: 'Harvest Tomatoes', dueDate: '2025-01-16', operator: 'Sarah Johnson', status: 'In Progress', priority: 'Medium' },
  { id: 3, task: 'Irrigation Check', dueDate: '2025-01-17', operator: 'Mike Davis', status: 'Pending', priority: 'Low' },
  { id: 4, task: 'Pest Control Spray', dueDate: '2025-01-18', operator: 'Lisa Wilson', status: 'Pending', priority: 'High' },
];

const recentActivities = [
  { id: 1, activity: 'Fertilizer applied to Field B', time: '2 hours ago', type: 'fertilization' },
  { id: 2, activity: 'Inventory updated: Pesticide A', time: '4 hours ago', type: 'inventory' },
  { id: 3, activity: 'Task completed: Watering System', time: '6 hours ago', type: 'task' },
  { id: 4, activity: 'New invoice created', time: '8 hours ago', type: 'finance' },
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

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
        <Text style={styles.taskTitle}>{task.task}</Text>
        <Text style={styles.taskDate}>{task.dueDate}</Text>
      </View>
      <View style={styles.taskMeta}>
        <View style={styles.operatorContainer}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.operatorText}>{task.operator}</Text>
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
            <Text style={styles.chartPlaceholderSubtext}>24 operations this {selectedPeriod}</Text>
          </View>
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          <View style={styles.taskContainer}>
            {upcomingTasks.map(renderTaskRow)}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activityContainer}>
            {recentActivities.map(renderActivityRow)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending': return '#F59E0B';
    case 'In Progress': return '#3B82F6';
    case 'Completed': return '#10B981';
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
    case 'fertilization': return '#10B981';
    case 'inventory': return '#3B82F6';
    case 'task': return '#F59E0B';
    case 'finance': return '#8B5CF6';
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