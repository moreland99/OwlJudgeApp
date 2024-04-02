import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const JudgeDetailsScreen = ({ navigation }) => {
  const theme = useTheme();
  const [judgeName, setJudgeName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [contact, setContact] = useState('');
  const [availability, setAvailability] = useState('');

  const handleSaveJudgeDetails = () => {
    const database = getDatabase(app);
    const judgesRef = ref(database, 'judges');
    const newJudge = { judgeName, expertise, contact, availability };

    push(judgesRef, newJudge).then(() => {
      alert(`Details for Judge ${judgeName} saved!`);
      navigation.goBack();
    }).catch((error) => {
      alert("Failed to save judge details: " + error.message);
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}>
      <LogoComponent />
      <Text style={[styles.title, {color: theme.colors.text}]}>Add/Edit Judge Details</Text>
      <TextInput
        mode="outlined"
        label="Judge Name"
        value={judgeName}
        onChangeText={setJudgeName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Expertise Area"
        value={expertise}
        onChangeText={setExpertise}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Contact Information"
        value={contact}
        onChangeText={setContact}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Availability"
        value={availability}
        onChangeText={setAvailability}
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={handleSaveJudgeDetails} 
        style={styles.button}
      >
        Save Details
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default JudgeDetailsScreen;

