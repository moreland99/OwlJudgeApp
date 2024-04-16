<<<<<<< HEAD
import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, Alert } from "react-native";
import { Card } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { app } from "../firebase/firebaseConfig";
=======
import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get, push } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { app } from '../firebase/firebaseConfig'; 
>>>>>>> f96e9620e1b673d0c833d2f6d946d7007e4e9694

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
<<<<<<< HEAD
  const auth = getAuth(app);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Admin Dashboard");
      setEmail("");
      setPassword("");
      Alert.alert("Login Successful", "Welcome back!", [{ text: "OK" }]);
    } catch (error) {
      console.error("Login Error:", error.message);
      setErrorMessage(error.message);
      Alert.alert("Login Failed", error.message, [{ text: "OK" }]);
=======

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        const judgeKey = user.uid; // Use the UID from the authentication as the key for the judge's entry
        const judgeRef = ref(getDatabase(), `judges/${judgeKey}`);
  
        // Check if the judge already exists in the database
        const judgeSnapshot = await get(judgeRef);
        if (!judgeSnapshot.exists()) {
          console.log('Judge does not exist, creating new judge.');
  
          // Create a new judge entry in the database
          await set(judgeRef, {
            email: email,
            role: 'judge',
            uid: judgeKey,
          });
        }
  
        console.log('Judge exists or was created, navigating to dashboard with judgeKey:', judgeKey);
        navigation.navigate('JudgeDashboardScreen', { judgeKey: judgeKey });
      } else {
        console.log('No user object found after login.');
      }
    } catch (error) {
      console.error('Login Error', error);
      Alert.alert('Login Error', error.message, [{ text: 'OK' }]);
>>>>>>> f96e9620e1b673d0c833d2f6d946d7007e4e9694
    }
  };
  
  function navigateToDashboard(judgeKey) {
    Alert.alert('Login Successful', 'You are now logged in.', [{ text: 'OK' }]);
    navigation.navigate('JudgeDashboardScreen', { judgeKey: judgeKey });
  }
  

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <Image
            source={require("../assets/owlJudgeLogo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Log In" onPress={handleLogin} />
          <Button
            title="Create Account"
            onPress={() => navigation.navigate("CreateAccount")}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </Card.Content>
      </Card>
    </View>
=======
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={require('../assets/owlJudgeLogo.png')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <Text style={styles.switchScreenText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Create Account')}>
          <Text style={styles.linkText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
>>>>>>> f96e9620e1b673d0c833d2f6d946d7007e4e9694
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  cardStyle: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
=======
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333', 
  },
  input: {
    width: '100%',
    marginVertical: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ddd', 
    borderRadius: 8,
    backgroundColor: '#f9f9f9', 
  },
  button: {
    marginTop: 16,
    width: '100%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff', //shade of blue, adjust as needed
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchScreenText: {
    marginTop: 20,
    color: '#666', // subdued text color
  },
  linkText: {
    marginTop: 8,
    color: '#007bff', // color that indicates tappability
    textDecorationLine: 'underline',
>>>>>>> f96e9620e1b673d0c833d2f6d946d7007e4e9694
  },
});

export default LoginScreen;

