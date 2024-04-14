import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, Menu, Provider, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';

const JudgeDetailsScreen = ({ navigation }) => {
  const theme = useTheme(CustomTheme);
  const [judgeName, setJudgeName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [availability, setAvailability] = useState(new Date());
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Added missing state

  const expertiseOptions = ['A.I.', 'Frontend Development', 'Backend Development', 'UI/UX Design'];

  const handleSaveJudgeDetails = () => {
    const database = getDatabase(app);
    const judgesRef = ref(database, 'judges');
    const newJudgeRef = push(judgesRef);
  
    const newJudgeData = {
      id: newJudgeRef.key,
      judgeName,
      expertise,
      contact: { email, phoneNumber },
      availability: availability.toISOString(),
      events: {} // Placeholder for event IDs this judge is associated with
    };
  
    set(newJudgeRef, newJudgeData)
      .then(() => alert(`Details for Judge ${judgeName} saved with ID ${newJudgeRef.key}!`))
      .catch((error) => alert(`Failed to save judge details: ${error.message}`));
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setAvailability(date);
    hideDatePicker();
  };

  return (
    <Provider theme={CustomTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <LogoComponent />
        <Text style={styles.title}>Add/Edit Judge Details</Text>
        <TextInput
          mode="outlined"
          label="Judge Name"
          value={judgeName}
          onChangeText={setJudgeName}
          style={styles.input}
        />
        <Menu
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          anchor={
            <Button onPress={() => setIsMenuVisible(true)} style={styles.input}>
              {expertise || 'Select Expertise'}
            </Button>
          }>
          {expertiseOptions.map((option, index) => (
            <Menu.Item key={index} onPress={() => { setExpertise(option); setIsMenuVisible(false); }} title={option} />
          ))}
        </Menu>
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          mode="outlined"
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <Button mode="contained" onPress={handleSaveJudgeDetails} style={styles.button}>
          Save Details
        </Button>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: CustomTheme.colors.background // Use the theme's background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: CustomTheme.colors.text // Use the theme's text color
  },
  input: {
    marginBottom: 10,
    backgroundColor: CustomTheme.colors.surface // Use the theme's surface color for input background
  },
  button: {
    marginVertical: 10,
    backgroundColor: CustomTheme.colors.primary // Use the theme's primary color for buttons
  },
});

export default JudgeDetailsScreen;

