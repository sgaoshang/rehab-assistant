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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { PRESET_PROJECTS } from '../constants/presetProjects';
import { formatTime } from '../utils/dateHelper';

type Mode = 'select' | 'preset' | 'custom';

// 快捷时间选项
const QUICK_TIMES = [
  { label: '早上', time: '08:00' },
  { label: '上午', time: '10:00' },
  { label: '中午', time: '12:00' },
  { label: '下午', time: '14:00' },
  { label: '傍晚', time: '18:00' },
  { label: '晚上', time: '20:00' },
  { label: '睡前', time: '22:00' },
];

// 时间模板
const TIME_TEMPLATES = [
  { label: '每日三次(早中晚)', times: ['08:00', '12:00', '18:00'] },
  { label: '每日三次(餐前)', times: ['07:30', '11:30', '17:30'] },
  { label: '每日三次(餐后)', times: ['08:30', '12:30', '18:30'] },
  { label: '早晚各一次', times: ['08:00', '20:00'] },
  { label: '一日一次(早)', times: ['08:00'] },
  { label: '一日一次(晚)', times: ['20:00'] },
];

export const AddProjectScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addProject } = useApp();

  const [mode, setMode] = useState<Mode>('select');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTimes, setReminderTimes] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  const handleSelectPreset = (preset: typeof PRESET_PROJECTS[0]) => {
    setName(preset.name);
    setDescription(preset.description);
    setMode('custom');
  };

  // 添加快捷时间
  const handleAddQuickTime = (time: string) => {
    if (!reminderTimes.includes(time)) {
      setReminderTimes([...reminderTimes, time].sort());
    }
  };

  // 使用时间模板
  const handleUseTemplate = (times: string[]) => {
    const newTimes = [...reminderTimes];
    times.forEach(time => {
      if (!newTimes.includes(time)) {
        newTimes.push(time);
      }
    });
    setReminderTimes(newTimes.sort());
  };

  // 自定义时间
  const handleAddCustomTime = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedDate) {
      const timeString = formatTime(selectedDate);
      if (!reminderTimes.includes(timeString)) {
        setReminderTimes([...reminderTimes, timeString].sort());
      }
      if (Platform.OS === 'ios') {
        setShowTimeModal(false);
      }
    }
  };

  const handleCancelTimePicker = () => {
    setShowTimePicker(false);
    setShowTimeModal(false);
  };

  const handleRemoveTime = (time: string) => {
    setReminderTimes(reminderTimes.filter((t) => t !== time));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入项目名称');
      return;
    }

    if (name.length > 20) {
      Alert.alert('提示', '项目名称不能超过20个字');
      return;
    }

    if (description.length > 100) {
      Alert.alert('提示', '项目说明不能超过100个字');
      return;
    }

    if (reminderTimes.length === 0) {
      Alert.alert('提示', '请至少添加一个提醒时间');
      return;
    }

    setSubmitting(true);
    try {
      await addProject({
        name: name.trim(),
        description: description.trim(),
        isPreset: false,
        isEnabled: true,
        reminderTimes,
      });

      Alert.alert('成功', '项目已添加', [
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
            title="选择预设项目"
            onPress={() => setMode('preset')}
            variant="primary"
            style={styles.modeButton}
          />
          <LargeButton
            title="自定义项目"
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
          <Text style={CommonStyles.title}>选择预设项目</Text>

          {PRESET_PROJECTS.map((preset, index) => (
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
        <Text style={CommonStyles.title}>项目信息</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>项目名称 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：降压药、握拳练习"
            placeholderTextColor={Colors.textDisabled}
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
          <Text style={styles.hint}>{name.length}/20</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>项目说明</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="详细说明如何执行"
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
          <Text style={[styles.hint, styles.hintTop]}>选择快捷时间或自定义时间</Text>

          {/* 已添加的时间 */}
          {reminderTimes.length > 0 && (
            <View style={styles.selectedTimesContainer}>
              <Text style={styles.selectedTimesLabel}>已选择 ({reminderTimes.length}):</Text>
              <View style={styles.selectedTimesList}>
                {reminderTimes.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.selectedTimeChip}
                    onPress={() => handleRemoveTime(time)}
                  >
                    <Text style={styles.selectedTimeText}>{time}</Text>
                    <Text style={styles.removeChipIcon}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 快捷时间按钮 */}
          <Text style={styles.sectionLabel}>快捷时间</Text>
          <View style={styles.quickTimesGrid}>
            {QUICK_TIMES.map((item) => (
              <TouchableOpacity
                key={item.time}
                style={[
                  styles.quickTimeButton,
                  reminderTimes.includes(item.time) && styles.quickTimeButtonSelected,
                ]}
                onPress={() => handleAddQuickTime(item.time)}
              >
                <Text
                  style={[
                    styles.quickTimeLabel,
                    reminderTimes.includes(item.time) && styles.quickTimeLabelSelected,
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.quickTimeValue,
                    reminderTimes.includes(item.time) && styles.quickTimeValueSelected,
                  ]}
                >
                  {item.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 时间模板 */}
          <Text style={styles.sectionLabel}>常用模板</Text>
          <View style={styles.templatesContainer}>
            {TIME_TEMPLATES.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.templateButton}
                onPress={() => handleUseTemplate(template.times)}
              >
                <Text style={styles.templateLabel}>{template.label}</Text>
                <Text style={styles.templateTimes}>{template.times.join(' ')}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 自定义时间 */}
          <LargeButton
            title="+ 自定义时间"
            onPress={() => {
              if (Platform.OS === 'ios') {
                setShowTimeModal(true);
              } else {
                setShowTimePicker(true);
              }
            }}
            variant="secondary"
            style={styles.addTimeButton}
          />
        </View>

        {/* Android 时间选择器 */}
        {showTimePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleAddCustomTime}
          />
        )}

        {/* iOS 时间选择器 Modal */}
        {showTimeModal && Platform.OS === 'ios' && (
          <Modal
            visible={showTimeModal}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCancelTimePicker}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleCancelTimePicker}>
                    <Text style={styles.modalCancelButton}>取消</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>选择时间</Text>
                  <TouchableOpacity onPress={() => handleAddCustomTime(null, tempTime)}>
                    <Text style={styles.modalConfirmButton}>确定</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={(event, date) => date && setTempTime(date)}
                  style={styles.timePicker}
                />
              </View>
            </View>
          </Modal>
        )}

        <LargeButton
          title="保存项目"
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
    marginBottom: 12,
    textAlign: 'left',
  },
  selectedTimesContainer: {
    marginBottom: 16,
  },
  selectedTimesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  selectedTimesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTimeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 4,
  },
  removeChipIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 12,
  },
  quickTimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickTimeButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    minWidth: 90,
    alignItems: 'center',
  },
  quickTimeButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickTimeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  quickTimeLabelSelected: {
    color: '#FFFFFF',
  },
  quickTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  quickTimeValueSelected: {
    color: '#FFFFFF',
  },
  templatesContainer: {
    marginBottom: 16,
  },
  templateButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 8,
  },
  templateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  templateTimes: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  addTimeButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalCancelButton: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalConfirmButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  timePicker: {
    height: 200,
  },
  submitButton: {
    marginTop: 16,
  },
});
