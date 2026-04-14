import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { ExerciseCard } from '../components/ExerciseCard';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { formatChineseDate } from '../utils/dateHelper';
import { speakTodayExercises } from '../services/speechService';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { state, loading, refreshExercises, refreshCheckIns, isCheckedInToday } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);
  const hasSpokenToday = useRef<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshExercises(), refreshCheckIns()]);
    setRefreshing(false);
  };

  const enabledExercises = state.exercises.filter((ex) => ex.isEnabled);
  const totalExercises = enabledExercises.length;
  const completedCount = enabledExercises.filter((ex) => isCheckedInToday(ex.id)).length;
  const incompleteExercises = enabledExercises.filter((ex) => !isCheckedInToday(ex.id));

  // 自动播报待做训练
  useFocusEffect(
    React.useCallback(() => {
      const today = new Date().toDateString();

      // 如果今天还没播报过，且数据已加载完成
      if (!loading && state.initialized && hasSpokenToday.current !== today) {
        hasSpokenToday.current = today;

        // 延迟1秒播报，等页面加载完成
        const timer = setTimeout(() => {
          speakTodayExercises(incompleteExercises);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, [loading, state.initialized, incompleteExercises])
  );

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
