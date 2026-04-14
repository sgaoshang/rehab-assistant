import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {state.projects.length === 0 ? (
          <Text style={[CommonStyles.body, styles.emptyText]}>{t('manageProjects.noProjects')}</Text>
        ) : (
          state.projects.map((project) => (
            <View key={project.id} style={styles.projectItem}>
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
              <View style={styles.actions}>
                <Switch
                  value={project.isEnabled}
                  onValueChange={() => toggleProjectEnabled(project.id)}
                  trackColor={{ false: Colors.neutral, true: Colors.success }}
                />
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('AddProject', { projectId: project.id })}
                >
                  <Text style={styles.editText}>{t('manageProjects.edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(project.id, project.name)}
                >
                  <Text style={styles.deleteText}>{t('common.delete')}</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectInfo: {
    flex: 1,
    marginRight: 16,
  },
  projectName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  actions: {
    alignItems: 'center',
  },
  editButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 14,
    color: Colors.primary,
  },
  deleteButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 14,
    color: Colors.error,
  },
});
