import * as React from 'react';
import './localeConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper'; // Import PaperProvider React Native Paper
import { useTheme } from 'react-native-paper'; // Import useTheme
import CustomTheme from './theme';
import { StyleSheet, View, Text, Image, SafeAreaView, StatusBar } from 'react-native';
// Import Screens
import EventAddScreen from './src/screens/EventAddScreen';
import EventListScreen from './src/screens/EventListScreen';
import JudgeDetailsScreen from './src/screens/JudgeDetailsScreen';
import ProjectSubmissionScreen from './src/screens/ProjectSubmissionScreen';
import ScoringScreen from './src/screens/ScoringScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateAccount from './src/screens/CreateAccount';
// Import Icons
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import JudgeListScreen from './src/screens/JudgeListScreen';


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFB81C" />
      <View style={styles.textContent}>
        <Text style={styles.title}>Owl Judge</Text>
        <Text style={styles.intro}>
          Welcome to Owl Judge, your platform for managing and participating in coding contests at Kennesaw State University.
        </Text>
      </View>
      <Image source={require('./src/assets/owlJudgeLogo.png')} style={styles.logo} />
    </SafeAreaView>
  );
};

const Drawer = createDrawerNavigator();

function App() {
  return (
    <PaperProvider theme={CustomTheme}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
          <Drawer.Screen name="Add New Event" component={EventAddScreen} />
          <Drawer.Screen name="Event List" component={EventListScreen} />
          <Drawer.Screen name="Judge Details" component={JudgeDetailsScreen} />
          <Drawer.Screen name="Judge List" component={JudgeListScreen} />
          <Drawer.Screen name="Project Submission" component={ProjectSubmissionScreen} />
          <Drawer.Screen name="Scoring & Feedback" component={ScoringScreen} />
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Create Account" component={CreateAccount} />
        </Drawer.Navigator>
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


