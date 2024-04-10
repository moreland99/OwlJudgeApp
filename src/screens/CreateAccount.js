import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { app } from '../firebase/firebaseConfig';
import { auth } from '../firebase/firebaseConfig';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import { Alert } from 'react-native';


const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
const navigation = useNavigation();

const handleSignUp = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log('Account created!');
    Alert.alert('Account created!, Your account has been created successfully. Please login to continue.', [{text: 'OK'}]);
    navigation.navigate('Login'); // Navigate back to the login screen
  } catch (error) {
    console.error(error);
    Alert.alert('Error', error.message, [{text: 'OK'}]);
  }
};

  return (
    <View style={styles.container}>
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
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginVertical: 10,
  },
});

export default CreateAccount;
