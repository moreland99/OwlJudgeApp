import React, { useState, useEffect } from 'react';
import './localeConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import CustomTheme from './theme';
import { auth } from './src/firebase/firebaseConfig';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';

// Import Screens
import EventDashboardScreen from './src/screens/EventDashboardScreen';
import JudgeDetailsScreen from './src/screens/JudgeDetailsScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateAccount from './src/screens/CreateAccount';
import EventAddScreen from './src/screens/EventAddScreen';
import JudgeListScreen from './src/screens/JudgeListScreen';
import LogoutButton from './src/components/LogoutButton';
import AssignJudgesScreen from './src/screens/AssignJudgesScreen';
// Screens specific to Judge
import JudgeDashboardScreen from './src/screens/JudgeDashboardScreen';
import EventListScreen from './src/screens/EventListScreen';
import ProjectSubmissionScreen from './src/screens/ProjectSubmissionScreen';
import ScoringScreen from './src/screens/ScoringScreen';

const Stack = createNativeStackNavigator(); // For authentication flow and modal screens
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

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

// Stack Navigator for Admin Dashboard and Assign Judges
const AdminNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="Assign Judges" component={AssignJudgesScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const JudgeTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Events') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Projects') {
          iconName = focused ? 'briefcase' : 'briefcase-outline';
        } else if (route.name === 'Scoring') {
          iconName = focused ? 'pencil' : 'pencil-outline';
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color} type="ionicon" />;
      },
      tabBarActiveTintColor: 'gold', 
      tabBarInactiveTintColor: 'gray',
    })} 
  >
    <Tab.Screen name="Dashboard" component={JudgeDashboardScreen} />
    <Tab.Screen name="Events" component={AssignJudgesScreen} /> 
    <Tab.Screen name="Projects" component={ProjectSubmissionScreen} />
    <Tab.Screen name="Scoring" component={ScoringScreen} />
  </Tab.Navigator>
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
          // Replace Drawer.Navigator with JudgeTabNavigator for judges
          <JudgeTabNavigator />
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


