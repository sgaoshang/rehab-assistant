import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { clearAllCheckIns } from '../storage/checkinStorage';
import { sendTestNotification } from '../services/notificationService';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state, updateSettings, refreshCheckIns } = useApp();

  const handleClearData = () => {
    Alert.alert('确认清空', '这将删除所有打卡记录，训练项目不会被删除。确定要继续吗？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearAllCheckIns();
            await refreshCheckIns();
            Alert.alert('成功', '打卡记录已清空');
          } catch (error) {
            Alert.alert('错误', '清空失败，请重试');
          }
        },
      },
    ]);
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert('提示', '测试通知将在2秒后显示');
    } catch (error) {
      Alert.alert('错误', '发送测试通知失败');
    }
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={CommonStyles.title}>训练管理</Text>
          <LargeButton
            title="管理我的训练"
            onPress={() => navigation.navigate('ManageExercises' as never)}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={CommonStyles.title}>通知设置</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>提前10分钟提醒</Text>
            <Switch
              value={state.settings.enableEarlyReminder}
              onValueChange={(value) => updateSettings({ enableEarlyReminder: value })}
              trackColor={{ false: Colors.neutral, true: Colors.primary }}
            />
          </View>

          <LargeButton
            title="测试通知"
            onPress={handleTestNotification}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={CommonStyles.title}>数据管理</Text>

          <LargeButton
            title="清空所有数据"
            onPress={handleClearData}
            variant="danger"
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>康复助手 v1.0.0</Text>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  settingLabel: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  version: {
    fontSize: 14,
    color: Colors.textDisabled,
  },
});
