import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';

interface LargeButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const LargeButton: React.FC<LargeButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return Colors.neutral;
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'secondary':
        return Colors.cardBackground;
      case 'danger':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') {
      return Colors.textPrimary;
    }
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        CommonStyles.largeButton,
        { backgroundColor: getBackgroundColor() },
        variant === 'secondary' && styles.secondaryBorder,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  secondaryBorder: {
    borderWidth: 2,
    borderColor: Colors.border,
  },
});
