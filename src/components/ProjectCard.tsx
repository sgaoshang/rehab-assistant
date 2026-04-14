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
    <View style={CommonStyles.card}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={styles.content}>
            <Text style={CommonStyles.title}>{displayName}</Text>
            {project.reminderTimes.length > 0 && (
              <Text style={styles.reminderText}>
                ⏰ {project.reminderTimes.join(', ')}
              </Text>
            )}
            {stats.total > 0 && (
              <Text style={styles.statsText}>
                {t('projects.completionStats', { thisWeek: stats.thisWeek, total: stats.total })}
              </Text>
            )}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.completionButton, completed && styles.completionButtonActive]}
              onPress={handleToggleCompletion}
              activeOpacity={0.7}
            >
              <Text style={[styles.completionIcon, completed && styles.completionIconActive]}>
                ✓
              </Text>
            </TouchableOpacity>
            <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  reminderText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
  },
  statsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionButtonActive: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  completionIcon: {
    fontSize: 18,
    color: Colors.border,
    fontWeight: 'bold',
  },
  completionIconActive: {
    color: '#FFFFFF',
  },
  expandIcon: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 4,
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
