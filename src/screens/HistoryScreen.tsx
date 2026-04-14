import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { formatShortDate, formatDateTime, getWeekStart, getWeekEnd, isSameDayTimestamp } from '../utils/dateHelper';
import { exportToCSV, exportToText } from '../services/exportService';
import { CheckIn, FeelingType } from '../types';

const FEELING_EMOJIS: Record<FeelingType, string> = {
  easy: '😊',
  normal: '🙂',
  hard: '😕',
  pain: '😣',
};

export const HistoryScreen: React.FC = () => {
  const { state } = useApp();

  // 计算连续打卡天数
  const streakDays = useMemo(() => {
    if (state.checkins.length === 0) return 0;

    const today = new Date().setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDay = today;

    while (true) {
      const hasCheckIn = state.checkins.some((c) => isSameDayTimestamp(c.timestamp, currentDay));
      if (!hasCheckIn) break;
      streak++;
      currentDay -= 24 * 60 * 60 * 1000; // 前一天
    }

    return streak;
  }, [state.checkins]);

  // 计算本周完成率
  const weekCompletion = useMemo(() => {
    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd();
    const enabledExercises = state.exercises.filter((ex) => ex.isEnabled);

    if (enabledExercises.length === 0) return 0;

    const daysInWeek = Math.ceil((Date.now() - weekStart) / (24 * 60 * 60 * 1000));
    const totalExpected = enabledExercises.length * daysInWeek;

    const weekCheckins = state.checkins.filter(
      (c) => c.timestamp >= weekStart && c.timestamp <= weekEnd
    );

    return totalExpected > 0 ? Math.round((weekCheckins.length / totalExpected) * 100) : 0;
  }, [state.checkins, state.exercises]);

  // 日历标记
  const markedDates = useMemo(() => {
    const marked: any = {};
    state.checkins.forEach((checkin) => {
      const dateString = new Date(checkin.timestamp).toISOString().split('T')[0];
      marked[dateString] = {
        marked: true,
        dotColor: Colors.success,
      };
    });
    return marked;
  }, [state.checkins]);

  // 最近30天的打卡记录，按日期分组
  const recentCheckIns = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = state.checkins
      .filter((c) => c.timestamp >= thirtyDaysAgo)
      .sort((a, b) => b.timestamp - a.timestamp);

    const grouped = new Map<string, CheckIn[]>();
    recent.forEach((checkin) => {
      const dateKey = formatShortDate(checkin.timestamp);
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(checkin);
    });

    return Array.from(grouped.entries());
  }, [state.checkins]);

  const handleExport = async () => {
    if (state.checkins.length === 0) {
      Alert.alert('提示', '还没有打卡记录可以导出');
      return;
    }

    Alert.alert('选择导出格式', '', [
      {
        text: 'CSV格式',
        onPress: async () => {
          try {
            await exportToCSV(state.checkins);
          } catch (error) {
            Alert.alert('错误', '导出失败，请重试');
          }
        },
      },
      {
        text: '文本格式',
        onPress: async () => {
          try {
            await exportToText(state.checkins);
          } catch (error) {
            Alert.alert('错误', '导出失败，请重试');
          }
        },
      },
      {
        text: '取消',
        style: 'cancel',
      },
    ]);
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.statsRow}>
          <StatCard label="已坚持" value={`${streakDays}天`} />
          <StatCard label="本周完成率" value={`${weekCompletion}%`} />
        </View>

        <View style={styles.section}>
          <Text style={CommonStyles.title}>打卡日历</Text>
          <Calendar
            markedDates={markedDates}
            theme={{
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={CommonStyles.title}>最近记录</Text>
            <TouchableOpacity onPress={handleExport}>
              <Text style={styles.exportButton}>导出</Text>
            </TouchableOpacity>
          </View>

          {recentCheckIns.length === 0 ? (
            <Text style={[CommonStyles.body, styles.emptyText]}>还没有打卡记录</Text>
          ) : (
            recentCheckIns.map(([date, checkins]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateTitle}>{date}</Text>
                {checkins.map((checkin) => (
                  <View key={checkin.id} style={styles.checkinItem}>
                    <View style={styles.checkinLeft}>
                      <Text style={styles.checkinTime}>
                        {formatDateTime(checkin.timestamp).split(' ')[1]}
                      </Text>
                      <Text style={styles.checkinName}>{checkin.exerciseName}</Text>
                      <Text style={styles.checkinEmoji}>{FEELING_EMOJIS[checkin.feeling]}</Text>
                    </View>
                    {checkin.note && <Text style={styles.checkinNote}>{checkin.note}</Text>}
                  </View>
                ))}
              </View>
            ))
          )}
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
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exportButton: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textDisabled,
    marginTop: 20,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  checkinItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  checkinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkinTime: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginRight: 12,
  },
  checkinName: {
    fontSize: 18,
    color: Colors.textPrimary,
    flex: 1,
  },
  checkinEmoji: {
    fontSize: 24,
  },
  checkinNote: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.border,
  },
});
