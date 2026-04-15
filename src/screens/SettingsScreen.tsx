import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { useTranslation } from '../i18n';
import { Locale } from '../i18n/types';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, locale, setLocale } = useTranslation();
  const [donateModalVisible, setDonateModalVisible] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'wechat' | 'alipay'>('wechat');

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

        {/* 打赏开发者 */}
        <TouchableOpacity
          style={[styles.settingCard, styles.donateCard]}
          onPress={() => setDonateModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>💝</Text>
            <Text style={styles.cardTitle}>{t('settings.supportDeveloper')}</Text>
            <Text style={styles.cardArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 开发者信息 */}
        <View style={styles.settingCard}>
          <View style={styles.developerContent}>
            <View style={styles.developerHeader}>
              <Text style={styles.cardIcon}>👨‍💻</Text>
              <Text style={styles.cardTitle}>{t('settings.developerInfo')}</Text>
            </View>
            <View style={styles.developerDetails}>
              <Text style={styles.developerName}>sgao</Text>
              <Text style={styles.developerContact}>📱 13552276232</Text>
              <Text style={styles.developerContact}>✉️ sgaoshang@outlook.com</Text>
              <Text style={styles.version}>{t('settings.version')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 打赏Modal */}
      <Modal
        visible={donateModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDonateModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDonateModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>{t('settings.donateTitle')}</Text>
            <Text style={styles.modalDesc}>{t('settings.donateDesc')}</Text>

            <View style={styles.payMethodTabs}>
              <TouchableOpacity
                style={[styles.payTab, selectedPayMethod === 'wechat' && styles.payTabActive]}
                onPress={() => setSelectedPayMethod('wechat')}
              >
                <Text style={[styles.payTabText, selectedPayMethod === 'wechat' && styles.payTabTextActive]}>
                  {t('settings.wechatPay')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.payTab, selectedPayMethod === 'alipay' && styles.payTabActive]}
                onPress={() => setSelectedPayMethod('alipay')}
              >
                <Text style={[styles.payTabText, selectedPayMethod === 'alipay' && styles.payTabTextActive]}>
                  {t('settings.alipay')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodePlaceholder}>
                {selectedPayMethod === 'wechat' ? '微信' : '支付宝'}收款码
              </Text>
              <Text style={styles.qrCodeHint}>请添加收款二维码图片</Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDonateModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  donateCard: {
    marginTop: 16,
  },
  developerContent: {
    gap: 12,
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  developerDetails: {
    paddingLeft: 40,
    gap: 6,
  },
  developerName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  developerContact: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  version: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  payMethodTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  payTab: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  payTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  payTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  payTabTextActive: {
    color: '#FFFFFF',
  },
  qrCodeContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 200,
  },
  qrCodePlaceholder: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  qrCodeHint: {
    fontSize: 13,
    color: Colors.textDisabled,
  },
  closeButton: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
