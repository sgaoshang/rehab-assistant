import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { ExerciseCard } from '../components/ExerciseCard';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { formatChineseDate } from '../utils/dateHelper';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state, loading, refreshExercises, refreshCheckIns, isCheckedInToday } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshExercises(), refreshCheckIns()]);
    setRefreshing(false);
  };

  const enabledExercises = state.exercises.filter((ex) => ex.isEnabled);
  const totalExercises = enabledExercises.length;
  const completedCount = enabledExercises.filter((ex) => isCheckedInToday(ex.id)).length;

  const getGreeting = () => {
    if (completedCount === 0) {
      return `您好！今天要完成${totalExercises}项训练`;
    } else if (completedCount === totalExercises && totalExercises > 0) {
      return '太棒了！今天的训练全部完成！';
    } else {
      return `已完成${completedCount}项，还有${totalExercises - completedCount}项`;
    }
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={CommonStyles.title}>{formatChineseDate(new Date())}</Text>
          <Text style={[CommonStyles.body, styles.greeting]}>{getGreeting()}</Text>
        </View>

        {enabledExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[CommonStyles.body, styles.emptyText]}>
              还没有启用的训练项目
            </Text>
            <Text style={[CommonStyles.smallBody, styles.emptyHint]}>
              点击下方按钮添加训练
            </Text>
          </View>
        ) : (
          enabledExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isCompleted={isCheckedInToday(exercise.id)}
              onPress={() => navigation.navigate('CheckIn', { exercise })}
            />
          ))
        )}

        <LargeButton
          title="+ 添加训练"
          onPress={() => navigation.navigate('AddExercise')}
          variant="secondary"
          style={styles.addButton}
        />
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
    marginBottom: 24,
  },
  greeting: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    textAlign: 'center',
    color: Colors.textDisabled,
  },
  addButton: {
    marginTop: 24,
  },
});
