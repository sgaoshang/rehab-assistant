import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercise } from '../types';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  onPress: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isCompleted, onPress }) => {
  const truncateDescription = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity style={CommonStyles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={CommonStyles.title}>{exercise.name}</Text>
          <Text style={[CommonStyles.smallBody, styles.description]}>
            {truncateDescription(exercise.description)}
          </Text>
          {exercise.reminderTimes.length > 0 && (
            <Text style={styles.reminderText}>
              ⏰ {exercise.reminderTimes.join(', ')}
            </Text>
          )}
        </View>
        <View style={styles.status}>
          {isCompleted ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : (
            <View style={styles.emptyCircle} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  description: {
    marginTop: 4,
  },
  reminderText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
  },
  status: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 36,
    color: Colors.success,
    fontWeight: 'bold',
  },
  emptyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.neutral,
  },
});
