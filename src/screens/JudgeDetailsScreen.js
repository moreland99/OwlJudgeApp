import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet } from 'react-native';

const JudgeDetailsScreen = ({ navigation }) => {
  const [judgeName, setJudgeName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [contact, setContact] = useState('');
  const [availability, setAvailability] = useState('');

  const handleSaveJudgeDetails = () => {
    // Placeholder function to simulate saving judge details
    alert(`Details for Judge ${judgeName} saved!`);
    // Later, integrate with your backend to actually save these details
    navigation.goBack(); // Navigate back to the previous screen after saving
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add/Edit Judge Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Judge Name"
        value={judgeName}
        onChangeText={setJudgeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Expertise Area"
        value={expertise}
        onChangeText={setExpertise}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Information"
        value={contact}
        onChangeText={setContact}
      />
      <TextInput
        style={styles.input}
        placeholder="Availability"
        value={availability}
        onChangeText={setAvailability}
      />
      <Button title="Save Details" onPress={handleSaveJudgeDetails} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
});

export default JudgeDetailsScreen;
