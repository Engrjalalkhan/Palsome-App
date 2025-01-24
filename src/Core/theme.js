import { DefaultTheme } from 'react-native-paper'
import { COLORS } from '../Constants/Colors'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: COLORS.black,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    error: COLORS.primary,
    accent: COLORS.primary,
  },
}
