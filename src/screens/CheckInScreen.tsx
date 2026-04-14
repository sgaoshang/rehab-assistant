import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { ExerciseCard } from '../components/ExerciseCard';
import { FeelingSelector } from '../components/FeelingSelector';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { FeelingType, Exercise } from '../types';

const ENCOURAGEMENTS = [
  '太棒了！坚持就是胜利！',
  '您真棒！继续加油！',
  '做得好！明天继续哦！',
  '真不错！保持下去！',
  '很棒！一天比一天好！',
];

export const CheckInScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { state, addCheckIn, isCheckedInToday } = useApp();

  const params = route.params as { exercise?: Exercise } | undefined;
  const routeExercise = params?.exercise;

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(routeExercise || null);
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingType | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedExercise) {
      Alert.alert('提示', '请先选择训练项目');
      return;
    }

    if (!selectedFeeling) {
      Alert.alert('提示', '请选择您的感受');
      return;
    }

    setSubmitting(true);
    try {
      await addCheckIn({
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        feeling: selectedFeeling,
        note: note.trim() || undefined,
      });

      const encouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      Alert.alert('完成！', encouragement, [
        {
          text: '确定',
          onPress: () => {
            if (routeExercise) {
              navigation.goBack();
            } else {
              // 重置表单继续打卡
              setSelectedExercise(null);
              setSelectedFeeling(null);
              setNote('');
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '打卡失败，请重试');
      setSubmitting(false);
    }
  };

  const enabledExercises = state.exercises.filter((ex) => ex.isEnabled);
  const incompleteExercises = enabledExercises.filter((ex) => !isCheckedInToday(ex.id));

  // 如果没有选择训练项目，显示选择列表
  if (!selectedExercise) {
    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Text style={CommonStyles.largeTitle}>选择训练项目</Text>
          <Text style={[CommonStyles.body, styles.subtitle]}>
            今日还有 {incompleteExercises.length} 项训练未完成
          </Text>

          {incompleteExercises.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[CommonStyles.body, styles.emptyText]}>
                今天的训练都完成了！
              </Text>
              <Text style={[CommonStyles.smallBody, styles.emptyHint]}>
                太棒了！明天继续加油！
              </Text>
            </View>
          ) : (
            incompleteExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => setSelectedExercise(exercise)}
                activeOpacity={0.7}
              >
                <ExerciseCard
                  exercise={exercise}
                  isCompleted={false}
                  onPress={() => setSelectedExercise(exercise)}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // 显示打卡表单
  return (
    <KeyboardAvoidingView
      style={CommonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {!routeExercise && (
          <LargeButton
            title="← 重新选择"
            onPress={() => setSelectedExercise(null)}
            variant="secondary"
            style={styles.backButton}
          />
        )}

        <Text style={CommonStyles.largeTitle}>{selectedExercise.name}</Text>
        <Text style={[CommonStyles.body, styles.description]}>{selectedExercise.description}</Text>

        <FeelingSelector selectedFeeling={selectedFeeling} onSelect={setSelectedFeeling} />

        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>备注（选填）</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="可以记录一些感受..."
            placeholderTextColor={Colors.textDisabled}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            maxLength={200}
            textAlignVertical="top"
          />
        </View>

        <LargeButton
          title="✓ 完成打卡"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!selectedFeeling}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
  },
  description: {
    marginTop: 12,
    marginBottom: 24,
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
  backButton: {
    marginBottom: 16,
  },
  noteContainer: {
    marginTop: 8,
  },
  noteLabel: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 8,
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 18,
    color: Colors.textPrimary,
    minHeight: 100,
  },
  submitButton: {
    marginTop: 32,
  },
});
