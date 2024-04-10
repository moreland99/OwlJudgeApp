// theme.js
import { DefaultTheme } from 'react-native-paper';

const CustomTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFB81C', // KSU Gold
    accent: '#231F20', // KSU Black
    background: '#FFFFFF', // White background
    text: '#231F20', // Black text for better contrast
  },
};

export default CustomTheme;

