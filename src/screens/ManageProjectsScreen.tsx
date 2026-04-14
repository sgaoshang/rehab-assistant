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
  actions: {
    alignItems: 'center',
  },
  editButton: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  deleteButton: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '500',
  },
});
