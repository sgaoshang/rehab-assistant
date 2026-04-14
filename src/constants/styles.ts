import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const CommonStyles = StyleSheet.create({
  largeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  smallBody: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  largeButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenPadding: {
    padding: 16,
  },
});
