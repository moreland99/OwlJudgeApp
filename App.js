import React, { useState, useEffect } from 'react';
import './localeConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import CustomTheme from './theme';
import { auth } from './src/firebase/firebaseConfig';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';

// Import Screens
import EventDashboardScreen from './src/screens/EventDashboardScreen';
import JudgeDetailsScreen from './src/screens/JudgeDetailsScreen';
import ProjectSubmissionScreen from './src/screens/ProjectSubmissionScreen';
import ScoringScreen from './src/screens/ScoringScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import JudgeDashboardScreen from './src/screens/JudgeDashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateAccount from './src/screens/CreateAccount';
import EventAddScreen from './src/screens/EventAddScreen'; // Ensure this is correctly imported
import JudgeListScreen from './src/screens/JudgeListScreen';
import LogoutButton from './src/components/LogoutButton';

const Stack = createNativeStackNavigator(); // For authentication flow and modal screens
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Create Account" component={CreateAccount} />
  </Stack.Navigator>
);

// Stack Navigator for Event Dashboard and Add Event Screen
const EventStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EventDashboard" component={EventDashboardScreen} options={{ headerShown: true }} />
    <Stack.Screen
      name="AddEvent"
      component={EventAddScreen}
      options={{
        presentation: 'modal',
        gestureEnabled: true, // Explicitly enable gestures
      }}
    />
  </Stack.Navigator>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  if (isLoggedIn === null) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} color={CustomTheme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <PaperProvider theme={CustomTheme}>
      <StatusBar backgroundColor={CustomTheme.colors.primary} barStyle="light-content" />
      <NavigationContainer>
        {isLoggedIn ? (
          <Drawer.Navigator initialRouteName="Admin Dashboard">
            <Drawer.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
            <Drawer.Screen name="Judge Dashboard" component={JudgeDashboardScreen} />
            <Drawer.Screen name="Event Dashboard" component={EventStack} />
            <Drawer.Screen name="Judge Details" component={JudgeDetailsScreen} />
            <Drawer.Screen name="Judge List" component={JudgeListScreen} />
            <Drawer.Screen name="Project Submission" component={ProjectSubmissionScreen} />
            <Drawer.Screen name="Scoring & Feedback" component={ScoringScreen} />
            <Drawer.Screen name="Logout" component={LogoutButton} />
          </Drawer.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  textContent: {
    alignItems: 'center',
    marginHorizontal: 30, // Adjust this value to control the side margins
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#231F20',
    marginBottom: 20,
    textAlign: 'center', // Ensures the text is centered
  },
  intro: {
    textAlign: 'center',
    color: '#231F20',
    marginBottom: 30,
    fontSize: 16,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});


export default App;


