import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';

export const ManageExercisesScreen: React.FC = () => {
  const { state, toggleExerciseEnabled, deleteExercise } = useApp();

  const handleDelete = (id: string, name: string) => {
    Alert.alert('确认删除', `确定要删除"${name}"吗？历史打卡记录将保留。`, [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExercise(id);
            Alert.alert('成功', '训练已删除');
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
        {state.exercises.length === 0 ? (
          <Text style={[CommonStyles.body, styles.emptyText]}>还没有训练项目</Text>
        ) : (
          state.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDescription} numberOfLines={1}>
                  {exercise.description}
                </Text>
                {exercise.reminderTimes.length > 0 && (
                  <Text style={styles.reminderText}>
                    提醒时间: {exercise.reminderTimes.join(', ')}
                  </Text>
                )}
              </View>
              <View style={styles.actions}>
                <Switch
                  value={exercise.isEnabled}
                  onValueChange={() => toggleExerciseEnabled(exercise.id)}
                  trackColor={{ false: Colors.neutral, true: Colors.success }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exercise.id, exercise.name)}
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
  exerciseItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 16,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  exerciseDescription: {
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
