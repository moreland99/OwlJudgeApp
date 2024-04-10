import React from 'react';
import { Button, Alert } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Logged Out', 'You have been successfully logged out.');
        // Navigate to the login screen or any other screen after logout
        // Example: navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error logging out:', error.message);
      });
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
}

export default LogoutButton;