// theme.js
import { DefaultTheme } from 'react-native-paper';

const CustomTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFB81C', // KSU Gold
    accent: '#231F20', // KSU Black
    background: '#FFFFFF', // Optional: adjust background color as needed
    text: '#231F20', // Optional: adjust text color as needed
  },
};

export default CustomTheme;
