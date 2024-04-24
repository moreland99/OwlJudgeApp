// src/components/LogoutButton.js
import React, { useContext } from 'react';
import { Button, Alert } from 'react-native';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { FirebaseContext } from '../context/FirebaseContext';

const LogoutButton = () => {
  const { detachListeners } = useContext(FirebaseContext);

  const handleLogout = () => {
    detachListeners();  // Detach all Firebase listeners before logging out
    signOut(auth).then(() => {
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      // Additional logout logic here
    }).catch(error => {
      console.error('Error logging out:', error.message);
    });
  };

  return <Button title="Logout" onPress={handleLogout} />;
}

export default LogoutButton;
