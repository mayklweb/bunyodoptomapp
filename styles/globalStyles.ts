import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#1D4ED8',
  secondary: '#2196F3',
  background: '#F5F5F5',
  backgroundWhite: '#FFFFFF',
  text: '#212121',
  textLight: '#9E9E9E',
  textDark: '#000000',
  textSecondary: '#8C8C8C',
  border: '#E5E5E5',
  danger: '#F44336',
  colorAccent: '#FF4081',
  colorSuccess: '#4CAF50',
  colorWarning: '#FFC107',
  colorInfo: '#00BCD4',
  colorLight: '#F5F5F5',
  colorDark: '#212121',
  colorMuted: '#9E9E9E',
  colorWhite: '#FFFFFF',
  colorBlack: '#000000',
  colorGray: '#8C8C8C',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 720
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

  // ProductCard uchun
  card: {
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  cardImageWrapper: {
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    padding: 0,
    gap: 2,
    marginTop: 4,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});