import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';

export const ManageProjectsScreen: React.FC = () => {
  const { state, toggleProjectEnabled, deleteProject } = useApp();

  const handleDelete = (id: string, name: string) => {
    Alert.alert('确认删除', `确定要删除"${name}"吗？`, [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProject(id);
            Alert.alert('成功', '项目已删除');
          } catch (error) {
            Alert.alert('错误', '删除失败，请重试');
          }
        },
      },
    ]);
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {state.projects.length === 0 ? (
          <Text style={[CommonStyles.body, styles.emptyText]}>还没有项目</Text>
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
                    提醒时间: {project.reminderTimes.join(', ')}
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
                  style={styles.deleteButton}
                  onPress={() => handleDelete(project.id, project.name)}
                >
                  <Text style={styles.deleteText}>删除</Text>
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
