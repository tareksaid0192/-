// معاً نقدر - Design System
export const Colors = {
  primary: '#5B3D91',
  coral: '#FF8F7F',
  yellow: '#FFC567',
  teal: '#4DB6AC',
  background: '#F9F6EF',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8E0F0',
  textPrimary: '#2D1B4E',
  textSecondary: '#7B6B8D',
  textLight: '#B0A3C0',
  shadow: 'rgba(91, 61, 145, 0.12)',
  starActive: '#5B3D91',
  starInactive: '#E8E0F0',
  success: '#4DB6AC',
  overlay: 'rgba(45, 27, 78, 0.5)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const FontFamily = {
  cairo: 'Cairo_400Regular',
  cairoBold: 'Cairo_700Bold',
  cairoSemiBold: 'Cairo_600SemiBold',
  poppins: 'Poppins_400Regular',
  poppinsBold: 'Poppins_700Bold',
  poppinsSemiBold: 'Poppins_600SemiBold',
};
