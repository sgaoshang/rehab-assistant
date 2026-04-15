import React, { useState, useMemo, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { getPresetProjects, PresetProjectId } from '../constants/presetProjects';
import { formatTime } from '../utils/dateHelper';
import { useTranslation } from '../i18n';
import { RootStackParamList } from '../navigation/AppNavigator';

type Mode = 'select' | 'preset' | 'custom';
type AddProjectScreenRouteProp = RouteProp<RootStackParamList, 'AddProject'>;

export const AddProjectScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<AddProjectScreenRouteProp>();
  const { state, addProject, updateProject } = useApp();
  const { t } = useTranslation();

  // Check if we're in edit mode
  const projectId = route.params?.projectId;
  const isEditMode = !!projectId;
  const existingProject = isEditMode ? state.projects.find(p => p.id === projectId) : null;

  const [mode, setMode] = useState<Mode>(isEditMode ? 'custom' : 'select');
  const [name, setName] = useState(existingProject?.name || '');
  const [description, setDescription] = useState(existingProject?.description || '');
  const [reminderTimes, setReminderTimes] = useState<string[]>(existingProject?.reminderTimes || []);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [presetId, setPresetId] = useState<PresetProjectId | undefined>(existingProject?.presetId as PresetProjectId);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Get preset projects with translations
  const presetProjects = useMemo(() => getPresetProjects(t), [t]);

  // Load existing project data when in edit mode
  useEffect(() => {
    if (isEditMode && existingProject) {
      setMode('custom');
      setName(existingProject.name);
      setDescription(existingProject.description);
      setReminderTimes(existingProject.reminderTimes);
      setPresetId(existingProject.presetId as PresetProjectId);
    }
  }, [isEditMode, existingProject]);

  // Template definitions for dropdown
  const templates = useMemo(() => [
    {
      value: 'three-daily-morning-noon-evening',
      label: t('addProject.threeDailyMorningNoonEvening'),
      times: ['08:00', '12:00', '18:00'],
    },
    {
      value: 'three-daily-before-meals',
      label: t('addProject.threeDailyBeforeMeals'),
      times: ['07:30', '11:30', '17:30'],
    },
    {
      value: 'three-daily-after-meals',
      label: t('addProject.threeDailyAfterMeals'),
      times: ['08:30', '12:30', '18:30'],
    },
    {
      value: 'twice-daily-morning-evening',
      label: t('addProject.twiceDailyMorningEvening'),
      times: ['08:00', '20:00'],
    },
    {
      value: 'once-daily-morning',
      label: t('addProject.onceDailyMorning'),
      times: ['08:00'],
    },
    {
      value: 'once-daily-evening',
      label: t('addProject.onceDailyEvening'),
      times: ['20:00'],
    },
  ], [t]);

  const handleSelectPreset = (preset: typeof presetProjects[0]) => {
    setName(preset.name);
    setDescription(preset.description);
    setPresetId(preset.presetId);
    setMode('custom');
  };

  // Clear presetId if user manually edits name or description
  const handleNameChange = (text: string) => {
    setName(text);
    if (presetId) {
      setPresetId(undefined);
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (presetId) {
      setPresetId(undefined);
    }
  };

  // Handle template selection from dropdown
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);

    // Don't process empty/placeholder selection
    if (!value) return;

    // Find selected template
    const template = templates.find(t => t.value === value);
    if (!template) return;

    // Append times with deduplication
    const merged = [...new Set([...reminderTimes, ...template.times])];

    // Sort and update
    setReminderTimes(merged.sort());
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
      Alert.alert(t('addProject.error'), t('addProject.nameRequired'));
      return;
    }

    if (name.length > 20) {
      Alert.alert(t('addProject.error'), t('addProject.nameTooLong'));
      return;
    }

    if (description.length > 100) {
      Alert.alert(t('addProject.error'), t('addProject.descriptionTooLong'));
      return;
    }

    if (reminderTimes.length === 0) {
      Alert.alert(t('addProject.error'), t('addProject.timeRequired'));
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode && projectId) {
        // Update existing project
        await updateProject(projectId, {
          name: name.trim(),
          description: description.trim(),
          reminderTimes,
          presetId,
        });

        Alert.alert(t('addProject.success'), t('addProject.projectUpdated'), [
          {
            text: t('common.confirm'),
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        // Add new project
        await addProject({
          name: name.trim(),
          description: description.trim(),
          isPreset: false,
          isEnabled: true,
          reminderTimes,
          presetId,
        });

        Alert.alert(t('addProject.success'), t('addProject.projectAdded'), [
          {
            text: t('common.confirm'),
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert(t('addProject.error'), isEditMode ? t('addProject.updateFailed') : t('addProject.addFailed'));
      setSubmitting(false);
    }
  };

  if (mode === 'select') {
    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => setMode('preset')}
            activeOpacity={0.7}
          >
            <View style={styles.modeCardContent}>
              <Text style={styles.modeCardIcon}>📚</Text>
              <View style={styles.modeCardText}>
                <Text style={styles.modeCardTitle}>{t('addProject.selectPreset')}</Text>
                <Text style={styles.modeCardDescription}>{t('addProject.selectPresetDesc')}</Text>
              </View>
              <Text style={styles.modeCardArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => setMode('custom')}
            activeOpacity={0.7}
          >
            <View style={styles.modeCardContent}>
              <Text style={styles.modeCardIcon}>✏️</Text>
              <View style={styles.modeCardText}>
                <Text style={styles.modeCardTitle}>{t('addProject.customProject')}</Text>
                <Text style={styles.modeCardDescription}>{t('addProject.customProjectDesc')}</Text>
              </View>
              <Text style={styles.modeCardArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (mode === 'preset') {
    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {presetProjects.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.presetCard}
              onPress={() => handleSelectPreset(preset)}
              activeOpacity={0.7}
            >
              <View style={styles.presetCardContent}>
                <View style={styles.presetCardText}>
                  <Text style={styles.presetName}>{preset.name}</Text>
                  <Text style={styles.presetDescription}>{preset.description}</Text>
                </View>
                <Text style={styles.presetCardArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setMode('select')}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>‹ {t('common.back')}</Text>
          </TouchableOpacity>
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
        {/* Section 1: Project Info */}
        <View style={[styles.section, styles.firstSection]}>
          {/* Section title with accent */}
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleAccent} />
            <Text style={styles.sectionTitle}>项目信息</Text>
          </View>

          {/* First input - project name */}
          <View style={[styles.inputContainer, styles.firstInputContainer]}>
            <Text style={styles.label}>{t('addProject.projectName')} {t('addProject.projectNameRequired')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addProject.projectNamePlaceholder')}
              placeholderTextColor={Colors.textDisabled}
              value={name}
              onChangeText={handleNameChange}
              maxLength={20}
            />
            <Text style={styles.hint}>{t('addProject.projectNameHint', { length: name.length })}</Text>
          </View>

          {/* Project description input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('addProject.projectDescription')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('addProject.projectDescriptionPlaceholder')}
              placeholderTextColor={Colors.textDisabled}
              value={description}
              onChangeText={handleDescriptionChange}
              multiline
              numberOfLines={3}
              maxLength={100}
              textAlignVertical="top"
            />
            <Text style={styles.hint}>{t('addProject.projectDescriptionHint', { length: description.length })}</Text>
          </View>
        </View>

        {/* Section 2: Reminder Times */}
        <View style={styles.section}>
          {/* Section title with accent */}
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleAccent} />
            <Text style={styles.sectionTitle}>{t('addProject.reminderTime')}</Text>
          </View>

          {/* Template section card */}
          <View style={styles.templateSectionCard}>
            <Text style={styles.templateSectionLabel}>常用模板</Text>

            {/* Template selector button */}
            <TouchableOpacity
              style={styles.templateSelectorButton}
              onPress={() => setShowTemplateModal(true)}
              activeOpacity={0.7}
            >
              <Text style={selectedTemplate ? styles.templateSelectorText : styles.templateSelectorPlaceholder}>
                {selectedTemplate
                  ? templates.find(t => t.value === selectedTemplate)?.label
                  : t('addProject.selectTemplate')}
              </Text>
              <Text style={styles.templateSelectorIcon}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.templateHint}>
              💡 {t('addProject.templateChangeHint')}
            </Text>
          </View>

          {/* Selected Times */}
          <View style={styles.selectedTimesSection}>
            <Text style={styles.selectedTimesLabel}>
              {t('addProject.reminderTime')}
              <Text style={styles.timesCount}>
                {t('addProject.timesCount', { count: reminderTimes.length })}
              </Text>
            </Text>

            {reminderTimes.length === 0 ? (
              <View style={styles.emptyTimesContainer}>
                <Text style={styles.emptyTimesText}>
                  {t('addProject.noTimeSelectedHint')}
                </Text>
              </View>
            ) : (
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
            )}
          </View>

          {/* Add Custom Time Button */}
          <TouchableOpacity
            style={styles.customTimeButton}
            onPress={() => {
              if (Platform.OS === 'ios') {
                setShowTimeModal(true);
              } else {
                setShowTimePicker(true);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.customTimeButtonText}>
              + {t('addProject.customTimeShort')}
            </Text>
          </TouchableOpacity>
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

        {/* Template Selector Modal */}
        <Modal
          visible={showTemplateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTemplateModal(false)}
        >
          <TouchableOpacity
            style={styles.templateModalOverlay}
            activeOpacity={1}
            onPress={() => setShowTemplateModal(false)}
          >
            <View style={styles.templateModalContent}>
              <View style={styles.templateModalHeader}>
                <Text style={styles.templateModalTitle}>选择常用模板</Text>
              </View>

              <ScrollView>
                {templates.map((template) => (
                  <TouchableOpacity
                    key={template.value}
                    style={[
                      styles.templateOptionCard,
                      selectedTemplate === template.value && styles.templateOptionCardSelected
                    ]}
                    onPress={() => {
                      handleTemplateChange(template.value);
                      setShowTemplateModal(false);
                    }}
                  >
                    <Text style={styles.templateOptionTitle}>{template.label}</Text>
                    <Text style={styles.templateOptionTimes}>
                      {template.times.join(' · ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

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
                    <Text style={styles.modalCancelButton}>{t('common.cancel')}</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{t('addProject.selectTime')}</Text>
                  <TouchableOpacity onPress={() => handleAddCustomTime(null, tempTime)}>
                    <Text style={styles.modalConfirmButton}>{t('common.confirm')}</Text>
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

        {reminderTimes.length === 0 && (
          <Text style={styles.validationError}>
            {t('addProject.timeRequiredError')}
          </Text>
        )}

        <LargeButton
          title={t('addProject.saveProject')}
          onPress={handleSubmit}
          loading={submitting}
          disabled={reminderTimes.length === 0}
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleAccent: {
    width: 4,
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  modeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  modeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeCardIcon: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  modeCardText: {
    flex: 1,
  },
  modeCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  modeCardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  modeCardArrow: {
    fontSize: 24,
    color: Colors.textDisabled,
    fontWeight: '300',
  },
  presetCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  presetCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  presetCardText: {
    flex: 1,
  },
  presetName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  presetCardArrow: {
    fontSize: 24,
    color: Colors.textDisabled,
    fontWeight: '300',
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  firstInputContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  firstSection: {
    marginTop: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginTop: 4,
    textAlign: 'right',
  },
  hintTop: {
    marginTop: 0,
    marginBottom: 10,
    textAlign: 'left',
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
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    height: 28,
  },
  selectedTimeText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 4,
    fontWeight: '500',
  },
  removeChipIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  templateDropdownContainer: {
    marginBottom: 12,
  },
  templatePicker: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateHint: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginTop: 6,
  },
  templateSelectorButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateSelectorText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  templateSelectorPlaceholder: {
    fontSize: 15,
    color: Colors.textDisabled,
  },
  templateSelectorIcon: {
    fontSize: 20,
    color: Colors.primary,
  },
  templateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  templateModalContent: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '70%',
  },
  templateModalHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  templateModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  templateOptionCard: {
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateOptionCardSelected: {
    backgroundColor: '#E8F0F8',
    borderColor: Colors.primary,
  },
  templateOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  templateOptionTimes: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  templateSectionCard: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8ECEF',
  },
  templateSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  selectedTimesSection: {
    marginBottom: 12,
  },
  selectedTimesCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTimesCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectedTimesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timesCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyTimesContainer: {
    minHeight: 48,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fafafa',
  },
  emptyTimesText: {
    fontSize: 12,
    color: Colors.textDisabled,
    fontStyle: 'italic',
  },
  customTimeButton: {
    width: '100%',
    padding: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  customTimeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalCancelButton: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  modalConfirmButton: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
  timePicker: {
    height: 200,
  },
  validationError: {
    fontSize: 12,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});
