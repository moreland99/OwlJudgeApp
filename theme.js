import { DefaultTheme } from 'react-native-paper';

const CustomTheme = {
  ...DefaultTheme,
  roundness: 4, // Increased roundness for a softer, modern look
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFB81C', // KSU Gold
    accent: '#231F20', // KSU Black
    background: '#FFFFFF', // White background
    text: '#231F20', // Black text for better contrast
    secondary: '#E0E0E0', // Light grey for secondary buttons and backgrounds
    error: '#B00020', // For error messages and icons
    success: '#4CAF50', // For success states
    info: '#2196F3', // For informational messages
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: 'bold',
    },
    bodySmall: {  // Define it if it's not there
      fontFamily: 'System',
      fontWeight: 'normal',
      fontSize: 12,
    },
    labelLarge: {  // Define it if it's not there
      fontFamily: 'System',
      fontWeight: 'bold',
      fontSize: 14,
    },
  },
  spacing: (factor) => 8 * factor, // Example: spacing(2) = 16
  components: {
    card: {
      container: {
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      content: {
        fontSize: 16,
      },
    },
    button: {
      primary: {
        backgroundColor: '#FFB81C',
        color: '#231F20',
      },
      secondary: {
        backgroundColor: '#E0E0E0',
        color: '#231F20',
      },
    },
    input: {
      underlineColor: '#FFB81C',
      activeOutlineColor: '#231F20',
      borderRadius: 5,
    },
  },
};

export default CustomTheme;