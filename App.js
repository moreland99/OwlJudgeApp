import React, { useState, useEffect } from "react"; // Import useState and useEffect
import "./localeConfig";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Ensure you're using it if needed
import { PaperProvider } from "react-native-paper";
import CustomTheme from "./theme";
import { auth } from "./src/firebase/firebaseConfig";
console.log(auth);
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
// Import Screens
import EventAddScreen from "./src/screens/EventAddScreen";
import EventListScreen from "./src/screens/EventListScreen";
import JudgeDetailsScreen from "./src/screens/JudgeDetailsScreen";
import ProjectSubmissionScreen from "./src/screens/ProjectSubmissionScreen";
import ScoringScreen from "./src/screens/ScoringScreen";
import AdminDashboardScreen from "./src/screens/AdminDashboardScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CreateAccount from "./src/screens/CreateAccount";
// Import Icons
import { MaterialCommunityIcons } from "react-native-vector-icons";
import JudgeListScreen from "./src/screens/JudgeListScreen";
import LogoutButton from "./src/components/LogoutButton";

const Stack = createNativeStackNavigator(); // For authentication flow
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Create Account" component={CreateAccount} />
  </Stack.Navigator>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null indicates loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  if (isLoggedIn === null) {
    // Consider adding a loading indicator here
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <PaperProvider theme={CustomTheme}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Login">
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen
            name="Admin Dashboard"
            component={AdminDashboardScreen}
          />
          <Drawer.Screen name="Add New Event" component={EventAddScreen} />
          <Drawer.Screen name="Event List" component={EventListScreen} />
          <Drawer.Screen name="Judge Details" component={JudgeDetailsScreen} />
          <Drawer.Screen name="Judge List" component={JudgeListScreen} />
          <Drawer.Screen
            name="Project Submission"
            component={ProjectSubmissionScreen}
          />
          <Drawer.Screen name="Scoring & Feedback" component={ScoringScreen} />
          <Drawer.Screen name="Create Account" component={CreateAccount} />
          <Drawer.Screen name="Logout" component={LogoutButton} />
        </Drawer.Navigator>
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
