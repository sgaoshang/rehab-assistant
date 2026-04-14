import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { useTranslation } from '../i18n';
import { Locale } from '../i18n/types';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, locale, setLocale } = useTranslation();

  const handleLanguageChange = (newLocale: Locale) => {
    Alert.alert(
      t('common.confirm'),
      t('settings.languageSettings'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          onPress: async () => {
            await setLocale(newLocale);
          },
        },
      ]
    );
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={CommonStyles.title}>{t('settings.title')}</Text>
          <LargeButton
            title={t('settings.addProject')}
            onPress={() => navigation.navigate('AddProject' as never)}
            variant="primary"
            style={styles.button}
          />
          <LargeButton
            title={t('settings.manageProjects')}
            onPress={() => navigation.navigate('ManageProjects' as never)}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={CommonStyles.title}>{t('settings.languageSettings')}</Text>
          <View style={styles.languageSelector}>
            <Text style={styles.languageLabel}>{t('settings.language')}</Text>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[styles.languageButton, locale === 'zh' && styles.languageButtonActive]}
                onPress={() => locale !== 'zh' && handleLanguageChange('zh')}
              >
                <Text style={[styles.languageButtonText, locale === 'zh' && styles.languageButtonTextActive]}>
                  中文
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.languageButton, locale === 'en' && styles.languageButtonActive]}
                onPress={() => locale !== 'en' && handleLanguageChange('en')}
              >
                <Text style={[styles.languageButtonText, locale === 'en' && styles.languageButtonTextActive]}>
                  English
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.developerInfo}>
            <Text style={styles.developerTitle}>{t('settings.developerInfo')}</Text>
            <Text style={styles.developerText}>sgao</Text>
            <Text style={styles.developerText}>📱 13552276232</Text>
            <Text style={styles.developerText}>✉️ sgaoshang@outlook.com</Text>
          </View>
          <Text style={styles.version}>{t('settings.version')}</Text>
        </View>
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
  },
  section: {
    marginBottom: 32,
  },
  button: {
    marginTop: 12,
  },
  languageSelector: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  developerInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.border,
    borderBottomColor: Colors.border,
    width: '100%',
  },
  developerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  developerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  version: {
    fontSize: 14,
    color: Colors.textDisabled,
    marginTop: 20,
  },
});
