import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Swipeable } from 'react-native-gesture-handler';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { useTranslation } from '../i18n';
import { RootStackParamList } from '../navigation/AppNavigator';

type ManageProjectsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManageProjects'>;

export const ManageProjectsScreen: React.FC = () => {
  const navigation = useNavigation<ManageProjectsScreenNavigationProp>();
  const { state, toggleProjectEnabled, deleteProject } = useApp();
  const { t } = useTranslation();

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      t('manageProjects.confirmDelete'),
      t('manageProjects.confirmDeleteMessage', { name }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(id);
              // Project removed from list - no need for success alert
            } catch (error) {
              Alert.alert(t('addProject.error'), t('manageProjects.deleteFailed'));
            }
          },
        },
      ]
    );
  };

  const getDisplayName = (project: any) => {
    return project.presetId
      ? t(`presets.${project.presetId}.name`)
      : project.name;
  };

  const renderRightActions = (projectId: string, projectName: string) => (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-150, 0],
      outputRange: [0, 150],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.swipeActions, { transform: [{ translateX: trans }] }]}>
        <TouchableOpacity
          style={styles.swipeEditButton}
          onPress={() => navigation.navigate('AddProject', { projectId })}
        >
          <Text style={styles.swipeEditText}>{t('manageProjects.edit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.swipeDeleteButton}
          onPress={() => handleDelete(projectId, projectName)}
        >
          <Text style={styles.swipeDeleteText}>{t('common.delete')}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const totalProjects = state.projects.length;
  const enabledCount = state.projects.filter(p => p.isEnabled).length;

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* 统计信息 */}
        {totalProjects > 0 && (
          <View style={styles.header}>
            <Text style={styles.statsText}>
              {t('manageProjects.stats', { total: totalProjects, enabled: enabledCount })}
            </Text>
          </View>
        )}

        {state.projects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[CommonStyles.body, styles.emptyText]}>
              {t('manageProjects.noProjects')}
            </Text>
          </View>
        ) : (
          state.projects.map((project) => {
            const projectContent = (
              <View style={[
                styles.projectItem,
                {
                  borderLeftWidth: 4,
                  borderLeftColor: project.isEnabled ? Colors.success : Colors.border,
                }
              ]}>
                <View style={styles.projectContent}>
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectName}>
                      {project.presetId
                        ? t(`presets.${project.presetId}.name`)
                        : project.name}
                    </Text>
                    <Text style={styles.projectDescription} numberOfLines={2}>
                      {project.presetId
                        ? t(`presets.${project.presetId}.description`)
                        : project.description}
                    </Text>
                    {project.reminderTimes.length > 0 && (
                      <Text style={styles.reminderText}>
                        {project.reminderTimes.join(' · ')}
                      </Text>
                    )}
                  </View>
                  <View style={styles.projectControls}>
                    <Switch
                      value={project.isEnabled}
                      onValueChange={() => toggleProjectEnabled(project.id)}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.cardBackground}
                    />
                    {Platform.OS === 'web' && (
                      <View style={styles.webButtons}>
                        <TouchableOpacity
                          style={styles.webEditButton}
                          onPress={() => navigation.navigate('AddProject', { projectId: project.id })}
                        >
                          <Text style={styles.webButtonText}>{t('manageProjects.edit')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.webDeleteButton}
                          onPress={() => handleDelete(project.id, getDisplayName(project))}
                        >
                          <Text style={styles.webButtonText}>{t('common.delete')}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );

            // On web, render without Swipeable
            if (Platform.OS === 'web') {
              return <View key={project.id}>{projectContent}</View>;
            }

            // On native, use Swipeable
            return (
              <Swipeable
                key={project.id}
                renderRightActions={renderRightActions(project.id, getDisplayName(project))}
                overshootRight={false}
                friction={2}
                rightThreshold={40}
              >
                {projectContent}
              </Swipeable>
            );
          })
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
  statsText: {
    fontSize: 14,
    color: Colors.textSecondary,
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
    color: Colors.textSecondary,
  },
  projectItem: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  projectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  projectControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectInfo: {
    flex: 1,
    minWidth: 0,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  projectDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  reminderText: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 4,
  },
  swipeActions: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  swipeEditButton: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
  swipeEditText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '500',
  },
  swipeDeleteButton: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  swipeDeleteText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '500',
  },
  webButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  webEditButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  webDeleteButton: {
    backgroundColor: Colors.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  webButtonText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '500',
  },
});
