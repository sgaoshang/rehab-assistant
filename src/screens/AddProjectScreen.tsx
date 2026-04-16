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
  const [showPresets, setShowPresets] = useState(false);

  // Web time picker state
  const [webTimeHour, setWebTimeHour] = useState('08');
  const [webTimeMinute, setWebTimeMinute] = useState('00');

  const [expandedCategories, setExpandedCategories] = useState<{
    rehabilitation: boolean;
    medication: boolean;
    healthCheck: boolean;
  }>({
    rehabilitation: false,
    medication: false,
    healthCheck: false,
  });

  const [expandedRehabStages, setExpandedRehabStages] = useState<{
    early: boolean;
    mid: boolean;
    late: boolean;
  }>({
    early: false,
    mid: false,
    late: false,
  });

  // Get preset projects with translations
  const presetProjects = useMemo(() => getPresetProjects(t), [t]);

  // Group preset projects by category
  const groupedPresets = useMemo(() => {
    const groups: {
      rehabilitation: typeof presetProjects;
      medication: typeof presetProjects;
      healthCheck: typeof presetProjects;
    } = {
      rehabilitation: [],
      medication: [],
      healthCheck: [],
    };

    presetProjects.forEach(preset => {
      groups[preset.category].push(preset);
    });

    return groups;
  }, [presetProjects]);

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

  const toggleCategory = (category: keyof typeof expandedCategories) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleRehabStage = (stage: keyof typeof expandedRehabStages) => {
    setExpandedRehabStages(prev => ({
      ...prev,
      [stage]: !prev[stage],
    }));
  };

  const handleSelectPreset = async (preset: typeof presetProjects[0]) => {
    // Check if this preset already exists
    const existingPreset = state.projects.find(p => p.presetId === preset.presetId);
    if (existingPreset) {
      if (Platform.OS === 'web') {
        window.alert(`${t('addProject.error')}\n\n"${preset.name}" ${t('addProject.alreadyAdded')}`);
      } else {
        Alert.alert(
          t('addProject.error'),
          `"${preset.name}" ${t('addProject.alreadyAdded')}`,
          [{ text: t('common.confirm') }]
        );
      }
      return;
    }

    // Directly add preset project without going to edit mode
    setSubmitting(true);
    try {
      await addProject({
        name: preset.name,
        description: preset.description,
        isPreset: true,
        isEnabled: true,
        reminderTimes: preset.suggestedTimes || [],
        presetId: preset.presetId,
        completionHistory: [],
      });

      if (Platform.OS === 'web') {
        window.alert(`✓ ${t('addProject.success')}\n\n"${preset.name}" ${t('addProject.projectAdded')}`);
        // Stay on select mode to allow adding more presets
      } else {
        Alert.alert(
          '✓ ' + t('addProject.success'),
          `"${preset.name}" ` + t('addProject.projectAdded'),
          [
            {
              text: t('common.confirm'),
              onPress: () => {
                // Stay on select mode to allow adding more presets
              },
            },
          ]
        );
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert(`${t('addProject.error')}\n\n${t('addProject.addFailed')}`);
      } else {
        Alert.alert(t('addProject.error'), t('addProject.addFailed'));
      }
    } finally {
      setSubmitting(false);
    }
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
      if (Platform.OS === 'web') {
        window.alert(`${t('addProject.error')}\n\n${t('addProject.nameRequired')}`);
      } else {
        Alert.alert(t('addProject.error'), t('addProject.nameRequired'));
      }
      return;
    }

    if (name.length > 20) {
      if (Platform.OS === 'web') {
        window.alert(`${t('addProject.error')}\n\n${t('addProject.nameTooLong')}`);
      } else {
        Alert.alert(t('addProject.error'), t('addProject.nameTooLong'));
      }
      return;
    }

    if (description.length > 100) {
      if (Platform.OS === 'web') {
        window.alert(`${t('addProject.error')}\n\n${t('addProject.descriptionTooLong')}`);
      } else {
        Alert.alert(t('addProject.error'), t('addProject.descriptionTooLong'));
      }
      return;
    }

    if (reminderTimes.length === 0) {
      if (Platform.OS === 'web') {
        window.alert(`${t('addProject.error')}\n\n${t('addProject.timeRequired')}`);
      } else {
        Alert.alert(t('addProject.error'), t('addProject.timeRequired'));
      }
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

        if (Platform.OS === 'web') {
          window.alert(`${t('addProject.success')}\n\n${t('addProject.projectUpdated')}`);
          navigation.goBack();
        } else {
          Alert.alert(t('addProject.success'), t('addProject.projectUpdated'), [
            {
              text: t('common.confirm'),
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      } else {
        // Add new project
        await addProject({
          name: name.trim(),
          description: description.trim(),
          isPreset: false,
          isEnabled: true,
          reminderTimes,
          presetId,
          completionHistory: [],
        });

        if (Platform.OS === 'web') {
          window.alert(`${t('addProject.success')}\n\n${t('addProject.projectAdded')}`);
          navigation.goBack();
        } else {
          Alert.alert(t('addProject.success'), t('addProject.projectAdded'), [
            {
              text: t('common.confirm'),
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert(`${t('addProject.error')}\n\n${isEditMode ? t('addProject.updateFailed') : t('addProject.addFailed')}`);
      } else {
        Alert.alert(t('addProject.error'), isEditMode ? t('addProject.updateFailed') : t('addProject.addFailed'));
      }
      setSubmitting(false);
    }
  };

  if (mode === 'select') {
    const categories: Array<{ key: keyof typeof groupedPresets; title: string }> = [
      { key: 'medication', title: t('projects.categoryMedication') },
      { key: 'healthCheck', title: t('projects.categoryHealthCheck') },
      { key: 'rehabilitation', title: t('projects.categoryRehabilitation') },
    ];

    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {/* 自定义项目 */}
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

          {/* 预设项目 */}
          <View style={styles.presetSection}>
            <TouchableOpacity
              style={styles.presetHeader}
              onPress={() => setShowPresets(!showPresets)}
              activeOpacity={0.7}
            >
              <View style={styles.presetHeaderContent}>
                <Text style={styles.presetHeaderIcon}>📚</Text>
                <View style={styles.presetHeaderText}>
                  <Text style={styles.presetHeaderTitle}>{t('addProject.selectPreset')}</Text>
                  <Text style={styles.presetHeaderDescription}>{t('addProject.selectPresetDesc')}</Text>
                </View>
                <Text style={styles.presetHeaderArrow}>
                  {showPresets ? '▼' : '▶'}
                </Text>
              </View>
            </TouchableOpacity>

            {showPresets && (
              <View style={styles.presetContent}>
                {categories.map((category) => (
                  <View key={category.key} style={styles.categoryGroup}>
                    <TouchableOpacity
                      style={styles.categoryHeader}
                      onPress={() => toggleCategory(category.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryIcon}>
                        {expandedCategories[category.key] ? '▼' : '▶'}
                      </Text>
                    </TouchableOpacity>

                    {expandedCategories[category.key] && (
                      category.key === 'rehabilitation' ? (
                        // Rehabilitation category with stage sub-groups
                        <>
                          {(['early', 'mid', 'late'] as const).map((stage) => {
                            const stagePresets = groupedPresets[category.key].filter(p => p.rehabilitationStage === stage);
                            if (stagePresets.length === 0) return null;

                            return (
                              <View key={stage} style={styles.stageGroup}>
                                <TouchableOpacity
                                  style={styles.stageHeader}
                                  onPress={() => toggleRehabStage(stage)}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.stageTitle}>
                                    {t(`projects.stage${stage.charAt(0).toUpperCase() + stage.slice(1)}` as any)}
                                  </Text>
                                  <Text style={styles.stageIcon}>
                                    {expandedRehabStages[stage] ? '▼' : '▶'}
                                  </Text>
                                </TouchableOpacity>

                                {expandedRehabStages[stage] && stagePresets.map((preset, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    style={styles.presetCard}
                                    onPress={() => handleSelectPreset(preset)}
                                    activeOpacity={0.6}
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
                              </View>
                            );
                          })}
                        </>
                      ) : (
                        // Other categories without sub-groups
                        groupedPresets[category.key].map((preset, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.presetCard}
                            onPress={() => handleSelectPreset(preset)}
                            activeOpacity={0.6}
                          >
                            <View style={styles.presetCardContent}>
                              <View style={styles.presetCardText}>
                                <Text style={styles.presetName}>{preset.name}</Text>
                                <Text style={styles.presetDescription}>{preset.description}</Text>
                              </View>
                              <Text style={styles.presetCardArrow}>›</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      )
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (mode === 'preset') {
    const categories: Array<{ key: keyof typeof groupedPresets; title: string }> = [
      { key: 'medication', title: t('projects.categoryMedication') },
      { key: 'healthCheck', title: t('projects.categoryHealthCheck') },
      { key: 'rehabilitation', title: t('projects.categoryRehabilitation') },
    ];

    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {categories.map((category) => (
            <View key={category.key} style={styles.categoryGroup}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryIcon}>
                  {expandedCategories[category.key] ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>

              {expandedCategories[category.key] && (
                category.key === 'rehabilitation' ? (
                  // Rehabilitation category with stage sub-groups
                  <>
                    {(['early', 'mid', 'late'] as const).map((stage) => {
                      const stagePresets = groupedPresets[category.key].filter(p => p.rehabilitationStage === stage);
                      if (stagePresets.length === 0) return null;

                      return (
                        <View key={stage} style={styles.stageGroup}>
                          <TouchableOpacity
                            style={styles.stageHeader}
                            onPress={() => toggleRehabStage(stage)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.stageTitle}>
                              {t(`projects.stage${stage.charAt(0).toUpperCase() + stage.slice(1)}` as any)}
                            </Text>
                            <Text style={styles.stageIcon}>
                              {expandedRehabStages[stage] ? '▼' : '▶'}
                            </Text>
                          </TouchableOpacity>

                          {expandedRehabStages[stage] && stagePresets.map((preset, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.presetCard}
                              onPress={() => handleSelectPreset(preset)}
                              activeOpacity={0.6}
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
                        </View>
                      );
                    })}
                  </>
                ) : (
                  // Other categories without sub-groups
                  groupedPresets[category.key].map((preset, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.presetCard}
                      onPress={() => handleSelectPreset(preset)}
                      activeOpacity={0.6}
                    >
                      <View style={styles.presetCardContent}>
                        <View style={styles.presetCardText}>
                          <Text style={styles.presetName}>{preset.name}</Text>
                          <Text style={styles.presetDescription}>{preset.description}</Text>
                        </View>
                        <Text style={styles.presetCardArrow}>›</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )
              )}
            </View>
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
        {/* 项目名称 */}
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

        {/* 项目说明 */}
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

        {/* 提醒时间 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('addProject.reminderTime')} {t('addProject.reminderTimeRequired')}</Text>

          {/* 常用模版和自定义按钮并排 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.templateButton}
              onPress={() => setShowTemplateModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.templateButtonText}>
                {selectedTemplate
                  ? templates.find(t => t.value === selectedTemplate)?.label
                  : t('addProject.commonTemplates')}
              </Text>
              <Text style={styles.templateButtonIcon}>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                if (Platform.OS === 'ios' || Platform.OS === 'web') {
                  setShowTimeModal(true);
                } else {
                  setShowTimePicker(true);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.customButtonText}>+ {t('addProject.customTimeShort')}</Text>
            </TouchableOpacity>
          </View>

          {/* 已选时间 */}
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
                <Text style={styles.templateModalTitle}>{t('addProject.selectTemplateTitle')}</Text>
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

        {/* iOS/Web 时间选择器 Modal */}
        {showTimeModal && (Platform.OS === 'ios' || Platform.OS === 'web') && (
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
                  <TouchableOpacity onPress={() => {
                    if (Platform.OS === 'web') {
                      // Web: construct time from hour and minute inputs
                      const hour = parseInt(webTimeHour) || 0;
                      const minute = parseInt(webTimeMinute) || 0;
                      if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
                        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        if (!reminderTimes.includes(timeString)) {
                          setReminderTimes([...reminderTimes, timeString].sort());
                        }
                        setShowTimeModal(false);
                      } else {
                        if (Platform.OS === 'web') {
                          window.alert(t('addProject.error') + '\n\n' + t('addProject.invalidTime'));
                        }
                      }
                    } else {
                      // iOS: use DateTimePicker
                      handleAddCustomTime(null, tempTime);
                    }
                  }}>
                    <Text style={styles.modalConfirmButton}>{t('common.confirm')}</Text>
                  </TouchableOpacity>
                </View>
                {Platform.OS === 'ios' ? (
                  <DateTimePicker
                    value={tempTime}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={(event, date) => date && setTempTime(date)}
                    style={styles.timePicker}
                  />
                ) : (
                  <View style={styles.webTimePickerContainer}>
                    <Text style={styles.webTimePickerLabel}>{t('addProject.enterTime')}</Text>
                    <View style={styles.webTimePickerInputs}>
                      <View style={styles.webTimeInputGroup}>
                        <TextInput
                          style={styles.webTimeInput}
                          value={webTimeHour}
                          onChangeText={(text) => {
                            const num = text.replace(/[^0-9]/g, '');
                            if (num === '' || (parseInt(num) >= 0 && parseInt(num) < 24)) {
                              setWebTimeHour(num);
                            }
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                          placeholder="08"
                          placeholderTextColor={Colors.textDisabled}
                        />
                        <Text style={styles.webTimeInputLabel}>{t('addProject.hour')}</Text>
                      </View>
                      <Text style={styles.webTimeSeparator}>:</Text>
                      <View style={styles.webTimeInputGroup}>
                        <TextInput
                          style={styles.webTimeInput}
                          value={webTimeMinute}
                          onChangeText={(text) => {
                            const num = text.replace(/[^0-9]/g, '');
                            if (num === '' || (parseInt(num) >= 0 && parseInt(num) < 60)) {
                              setWebTimeMinute(num);
                            }
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                          placeholder="00"
                          placeholderTextColor={Colors.textDisabled}
                        />
                        <Text style={styles.webTimeInputLabel}>{t('addProject.minute')}</Text>
                      </View>
                    </View>
                  </View>
                )}
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
  modeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: Colors.shadow,
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
  presetSection: {
    marginTop: 8,
  },
  presetHeader: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  presetHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  presetHeaderIcon: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  presetHeaderText: {
    flex: 1,
  },
  presetHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  presetHeaderDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  presetHeaderArrow: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  presetContent: {
    marginTop: 8,
  },
  categoryGroup: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  categoryIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  stageGroup: {
    marginLeft: 12,
    marginBottom: 12,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 4,
    backgroundColor: Colors.background,
    borderRadius: 6,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    flex: 1,
  },
  stageIcon: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  presetCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: Colors.shadow,
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
    opacity: 0.5,
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
    marginBottom: 12,
  },
  firstInputContainer: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  templateButton: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateButtonText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  templateButtonIcon: {
    fontSize: 16,
    color: Colors.primary,
  },
  customButton: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 6,
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
    marginTop: 3,
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
    color: Colors.textWhite,
    marginRight: 4,
    fontWeight: '500',
  },
  removeChipIcon: {
    fontSize: 16,
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  templateHint: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginTop: 6,
  },
  templateModalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
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
    backgroundColor: Colors.primaryLight,
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
  emptyTimesContainer: {
    minHeight: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.backgroundLight,
  },
  emptyTimesText: {
    fontSize: 12,
    color: Colors.textDisabled,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
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
  webTimePickerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  webTimePickerLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 20,
    fontWeight: '500',
  },
  webTimePickerInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  webTimeInputGroup: {
    alignItems: 'center',
    gap: 8,
  },
  webTimeInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 70,
    height: 60,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  webTimeInputLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  webTimeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: -20,
  },
});
