import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, Image, SafeAreaView, StatusBar } from 'react-native';
import EventAddScreen from './src/screens/EventAddScreen';
import EventListScreen from './src/screens/EventListScreen';
import JudgeDetailsScreen from './src/screens/JudgeDetailsScreen';
import ProjectSubmissionScreen from './src/screens/ProjectSubmissionScreen';
// Import Icons
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFB81C" />
      <Text style={styles.title}>Owl Judge</Text>
      <Text style={styles.intro}>
        Welcome to Owl Judge, your platform for managing and participating in coding contests at Kennesaw State University.
      </Text>
      <Image
        source={require('./src/assets/owlJudgeLogo.png')} 
        style={styles.logo}
      />
      {/* You can add more UI elements here as needed */}
    </SafeAreaView>
  );
};

// Make sure this styles object is defined
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF', // A light background to complement KSU colors
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#231F20', // KSU Black
    marginBottom: 20,
  },
  intro: {
    textAlign: 'center',
    color: '#231F20', // KSU Black
    marginBottom: 30,
    fontSize: 16,
  },
  logo: {
    width: 200, // Adjust according to your logo's size
    height: 200, // Adjust according to your logo's size
    resizeMode: 'contain', // This makes sure your logo is scaled properly
  },
});

//const Stack = createNativeStackNavigator();
//const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Add New Event" component={EventAddScreen} />
        <Drawer.Screen name="Event List" component={EventListScreen} />
        <Drawer.Screen name="Judge Details" component={JudgeDetailsScreen} />
        <Drawer.Screen name="Project Submission" component={ProjectSubmissionScreen} />
        {/* Add other screens here */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;

