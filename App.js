import React, { useState, useEffect } from 'react';
import './localeConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import CustomTheme from './theme';
import { auth, database } from './src/firebase/firebaseConfig';
import { ref, get } from 'firebase/database';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';

// Import Screens
import EventDashboardScreen from './src/screens/EventDashboardScreen';
import JudgeDetailsScreen from './src/screens/JudgeDetailsScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateAccount from './src/screens/CreateAccount'; 
import EventAddScreen from './src/screens/EventAddScreen';
import JudgeListScreen from './src/screens/JudgeListScreen';
import AssignJudgesScreen from './src/screens/AssignJudgesScreen';
// Screens specific to Judge
import JudgeDashboardScreen from './src/screens/JudgeDashboardScreen';
import EventListScreen from './src/screens/EventListScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import ProjectSubmissionScreen from './src/screens/ProjectSubmissionScreen';
import ScoringScreen from './src/screens/ScoringScreen';
import ProjectListScreen from './src/screens/ProjectListScreen';
import JudgeProjectsScreen from './src/screens/JudgeProjectsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminScoreScreen from './src/screens/AdminScoreScreen';

const Stack = createNativeStackNavigator(); // For authentication flow and modal screens
const EventStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AdminStack = createNativeStackNavigator();
const ProjectsStack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Create Account" component={CreateAccount} />
  </Stack.Navigator>
);

// Event Stack for nested navigation within the Events tab
const EventStackNavigator = () => (
  <EventStack.Navigator>
    <EventStack.Screen name="EventList" component={EventListScreen} options={{ title: 'All Events' }} />
    <EventStack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Event Details' }} />
    <EventStack.Screen name="JudgeListScreen" component={JudgeListScreen} options={{ title: 'Judges' }} />
    <EventStack.Screen name="ScoringScreen" component={ScoringScreen} options={{ title: 'Scoring' }} />
    <EventStack.Screen name="JudgeProjectsScreen" component={JudgeProjectsScreen} options={{ title: 'Projects for Event' }} />
  </EventStack.Navigator>
);

const AdminStackNavigator = () => (
  <AdminStack.Navigator initialRouteName="AdminDashboard">
    <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
    <AdminStack.Screen name="EventDashboard" component={EventDashboardScreen} />
    <AdminStack.Screen name="JudgeList" component={JudgeListScreen} />
    <AdminStack.Screen name="ProjectSubmission" component={ProjectSubmissionScreen} />
    <AdminStack.Screen name="AdminScore" component={AdminScoreScreen} options={{ title: 'Admin Scores' }}/>
    <AdminStack.Screen name="AssignJudges" component={AssignJudgesScreen} />
    <EventStack.Screen name="AddEvent" component={EventAddScreen} options={{ title: 'Add Event' }} />
  </AdminStack.Navigator>
);

const ProjectsStackNavigator = () => (
  <ProjectsStack.Navigator>
    <ProjectsStack.Screen name="ProjectList" component={ProjectListScreen} options={{ title: 'Assigned Projects' }} />
    <ProjectsStack.Screen name="ProjectScoringScreen" component={ScoringScreen} options={{ title: 'Scoring' }} />
  </ProjectsStack.Navigator>
);

const JudgeTabNavigator = ({ isAdmin}) => (
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
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Admin') {
          iconName = focused ? 'shield' : 'shield-outline';
        }

        return <Icon name={iconName} size={size} color={color} type="ionicon" />;
      },
      tabBarActiveTintColor: 'gold', 
      tabBarInactiveTintColor: 'gray',
    })} 
  >
    <Tab.Screen name="Dashboard" component={JudgeDashboardScreen} />
    <Tab.Screen name="Events" component={EventStackNavigator} /> 
    <Tab.Screen name="Projects" component={ProjectsStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileScreen}/>
     {/* Conditionally render the Admin tab if isAdmin is true */}
{isAdmin && (
  <Tab.Screen
    name="Admin"
    component={AdminStackNavigator}
    options={{
      tabBarIcon: ({ focused, color, size }) => (
        <Icon
          name={focused ? 'shield' : 'shield-outline'}
          size={size}
          color={color}
          type="ionicon"
        />
      ),
    }}
  />
)}

  </Tab.Navigator>
);


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      // Check if the logged-in user is an admin
      if (user) {
        const adminRef = ref(database, `admins/${user.uid}`);
        get(adminRef).then((snapshot) => {
          const isAdminValue = !!snapshot.val();
          setIsAdmin(isAdminValue);
        }).catch((error) => {
          console.error("Error fetching admin status:", error);
        });
      } else {
        setIsAdmin(false);
      }
    });
  
    return () => unsubscribe();
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
          <JudgeTabNavigator isAdmin={isAdmin}/>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    padding: 20,
  },
  textContent: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#231F20",
    marginBottom: 20,
  },
  intro: {
    textAlign: "center",
    color: "#231F20",
    fontSize: 16,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default App;
