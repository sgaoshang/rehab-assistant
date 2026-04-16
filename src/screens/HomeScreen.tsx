import React, { useRef, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Switch, Platform, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ProjectCard';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { formatDate, isCompletedToday } from '../utils/dateHelper';
import { speakTodayProjects } from '../services/speechService';
import { useTranslation } from '../i18n';
import { getPresetProjects } from '../constants/presetProjects';
import { Project } from '../types';

type ProjectCategory = 'custom' | 'medication' | 'healthCheck' | 'rehabilitation';

interface ProjectGroup {
  category: ProjectCategory;
  title: string;
  projects: Project[];
}

export const HomeScreen: React.FC = () => {
  const { state, loading, refreshProjects } = useApp();
  const { t, locale } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const hasSpokenToday = useRef<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProjects();
    setRefreshing(false);
  };

  const groupAndSortProjects = (projects: Project[]): ProjectGroup[] => {
    const presetProjects = useMemo(() => getPresetProjects(t), [t]);

    // Group by category
    const custom = projects.filter(p => !p.isPreset);
    const medication = projects.filter(p => {
      if (!p.isPreset || !p.presetId) return false;
      const preset = presetProjects.find(preset => preset.presetId === p.presetId);
      return preset?.category === 'medication';
    });
    const healthCheck = projects.filter(p => {
      if (!p.isPreset || !p.presetId) return false;
      const preset = presetProjects.find(preset => preset.presetId === p.presetId);
      return preset?.category === 'healthCheck';
    });
    const rehabilitation = projects.filter(p => {
      if (!p.isPreset || !p.presetId) return false;
      const preset = presetProjects.find(preset => preset.presetId === p.presetId);
      return preset?.category === 'rehabilitation';
    });

    // Sort by earliest reminder time
    const sortByEarliestTime = (a: Project, b: Project) => {
      const aTime = a.reminderTimes.length > 0 ? a.reminderTimes[0] : '99:99';
      const bTime = b.reminderTimes.length > 0 ? b.reminderTimes[0] : '99:99';
      return aTime.localeCompare(bTime);
    };

    // Return groups with projects, in display order
    return [
      {
        category: 'custom',
        title: t('projects.categoryCustom'),
        projects: custom.sort(sortByEarliestTime)
      },
      {
        category: 'medication',
        title: t('projects.categoryMedication'),
        projects: medication.sort(sortByEarliestTime)
      },
      {
        category: 'healthCheck',
        title: t('projects.categoryHealthCheck'),
        projects: healthCheck.sort(sortByEarliestTime)
      },
      {
        category: 'rehabilitation',
        title: t('projects.categoryRehabilitation'),
        projects: rehabilitation.sort(sortByEarliestTime)
      },
    ].filter(group => group.projects.length > 0);
  };

  const enabledProjects = state.projects.filter((proj) => proj.isEnabled);
  const visibleProjects = hideCompleted
    ? enabledProjects.filter((proj) => !isCompletedToday(proj.completionHistory))
    : enabledProjects;
  const groupedProjects = groupAndSortProjects(visibleProjects);
  const totalProjects = enabledProjects.length;
  const completedCount = enabledProjects.filter((proj) => isCompletedToday(proj.completionHistory)).length;

  // 自动播报项目
  useFocusEffect(
    React.useCallback(() => {
      console.log('[HomeScreen] useFocusEffect triggered');
      const today = new Date().toDateString();
      console.log('[HomeScreen] Today:', today, 'Last spoken:', hasSpokenToday.current);
      console.log('[HomeScreen] Loading:', loading, 'Initialized:', state.initialized);
      console.log('[HomeScreen] Enabled projects count:', enabledProjects.length);

      // 如果今天还没播报过，且数据已加载完成
      if (!loading && state.initialized && hasSpokenToday.current !== today) {
        console.log('[HomeScreen] Conditions met, will speak after 1 second');
        hasSpokenToday.current = today;

        // 延迟1秒播报，等页面加载完成
        const timer = setTimeout(() => {
          console.log('[HomeScreen] Calling speakTodayProjects now');
          speakTodayProjects(enabledProjects, t, locale);
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        console.log('[HomeScreen] Conditions NOT met, skipping speech');
      }
    }, [loading, state.initialized, enabledProjects, t, locale])
  );

  return (
    <View style={CommonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(new Date(), locale)}</Text>

          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              {t('home.stats', { total: totalProjects, completed: completedCount })}
            </Text>

            {enabledProjects.length > 0 && (
              <View style={styles.filterControl}>
                <Text style={styles.filterLabel}>
                  {hideCompleted ? t('home.showAll') : t('home.hideCompleted')}
                </Text>
                <Switch
                  value={hideCompleted}
                  onValueChange={setHideCompleted}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.cardBackground}
                />
              </View>
            )}
          </View>
        </View>

        {enabledProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={[CommonStyles.body, styles.emptyText]}>
              {t('home.emptyState')}
            </Text>
            <Text style={[CommonStyles.smallBody, styles.emptyHint]}>
              {t('home.emptyHint')}
            </Text>
          </View>
        ) : visibleProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={[CommonStyles.body, styles.emptyText]}>
              {t('home.allCompletedToday')}
            </Text>
          </View>
        ) : (
          <>
            {groupedProjects.map((group) => (
              <View key={group.category}>
                {/* Category header */}
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{group.title}</Text>
                  <Text style={styles.categoryCount}>({group.projects.length})</Text>
                </View>

                {/* Project list */}
                {group.projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    textAlign: 'center',
    color: Colors.textDisabled,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
});
