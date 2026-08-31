import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform, useColorScheme as useNativeColorScheme } from 'react-native';

// ─── FREYNA Maritime Command Center Palette ─────────────────────────────────
export const Brand = {
  deepOcean:   '#071521',   // Deepest background
  darkNavy:    '#0A1B29',   // Primary background
  navyMid:     '#0D2232',   // Secondary background
  surface:     '#102A3D',   // Primary card surface
  surfaceAlt:  '#123148',   // Inset / secondary surface
  surfaceHigh: '#16394F',   // Elevated card / hover surface
  border:      '#23465B',   // Precise slate border
  borderSubtle:'#1A3648',   // Subtle divider
  
  // Accents & Signals
  cyan:        '#29C4E8',   // Data / GIS / Information
  orange:      '#FF7A00',   // Action / Primary Accent
  deepOrange:  '#E65100',   // High-contrast Action
  seaGreen:    '#20C997',   // Operational / Healthy
  warning:     '#F4B740',   // Warning / Alert
  danger:      '#E85D75',   // Critical / Danger
  
  // Text
  textLight:   '#E8F0F5',   // Primary text
  textSlate:   '#91A9B8',   // Secondary text
  textMuted:   '#617C8D',   // Muted metadata
  white:       '#FFFFFF',
  black:       '#000000',
};

// ─── Light Mode ──────────────────────────────────────────────────────────────
const light = {
  background:     '#F4F7FB',
  backgroundAlt:  '#E8EEF5',
  card:           '#FFFFFF',
  cardAlt:        '#F0F5FA',
  cardHighlight:  '#FFF8F0',

  text:           '#0B2545',
  textSecondary:  '#2C4A5A',
  textMuted:      '#5A7A8A',
  textOnDark:     '#FFFFFF',
  textOnOrange:   '#FFFFFF',

  primary:        '#134074',
  secondary:      '#29C4E8',
  accent:         '#FF7A00',
  deepAccent:     '#0B2545',

  navBg:          '#FFFFFF',
  navActive:      '#134074',
  navActiveText:  '#FFFFFF',
  navHover:       '#EEF4F8',
  navText:        '#2C4A5A',
  navIcon:        '#134074',
  navActiveIcon:  '#FFFFFF',

  sidebar:        '#FFFFFF',
  sidebarBorder:  '#D0DFEE',
  topBar:         '#FFFFFF',
  topBarBorder:   '#D0DFEE',

  inputBg:        '#FFFFFF',
  inputBorder:    '#B5CADF',
  inputText:      '#0B2545',
  placeholder:    '#6C879B',

  success:        '#20C997',
  successBg:      '#E8F8F4',
  warning:        '#F4B740',
  warningBg:      '#FFF9ED',
  danger:         '#E85D75',
  dangerBg:       '#FDF0F2',
  info:           '#29C4E8',
  infoBg:         '#EAF9FD',

  border:         '#D0DFEE',
  borderStrong:   '#9FBED8',
  divider:        '#E2EBF4',

  shadow:         'rgba(11,37,69,0.06)',
  shadowMd:       'rgba(11,37,69,0.10)',
  shadowLg:       'rgba(11,37,69,0.15)',

  chart1:         '#134074',
  chart2:         '#FF7A00',
  chart3:         '#20C997',
  chart4:         '#F4B740',
  chart5:         '#29C4E8',

  kpiValue:       '#0B2545',

  tint:           '#134074',
  icon:           '#134074',
  tabIconDefault: '#6C879B',
  tabIconSelected:'#134074',
  neutral:        '#8DA9C4',
  overlay:        'rgba(11,37,69,0.6)',
};

// ─── Dark Mode (Maritime Operations Command Console) ─────────────────────────
const dark = {
  background:     '#071521',   // Deep Maritime Night
  backgroundAlt:  '#0A1B29',   // Console Slate
  card:           '#102A3D',   // Operational Panel
  cardAlt:        '#0D2232',   // Inset Sub-panel
  cardHighlight:  '#16394F',   // Elevated Card / Active Selection

  text:           '#E8F0F5',   // High-contrast Crisp White-Slate
  textSecondary:  '#91A9B8',   // Clear Technical Slate
  textMuted:      '#617C8D',   // Muted Meta Text
  textOnDark:     '#FFFFFF',
  textOnOrange:   '#FFFFFF',

  primary:        '#29C4E8',   // Data / GIS Cyan
  secondary:      '#91A9B8',   // Technical Slate
  accent:         '#FF7A00',   // Institutional Action Orange
  deepAccent:     '#FF7A00',   // Action Orange

  navBg:          '#0A1B29',
  navActive:      '#102A3D',   // Subtle distinct surface
  navActiveText:  '#E8F0F5',
  navHover:       '#123148',
  navText:        '#91A9B8',
  navIcon:        '#29C4E8',   // Crisp Cyan Icons
  navActiveIcon:  '#29C4E8',

  sidebar:        '#0A1B29',
  sidebarBorder:  '#23465B',

  topBar:         '#0A1B29',
  topBarBorder:   '#23465B',

  inputBg:        '#0D2232',
  inputBorder:    '#23465B',
  inputText:      '#E8F0F5',
  placeholder:    '#617C8D',

  success:        '#20C997',   // Clean Emerald Green
  successBg:      'rgba(32, 201, 151, 0.12)',
  warning:        '#F4B740',   // Clean Amber
  warningBg:      'rgba(244, 183, 64, 0.12)',
  danger:         '#E85D75',   // Clear Coral Red
  dangerBg:       'rgba(232, 93, 117, 0.12)',
  info:           '#29C4E8',   // Maritime Cyan
  infoBg:         'rgba(41, 196, 232, 0.12)',

  border:         '#23465B',
  borderStrong:   '#2E566F',
  divider:        '#1A3648',

  shadow:         'rgba(0,0,0,0.35)',
  shadowMd:       'rgba(0,0,0,0.50)',
  shadowLg:       'rgba(0,0,0,0.65)',

  chart1:         '#29C4E8',   // Cyan (GIS / Forecast)
  chart2:         '#FF7A00',   // Orange (Action / Rates)
  chart3:         '#20C997',   // Green (Confidence / Positive)
  chart4:         '#F4B740',   // Amber (Warning / High Risk)
  chart5:         '#91A9B8',   // Slate (Baseline)

  kpiValue:       '#E8F0F5',

  tint:           '#29C4E8',
  icon:           '#29C4E8',
  tabIconDefault: '#617C8D',
  tabIconSelected:'#29C4E8',
  neutral:        '#16394F',
  overlay:        'rgba(7, 21, 33, 0.75)',
};

export const Colors = { light, dark };
export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemePalette = typeof light;

export const ThemeContext = createContext<{
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  colors: ThemePalette;
  setMode: (mode: ThemeMode) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useNativeColorScheme();
  const [mode, setMode] = useState<ThemeMode>('light');
  const [hydrated, setHydrated] = useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem('freyna-theme-mode').then((v) => {
      if (v === 'system' || v === 'light' || v === 'dark') setMode(v);
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);

  const updateMode = (next: ThemeMode) => {
    setMode(next);
    void AsyncStorage.setItem('freyna-theme-mode', next);
  };

  const resolvedMode = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const value = useMemo(
    () => ({ mode, resolvedMode, colors: Colors[resolvedMode], setMode: updateMode }),
    [mode, resolvedMode]
  );

  return hydrated ? React.createElement(ThemeContext.Provider, { value }, children) : null;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
