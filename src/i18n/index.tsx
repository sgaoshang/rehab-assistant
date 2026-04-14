import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { Locale, TranslationFunction, Translations } from './types';
import { zh } from './translations/zh';
import { en } from './translations/en';

const LOCALE_STORAGE_KEY = 'userLocale';

interface LocaleContextType {
  locale: Locale;
  t: TranslationFunction;
  setLocale: (locale: Locale) => Promise<void>;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export const useTranslation = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useTranslation must be used within LocaleProvider');
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeLocale = useCallback(async () => {
    try {
      // Check for saved user preference
      const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
      if (savedLocale === 'zh' || savedLocale === 'en') {
        setLocaleState(savedLocale);
        setIsInitialized(true);
        return;
      }

      // Fallback to system language
      const systemLocales = Localization.getLocales();
      const systemLanguage = systemLocales[0]?.languageCode;
      const defaultLocale: Locale = systemLanguage === 'zh' ? 'zh' : 'en';
      setLocaleState(defaultLocale);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize locale:', error);
      setLocaleState('zh'); // Fallback to Chinese
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    initializeLocale();
  }, [initializeLocale]);

  const setLocale = useCallback(async (newLocale: Locale) => {
    try {
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      setLocaleState(newLocale);
    } catch (error) {
      console.error('Failed to save locale:', error);
    }
  }, []);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const t: TranslationFunction = useCallback((key: string, params?: Record<string, any>) => {
    const translations: Translations = locale === 'zh' ? zh : en;
    const value = getNestedValue(translations, key);

    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    // Replace {{variable}} placeholders
    if (params) {
      return value.replace(/\{\{([^}]+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match;
      });
    }

    return value;
  }, [locale]);

  const contextValue: LocaleContextType = useMemo(() => ({
    locale,
    t,
    setLocale,
  }), [locale, t, setLocale]);

  // Don't render children until locale is initialized
  if (!isInitialized) {
    return <ActivityIndicator />;
  }

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};
