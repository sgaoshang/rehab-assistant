import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Project } from '../types';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { useTranslation } from '../i18n';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  // Use translations for preset projects, original text for custom projects
  const displayName = project.presetId
    ? t(`presets.${project.presetId}.name`)
    : project.name;

  const displayDescription = project.presetId
    ? t(`presets.${project.presetId}.description`)
    : project.description;

  return (
    <TouchableOpacity
      style={CommonStyles.card}
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
        </View>
        <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
      </View>

      {isExpanded && (
        <View style={styles.descriptionContainer}>
          <View style={styles.divider} />
          <Text style={styles.descriptionText}>{displayDescription}</Text>
        </View>
      )}
    </TouchableOpacity>
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
  expandIcon: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 12,
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
