// LogoComponent.js
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const LogoComponent = () => {
  return (
    <View style={styles.logoContainer}>
      <Image source={require('../assets/owlJudgeLogo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 100, // Set the width as needed
    height: 100, // Set the height as needed
    resizeMode: 'contain', // This ensures the logo scales properly
  },
});

export default LogoComponent;
