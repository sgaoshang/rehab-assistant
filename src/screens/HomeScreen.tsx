import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Switch, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ProjectCard';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { formatDate, isCompletedToday } from '../utils/dateHelper';
import { speakTodayProjects } from '../services/speechService';
import { useTranslation } from '../i18n';

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

  const enabledProjects = state.projects.filter((proj) => proj.isEnabled);
  const visibleProjects = hideCompleted
    ? enabledProjects.filter((proj) => !isCompletedToday(proj.completionHistory))
    : enabledProjects;
  const totalProjects = enabledProjects.length;
  const completedCount = enabledProjects.filter((proj) => isCompletedToday(proj.completionHistory)).length;

  // 自动播报项目（仅在原生平台）
  useFocusEffect(
    React.useCallback(() => {
      // Speech is not supported on web
      if (Platform.OS === 'web') {
        return;
      }

      const today = new Date().toDateString();

      // 如果今天还没播报过，且数据已加载完成
      if (!loading && state.initialized && hasSpokenToday.current !== today) {
        hasSpokenToday.current = today;

        // 延迟1秒播报，等页面加载完成
        const timer = setTimeout(() => {
          speakTodayProjects(enabledProjects, t, locale);
        }, 1000);

        return () => clearTimeout(timer);
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
          visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))
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
});
