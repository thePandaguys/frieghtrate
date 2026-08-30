import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform, useColorScheme as useNativeColorScheme } from 'react-native';

// ─── FREYNA Brand Palette ────────────────────────────────────────────────────
export const Brand = {
  ocean:      '#69D2E7',   // Ocean Cyan
  seafoam:    '#A7DBD8',   // Seafoam Green
  sand:       '#E0E4CC',   // Sand
  orange:     '#F38630',   // Sunset Orange
  deepOrange: '#FA6900',   // Deep Orange
  navy:       '#0D1B2A',   // Deep Navy
  darkNavy:   '#182A35',   // Dark Navy text
  seaGreen:   '#2ECC8A',   // Sea Green (success)
  white:      '#FFFFFF',
  black:      '#000000',
};

// ─── Light Mode ──────────────────────────────────────────────────────────────
const light = {
  // Backgrounds — bright ocean white, NOT beige
  background:     '#F0F7FA',   // Very light ocean white
  backgroundAlt:  '#E8F4F8',   // Slightly deeper ocean tint
  card:           '#FFFFFF',   // Pure white cards
  cardAlt:        '#EBF7FB',   // Very light cyan tint cards
  cardHighlight:  '#FFF4EC',   // Warm orange-tinted highlight card

  // Text — dark navy for maximum contrast
  text:           '#0D1B2A',   // Deep Navy — main headings
  textSecondary:  '#2C4A5A',   // Dark slate — body text
  textMuted:      '#5A7A8A',   // Muted — labels, captions
  textOnDark:     '#FFFFFF',   // White text on dark/colored backgrounds
  textOnOrange:   '#FFFFFF',   // White on orange

  // Brand
  primary:        Brand.ocean,       // #69D2E7
  secondary:      Brand.seafoam,     // #A7DBD8
  accent:         Brand.orange,      // #F38630
  deepAccent:     Brand.deepOrange,  // #FA6900

  // Navigation — orange active, cyan hover
  navBg:          '#FFFFFF',
  navActive:      Brand.deepOrange,  // Orange active item
  navActiveText:  '#FFFFFF',
  navHover:       '#FFF0E6',         // Warm orange hover
  navText:        '#2C4A5A',
  navIcon:        Brand.ocean,       // Cyan icons
  navActiveIcon:  '#FFFFFF',

  // Sidebar
  sidebar:        '#FFFFFF',
  sidebarBorder:  Brand.seafoam,

  // TopBar
  topBar:         '#FFFFFF',
  topBarBorder:   Brand.seafoam,

  // Inputs
  inputBg:        '#FFFFFF',
  inputBorder:    Brand.ocean,
  inputText:      '#0D1B2A',
  placeholder:    '#7AACBA',

  // Status
  success:        '#2ECC8A',
  successBg:      '#E8FBF3',
  warning:        Brand.orange,
  warningBg:      '#FFF4EC',
  danger:         '#E53E3E',
  dangerBg:       '#FFF0F0',
  info:           Brand.ocean,
  infoBg:         '#EBF7FB',

  // Borders & Dividers
  border:         Brand.seafoam,
  borderStrong:   Brand.ocean,
  divider:        '#D4EAF0',

  // Shadows — soft floating
  shadow:         'rgba(13,27,42,0.10)',
  shadowMd:       'rgba(13,27,42,0.14)',
  shadowLg:       'rgba(13,27,42,0.18)',

  // Charts
  chart1:         Brand.ocean,
  chart2:         Brand.deepOrange,
  chart3:         '#2ECC8A',
  chart4:         Brand.orange,
  chart5:         Brand.seafoam,

  // KPI / Important numbers
  kpiValue:       Brand.deepOrange,

  // Misc
  tint:           Brand.ocean,
  icon:           Brand.ocean,
  tabIconDefault: '#7AACBA',
  tabIconSelected: Brand.ocean,
  neutral:        Brand.sand,
  overlay:        'rgba(13,27,42,0.5)',
};

// ─── Dark Mode ───────────────────────────────────────────────────────────────
const dark = {
  background:     '#08131F',
  backgroundAlt:  '#0A1A2A',
  card:           '#102A43',
  cardAlt:        '#0D2236',
  cardHighlight:  '#1A2E40',

  text:           '#E8F4F8',
  textSecondary:  '#A7DBD8',
  textMuted:      '#6A9AAA',
  textOnDark:     '#FFFFFF',
  textOnOrange:   '#FFFFFF',

  primary:        Brand.ocean,
  secondary:      Brand.seafoam,
  accent:         Brand.orange,
  deepAccent:     Brand.deepOrange,

  navBg:          '#0A1A2A',
  navActive:      Brand.deepOrange,
  navActiveText:  '#FFFFFF',
  navHover:       'rgba(250,105,0,0.12)',
  navText:        '#A7DBD8',
  navIcon:        Brand.ocean,
  navActiveIcon:  '#FFFFFF',

  sidebar:        '#0A1A2A',
  sidebarBorder:  'rgba(105,210,231,0.18)',

  topBar:         '#0A1A2A',
  topBarBorder:   'rgba(105,210,231,0.18)',

  inputBg:        '#0D2236',
  inputBorder:    'rgba(105,210,231,0.35)',
  inputText:      '#E8F4F8',
  placeholder:    '#4A7A8A',

  success:        '#2ECC8A',
  successBg:      'rgba(46,204,138,0.12)',
  warning:        Brand.orange,
  warningBg:      'rgba(243,134,48,0.12)',
  danger:         '#FC8181',
  dangerBg:       'rgba(252,129,129,0.12)',
  info:           Brand.ocean,
  infoBg:         'rgba(105,210,231,0.12)',

  border:         'rgba(105,210,231,0.18)',
  borderStrong:   'rgba(105,210,231,0.35)',
  divider:        'rgba(105,210,231,0.10)',

  shadow:         'rgba(0,0,0,0.30)',
  shadowMd:       'rgba(0,0,0,0.40)',
  shadowLg:       'rgba(0,0,0,0.50)',

  chart1:         Brand.ocean,
  chart2:         Brand.deepOrange,
  chart3:         '#2ECC8A',
  chart4:         Brand.orange,
  chart5:         Brand.seafoam,

  kpiValue:       Brand.deepOrange,

  tint:           Brand.ocean,
  icon:           Brand.ocean,
  tabIconDefault: '#4A7A8A',
  tabIconSelected: Brand.ocean,
  neutral:        Brand.sand,
  overlay:        'rgba(0,0,0,0.65)',
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
