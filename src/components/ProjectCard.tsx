import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Project } from '../types';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { useTranslation } from '../i18n';
import { useApp } from '../context/AppContext';
import { isCompletedToday, getCompletionStats } from '../utils/dateHelper';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const { toggleProjectCompletion } = useApp();

  // Use translations for preset projects, original text for custom projects
  const displayName = project.presetId
    ? t(`presets.${project.presetId}.name`)
    : project.name;

  const displayDescription = project.presetId
    ? t(`presets.${project.presetId}.description`)
    : project.description;

  const completed = isCompletedToday(project.completionHistory);
  const stats = getCompletionStats(project.completionHistory);

  const handleToggleCompletion = async () => {
    await toggleProjectCompletion(project.id);
  };

  return (
    <View style={[
      CommonStyles.card,
      {
        borderLeftWidth: 4,
        borderLeftColor: completed ? Colors.success : Colors.border,
        padding: 14,
        paddingHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      }
    ]}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          {/* Completion button - left side */}
          <TouchableOpacity
            style={[styles.completionButton, completed && styles.completionButtonActive]}
            onPress={handleToggleCompletion}
            activeOpacity={0.7}
          >
            <Text style={[styles.completionIcon, completed && styles.completionIconActive]}>
              ✓
            </Text>
          </TouchableOpacity>

          {/* Content area - middle */}
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.projectName}>{displayName}</Text>
              {stats.total > 0 && (
                <Text style={styles.statsText}>
                  本周{stats.thisWeek} 总计{stats.total}
                </Text>
              )}
            </View>
            <Text style={styles.timeText}>
              {project.reminderTimes.join(' · ')}
            </Text>
          </View>

          {/* Expand icon - right side */}
          <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
        </View>

        {isExpanded && (
          <View style={styles.descriptionContainer}>
            <View style={styles.divider} />
            <Text style={styles.descriptionText}>{displayDescription}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  timeText: {
    fontSize: 13,
    color: Colors.primary,
  },
  statsText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500',
    flexShrink: 0,
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  completionButtonActive: {
    borderWidth: 0,
    backgroundColor: Colors.success,
  },
  completionIcon: {
    fontSize: 16,
    color: Colors.border,
    fontWeight: 'bold',
  },
  completionIconActive: {
    color: '#FFFFFF',
  },
  expandIcon: {
    fontSize: 14,
    color: Colors.textSecondary,
    flexShrink: 0,
  },
  descriptionContainer: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
