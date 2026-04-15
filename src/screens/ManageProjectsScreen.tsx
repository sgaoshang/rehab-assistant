import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';
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
              Alert.alert(t('manageProjects.deleteSuccess'), t('manageProjects.projectDeleted'));
            } catch (error) {
              Alert.alert(t('addProject.error'), t('manageProjects.deleteFailed'));
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (projectId: string, projectName: string) => {
    return (
      <View style={styles.swipeActions}>
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
      </View>
    );
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {state.projects.length === 0 ? (
          <Text style={[CommonStyles.body, styles.emptyText]}>{t('manageProjects.noProjects')}</Text>
        ) : (
          state.projects.map((project) => (
            <Swipeable
              key={project.id}
              renderRightActions={() => renderRightActions(project.id, project.name)}
              overshootRight={false}
            >
              <View style={styles.projectItem}>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.projectDescription} numberOfLines={1}>
                    {project.description}
                  </Text>
                  {project.reminderTimes.length > 0 && (
                    <Text style={styles.reminderText}>
                      {t('projects.reminderTimes')}: {project.reminderTimes.join(', ')}
                    </Text>
                  )}
                </View>
                <Switch
                  value={project.isEnabled}
                  onValueChange={() => toggleProjectEnabled(project.id)}
                  trackColor={{ false: Colors.neutral, true: Colors.success }}
                />
              </View>
            </Swipeable>
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
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textDisabled,
    marginTop: 40,
  },
  projectItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 3,
  },
  swipeActions: {
    flexDirection: 'row',
    height: '100%',
  },
  swipeEditButton: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
  swipeEditText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  swipeDeleteButton: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
  swipeDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
