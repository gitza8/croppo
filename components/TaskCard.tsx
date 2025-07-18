import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Users, MapPin, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { colors, typography, spacing, radii } from './designSystem';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    assignee: string;
    status: string;
    priority: string;
    field?: string;
  };
  onPress?: () => void;
  onStatusChange?: (taskId: number, newStatus: string) => void;
}

export default function TaskCard({ task, onPress, onStatusChange }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return colors.warning;
      case 'In Progress': return colors.primary;
      case 'Done': return colors.success;
      default: return colors.subtitle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return colors.danger;
      case 'Medium': return colors.warning;
      case 'Low': return colors.success;
      default: return colors.subtitle;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertTriangle size={16} color={colors.danger} />;
      case 'Medium': return <Clock size={16} color={colors.warning} />;
      case 'Low': return <CheckCircle size={16} color={colors.success} />;
      default: return <Clock size={16} color={colors.subtitle} />;
    }
  };

  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Done';
  };

  return (
    <TouchableOpacity style={[styles.card, isOverdue() && styles.overdueCard]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.priorityContainer}>
            {getPriorityIcon(task.priority)}
            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
              {task.priority}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
            {task.status}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{task.description}</Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Clock size={16} color={colors.subtitle} />
          <Text style={[styles.dueDate, isOverdue() && styles.overdueDueDate]}>
            Due: {task.dueDate}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Users size={16} color={colors.subtitle} />
          <Text style={styles.assignee}>{task.assignee}</Text>
        </View>

        {task.field && (
          <View style={styles.detailRow}>
            <MapPin size={16} color={colors.subtitle} />
            <Text style={styles.field}>{task.field}</Text>
          </View>
        )}
      </View>

      {isOverdue() && (
        <View style={styles.overdueAlert}>
          <AlertTriangle size={16} color={colors.danger} />
          <Text style={styles.overdueText}>Overdue</Text>
        </View>
      )}
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
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  taskTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    marginLeft: spacing.xs,
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
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.subtitle,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  details: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: typography.fontSize.xs,
    color: colors.subtitle,
    marginLeft: spacing.xs,
  },
  overdueDueDate: {
    color: colors.danger,
    fontWeight: '500',
  },
  assignee: {
    fontSize: typography.fontSize.xs,
    color: colors.subtitle,
    marginLeft: spacing.xs,
  },
  field: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    marginLeft: spacing.xs,
  },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
  },
  overdueText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    color: colors.danger,
    marginLeft: spacing.xs,
  },
});