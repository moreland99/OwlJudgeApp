import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const CreateAccount = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
  
      // Use the UID from the authentication as the key for the judge's entry
      const judgeRef = ref(getDatabase(), 'judges/' + user.uid);
  
      // Save the judge details to the Realtime Database
      await set(judgeRef, {
        uid: user.uid, // Use Firebase Authentication UID as judge ID
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: 'judge',
        // Add any additional judge details here
      });
  
      console.log('Account created!');
      Alert.alert(
        'Account created!',
        'Your judge account has been created successfully. Please login to continue.',
        [{ text: 'OK' }]
      );
      navigation.navigate('Login'); // Navigate back to the login screen
      }
    } catch (error) {
      console.error("Signup error", error);
      Alert.alert('Error', error.message, [{ text: 'OK' }]);
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={require('../assets/owlJudgeLogo.png')} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
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
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.switchScreenText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Go to Login</Text>
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
    backgroundColor: '#fff', // or any suitable background color
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
    color: '#333', // or any color that matches your design
  },
  input: {
    width: '100%',
    marginVertical: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ddd', // or any color that suits the input fields
    borderRadius: 8,
    backgroundColor: '#f9f9f9', // light background color for input
  },
  button: {
    marginTop: 16,
    width: '100%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff', // a pleasant shade of blue, adjust as needed
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

export default CreateAccount;

