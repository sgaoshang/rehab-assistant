import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { PRESET_EXERCISES } from '../constants/presetExercises';
import { formatTime } from '../utils/dateHelper';

type Mode = 'select' | 'preset' | 'custom';

export const AddExerciseScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addExercise } = useApp();

  const [mode, setMode] = useState<Mode>('select');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTimes, setReminderTimes] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  const handleSelectPreset = (preset: typeof PRESET_EXERCISES[0]) => {
    setName(preset.name);
    setDescription(preset.description);
    setMode('custom');
  };

  const handleAddTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const timeString = formatTime(selectedDate);
      if (!reminderTimes.includes(timeString)) {
        setReminderTimes([...reminderTimes, timeString].sort());
      }
    }
  };

  const handleRemoveTime = (time: string) => {
    setReminderTimes(reminderTimes.filter((t) => t !== time));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入训练名称');
      return;
    }

    if (name.length > 20) {
      Alert.alert('提示', '训练名称不能超过20个字');
      return;
    }

    if (description.length > 100) {
      Alert.alert('提示', '训练说明不能超过100个字');
      return;
    }

    if (reminderTimes.length === 0) {
      Alert.alert('提示', '请至少添加一个提醒时间');
      return;
    }

    setSubmitting(true);
    try {
      await addExercise({
        name: name.trim(),
        description: description.trim(),
        isPreset: false,
        isEnabled: true,
        reminderTimes,
      });

      Alert.alert('成功', '训练已添加', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '添加失败，请重试');
      setSubmitting(false);
    }
  };

  if (mode === 'select') {
    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <LargeButton
            title="选择预设训练"
            onPress={() => setMode('preset')}
            variant="primary"
            style={styles.modeButton}
          />
          <LargeButton
            title="自定义训练"
            onPress={() => setMode('custom')}
            variant="secondary"
            style={styles.modeButton}
          />
        </ScrollView>
      </View>
    );
  }

  if (mode === 'preset') {
    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Text style={CommonStyles.title}>选择预设训练</Text>

          {PRESET_EXERCISES.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.presetCard}
              onPress={() => handleSelectPreset(preset)}
              activeOpacity={0.7}
            >
              <Text style={styles.presetName}>{preset.name}</Text>
              <Text style={styles.presetDescription}>{preset.description}</Text>
            </TouchableOpacity>
          ))}

          <LargeButton
            title="返回"
            onPress={() => setMode('select')}
            variant="secondary"
            style={styles.backButton}
          />
        </ScrollView>
      </View>
    );
  }

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
        <Text style={CommonStyles.title}>训练信息</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>训练名称 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：握拳练习"
            placeholderTextColor={Colors.textDisabled}
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
          <Text style={styles.hint}>{name.length}/20</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>训练说明</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="详细说明训练方法和次数"
            placeholderTextColor={Colors.textDisabled}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            maxLength={100}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>{description.length}/100</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>提醒时间 *</Text>
          <Text style={[styles.hint, styles.hintTop]}>至少添加一个每日提醒时间</Text>
          {reminderTimes.map((time) => (
            <View key={time} style={styles.timeItem}>
              <Text style={styles.timeText}>{time}</Text>
              <TouchableOpacity onPress={() => handleRemoveTime(time)}>
                <Text style={styles.removeButton}>删除</Text>
              </TouchableOpacity>
            </View>
          ))}
          <LargeButton
            title="+ 添加提醒时间"
            onPress={() => setShowTimePicker(true)}
            variant="secondary"
            style={styles.addTimeButton}
          />
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={handleAddTime}
          />
        )}

        <LargeButton
          title="保存训练"
          onPress={handleSubmit}
          loading={submitting}
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
  modeButton: {
    marginBottom: 16,
  },
  presetCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  backButton: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
  },
  hint: {
    fontSize: 14,
    color: Colors.textDisabled,
    marginTop: 4,
    textAlign: 'right',
  },
  hintTop: {
    marginTop: 0,
    marginBottom: 8,
    textAlign: 'left',
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  removeButton: {
    fontSize: 16,
    color: Colors.error,
  },
  addTimeButton: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});
