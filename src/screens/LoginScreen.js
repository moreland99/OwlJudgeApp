import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image,Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Card } from 'react-native-paper';
import { app } from '../firebase/firebaseConfig';
import { auth } from '../firebase/firebaseConfig';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
  const navigation = useNavigation();
  
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in!');
      Alert.alert('User logged in!', [{text: 'OK'}]);
      navigation.navigate('Admin Dashboard');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message, [{text: 'OK'}]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessiblie={false}>
    <View style={styles.container}>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <Image source={require('../assets/owlJudgeLogo.png')} style={styles.logo} />
          <Text style={styles.title}>Login</Text>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <Button title="Log In" onPress={handleLogin} />
          <Button title="Create Account" onPress={() => navigation.navigate('CreateAccount')} />
        </Card.Content>
      </Card>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    padding: 20,
  },
  cardStyle: {
    flex: 1,
    maxWidth: 400,
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
});

export default LoginScreen;
