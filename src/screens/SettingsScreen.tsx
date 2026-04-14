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
        {/* 项目管理 */}
        <TouchableOpacity
          style={styles.settingCard}
          onPress={() => navigation.navigate('AddProject' as never)}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>➕</Text>
            <Text style={styles.cardTitle}>{t('settings.addProject')}</Text>
            <Text style={styles.cardArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingCard}
          onPress={() => navigation.navigate('ManageProjects' as never)}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={styles.cardTitle}>{t('settings.manageProjects')}</Text>
            <Text style={styles.cardArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 语言设置 */}
        <View style={styles.settingCard}>
          <View style={styles.languageRow}>
            <View style={styles.languageTitleRow}>
              <Text style={styles.cardIcon}>🌐</Text>
              <Text style={styles.cardTitle}>{t('settings.language')}</Text>
            </View>
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

        {/* 开发者信息 */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>{t('settings.developerInfo')}</Text>
          <Text style={styles.footerText}>sgao</Text>
          <Text style={styles.footerText}>📱 13552276232</Text>
          <Text style={styles.footerText}>✉️ sgaoshang@outlook.com</Text>
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
    paddingBottom: 32,
  },
  settingCard: {
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardArrow: {
    fontSize: 24,
    color: Colors.textDisabled,
    fontWeight: '300',
  },
  languageRow: {
    gap: 12,
  },
  languageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 2,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  languageButton: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  version: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginTop: 16,
  },
});
