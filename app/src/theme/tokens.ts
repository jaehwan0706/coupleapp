// docs/DESIGN.md 토큰. 화면에서는 색·크기를 직접 쓰지 않고 여기서 가져온다.

export const palette = {
  light: {
    primary: '#CF3F57',
    primaryPressed: '#B23047',
    primarySoft: '#FDE8EB',
    onPrimary: '#FFFFFF',
    secondary: '#F2A65A',
    secondarySoft: '#FFF1E2',
    background: '#FFFAF7',
    surface: '#FFFFFF',
    surfaceAlt: '#F7F1EE',
    textPrimary: '#2B2325',
    textSecondary: '#6E6266',
    textDisabled: '#B8AEB1',
    border: '#EDE3E0',
    borderStrong: '#D9CCC8',
    success: '#23805A',
    warning: '#9A6416',
    danger: '#C62F3B',
    overlay: 'rgba(43,35,37,0.40)',
  },
  dark: {
    primary: '#FF7A8E',
    primaryPressed: '#E8667A',
    primarySoft: '#3D2027',
    onPrimary: '#1A1517',
    secondary: '#F5B877',
    secondarySoft: '#3A2B1C',
    background: '#1A1517',
    surface: '#241D20',
    surfaceAlt: '#2E2629',
    textPrimary: '#F5EEF0',
    textSecondary: '#B9ADB1',
    textDisabled: '#6B6064',
    border: '#3A3135',
    borderStrong: '#4A3F43',
    success: '#4FC48D',
    warning: '#E8B04B',
    danger: '#FF6B6B',
    overlay: 'rgba(0,0,0,0.60)',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type Colors = { [K in keyof typeof palette.light]: string };

export const placeCategories = {
  food: { label: '음식점', color: '#E8553E', soft: '#FDECE8' },
  cafe: { label: '카페', color: '#9B6A43', soft: '#F5EDE6' },
  play: { label: '놀거리', color: '#6C5CE7', soft: '#EFEDFD' },
  stay: { label: '숙소', color: '#2D8FD6', soft: '#E6F2FB' },
  etc: { label: '기타', color: '#6B7A85', soft: '#EEF1F3' },
} as const;

export type PlaceCategory = keyof typeof placeCategories;

export const customCategoryColors = ['#D4A017', '#2A9D8F', '#E76F9A', '#5C7AEA', '#8D6E63', '#43A047'] as const;

export const eventTypes = {
  date: { label: '데이트', color: palette.light.primary, shape: 'dot' },
  anniversary: { label: '기념일', color: palette.light.secondary, shape: 'diamond' },
  etc: { label: '기타', color: '#8A7F83', shape: 'smallDot' },
} as const;

export type EventType = keyof typeof eventTypes;

// Pretendard 폰트 파일을 assets/fonts에 넣고 expo-font로 불러온 뒤 typography에 연결한다. 그 전엔 시스템 폰트.
export const fontFamily = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
} as const;

export const typography = {
  display: { fontSize: 40, lineHeight: 48, fontWeight: '700', letterSpacing: -0.5 },
  title1: { fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: -0.3 },
  title2: { fontSize: 20, lineHeight: 28, fontWeight: '600', letterSpacing: -0.2 },
  title3: { fontSize: 17, lineHeight: 24, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0 },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600', letterSpacing: 0 },
  callout: { fontSize: 15, lineHeight: 22, fontWeight: '400', letterSpacing: 0 },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500', letterSpacing: 0 },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '600', letterSpacing: 0.2 },
} as const;

export type TypographyVariant = keyof typeof typography;

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40 } as const;

/** 화면 좌우 여백 = space.5 */
export const screenPadding = space[5];

export const radius = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, full: 999 } as const;

export const shadow = {
  sm: { shadowColor: '#2B2325', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  md: { shadowColor: '#2B2325', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  lg: { shadowColor: '#2B2325', shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: -4 }, elevation: 8 },
} as const;

export const size = {
  tabBar: 56,
  appBar: 56,
  button: 52,
  buttonSmall: 44,
  iconButton: 44,
  input: 52,
  textareaMin: 96,
  searchBar: 48,
  chip: 36,
  segment: 36,
  icon: 24,
  iconList: 20,
  iconMeta: 16,
} as const;

/** 눌림 = 8% 어둡게, 비활성 = 40% */
export const state = { pressedDarken: 0.08, disabledOpacity: 0.4 } as const;

export const bottomSheet = { previewRatio: 0.3, expandedRatio: 0.85, grabber: { width: 36, height: 4 } } as const;
