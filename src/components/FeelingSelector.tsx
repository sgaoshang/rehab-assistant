import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FeelingType } from '../types';
import { Colors } from '../constants/colors';

interface FeelingSelectorProps {
  selectedFeeling: FeelingType | null;
  onSelect: (feeling: FeelingType) => void;
}

const FEELINGS: { type: FeelingType; emoji: string; label: string; color: string }[] = [
  { type: 'easy', emoji: '😊', label: '轻松', color: Colors.feelingEasy },
  { type: 'normal', emoji: '🙂', label: '正常', color: Colors.feelingNormal },
  { type: 'hard', emoji: '😕', label: '困难', color: Colors.feelingHard },
  { type: 'pain', emoji: '😣', label: '疼痛', color: Colors.feelingPain },
];

export const FeelingSelector: React.FC<FeelingSelectorProps> = ({ selectedFeeling, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>选择您的感受：</Text>
      <View style={styles.grid}>
        {FEELINGS.map((feeling) => {
          const isSelected = selectedFeeling === feeling.type;
          return (
            <TouchableOpacity
              key={feeling.type}
              style={[
                styles.button,
                isSelected && { backgroundColor: feeling.color, borderColor: feeling.color },
              ]}
              onPress={() => onSelect(feeling.type)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{feeling.emoji}</Text>
              <Text style={[styles.label, isSelected && styles.selectedLabel]}>
                {feeling.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  label: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});
