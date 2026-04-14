import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
  LayoutChangeEvent,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useTranslation } from '../i18n';

interface TimelineSelectorProps {
  selectedTimes: string[];
  onTimesChange: (times: string[]) => void;
  maxTimes?: number;
}

export const TimelineSelector: React.FC<TimelineSelectorProps> = ({
  selectedTimes,
  onTimesChange,
  maxTimes = 8,
}) => {
  const { t } = useTranslation();
  const [trackWidth, setTrackWidth] = useState(0);

  return (
    <View style={styles.container}>
      {/* Selected Times Chips */}
      <View style={styles.chipsContainer}>
        {selectedTimes.length === 0 ? (
          <Text style={styles.emptyText}>{t('addProject.noTimeSelected')}</Text>
        ) : (
          selectedTimes.map((time) => (
            <View key={time} style={styles.chip}>
              <Text style={styles.chipText}>{time}</Text>
              <TouchableOpacity
                onPress={() => {
                  onTimesChange(selectedTimes.filter((t) => t !== time));
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.chipDelete}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Timeline Track */}
      <View style={styles.trackCard}>
        <View
          style={styles.trackContainer}
          onLayout={(e: LayoutChangeEvent) => {
            setTrackWidth(e.nativeEvent.layout.width);
          }}
        >
          {/* Track line */}
          <View style={styles.trackLine} />

          {/* Scale labels */}
          <Text style={[styles.scaleLabel, styles.scaleLabelLeft]}>00:00</Text>
          <Text style={[styles.scaleLabel, styles.scaleLabelRight]}>23:59</Text>

          {/* Time markers - rendered on top of track */}
          {selectedTimes.map((time) => {
            const position = timeToPosition(time, trackWidth);
            return (
              <View
                key={time}
                style={[
                  styles.marker,
                  { left: position },
                ]}
              >
                <Text style={styles.markerLabel}>{time}</Text>
                <View style={styles.markerCircle} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Instruction Hint */}
      <View style={styles.instructionHint}>
        <Text style={styles.instructionText}>{t('addProject.timelineInstruction')}</Text>
      </View>
    </View>
  );
};

// Helper: Convert position (0 to trackWidth) to time string "HH:mm"
const positionToTime = (position: number, trackWidth: number): string => {
  if (trackWidth === 0) return '00:00';
  const ratio = position / trackWidth;
  const totalMinutes = Math.round(ratio * 1440); // 24 hours = 1440 minutes
  const snappedMinutes = Math.round(totalMinutes / 15) * 15; // Snap to 15min
  const hours = Math.floor(snappedMinutes / 60) % 24;
  const minutes = snappedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Helper: Convert time string "HH:mm" to position (0 to trackWidth)
const timeToPosition = (time: string, trackWidth: number): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const ratio = totalMinutes / 1440;
  return ratio * trackWidth;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    minHeight: 32,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textDisabled,
    fontStyle: 'italic',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  chipDelete: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  trackContainer: {
    width: '100%',
    height: 80,
    position: 'relative',
    justifyContent: 'center',
  },
  trackLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    top: '50%',
    marginTop: -2,
  },
  scaleLabel: {
    position: 'absolute',
    fontSize: 11,
    color: '#95A5A6',
    bottom: 8,
  },
  scaleLabelLeft: {
    left: '10%',
  },
  scaleLabelRight: {
    right: '10%',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  markerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  markerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionHint: {
    backgroundColor: '#E8F4FD',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  instructionText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});
