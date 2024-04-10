import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { app } from '../firebase/firebaseConfig'; 

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in!');
      Alert.alert('Login Successful', 'You are now logged in.', [{text: 'OK'}]);
      navigation.navigate('Admin Dashboard');
    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', error.message, [{text: 'OK'}]);
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
});

export default LoginScreen;

