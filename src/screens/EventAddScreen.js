import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, TextInput, Text, useTheme, Card, IconButton } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, push, set } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const EventAddScreen = ({ navigation }) => { 
  const theme = useTheme();
  const [eventName, setEventName] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [location, setLocation] = useState('KSU Marietta');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [openTimePickerStart, setOpenTimePickerStart] = useState(false);
  const [openTimePickerEnd, setOpenTimePickerEnd] = useState(false);

  const handleAddEvent = () => {
    const database = getDatabase(app);
    const eventsRef = ref(database, 'events');
    const newEventRef = push(eventsRef); // Firebase generates a unique key
  
    const newEvent = {
      id: newEventRef.key,
      name: eventName,
      details: eventDetails,
      location: location,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      judges: {}, // Placeholder for judge IDs
      projects: {} // Placeholder for project IDs
    };
  
    set(newEventRef, newEvent) // Use the set() method with the unique reference
    .then(() => {
      alert(`Event "${eventName}" added with ID ${newEventRef.key}!`);
      // Clear the form here
      setEventName('');
      setEventDetails('');
      setLocation('KSU Marietta');
      setStartDate(new Date());
      setEndDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
      navigation.goBack(); // Optionally navigate back
    })
      .catch((error) => {
        alert("Failed to add event: " + error.message);
      });
  };
  

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LogoComponent />
      <Card style={styles.card}>
        <Card.Content>
          <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Add New Event</Text>
          <TextInput
            mode="outlined"
            label="Event Name"
            value={eventName}
            onChangeText={setEventName}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Event Details"
            value={eventDetails}
            onChangeText={setEventDetails}
            style={styles.input}
          />
          <Text style={styles.label}>Select Location:</Text>
          <Picker
            selectedValue={location}
            onValueChange={(itemValue) => setLocation(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="KSU Marietta" value="KSU Marietta" />
            <Picker.Item label="KSU Campus" value="KSU Campus" />
          </Picker>
          <Button icon="calendar" mode="outlined" onPress={() => setOpenStartDatePicker(true)} style={styles.button}>
            Pick Start Date
          </Button>
          <DatePickerModal
            locale="en-US"
            mode="single"
            visible={openStartDatePicker}
            onDismiss={() => setOpenStartDatePicker(false)}
            date={startDate}
            onConfirm={(params) => {
              setOpenStartDatePicker(false);
              setStartDate(params.date);
            }}
          />
          <Button icon="calendar" mode="outlined" onPress={() => setOpenEndDatePicker(true)} style={styles.button}>
            Pick End Date
          </Button>
          <DatePickerModal
            locale="en-US"
            mode="single"
            visible={openEndDatePicker}
            onDismiss={() => setOpenEndDatePicker(false)}
            date={endDate}
            onConfirm={(params) => {
              setOpenEndDatePicker(false);
              setEndDate(params.date);
            }}
          />
          <Button icon="clock-outline" mode="outlined" onPress={() => setOpenTimePickerStart(true)} style={styles.button}>
            Pick Start Time
          </Button>
          <TimePickerModal
            locale="en-US"
            visible={openTimePickerStart}
            onDismiss={() => setOpenTimePickerStart(false)}
            onConfirm={(params) => {
              setOpenTimePickerStart(false);
              setStartTime(new Date(0, 0, 0, params.hours, params.minutes));
            }}
            hours={startTime.getHours()} // default: current hours
            minutes={startTime.getMinutes()} // default: current minutes
          />
          <Button icon="clock-outline" mode="outlined" onPress={() => setOpenTimePickerEnd(true)} style={styles.button}>
            Pick End Time
          </Button>
          <TimePickerModal
            locale="en-US"
            visible={openTimePickerEnd}
            onDismiss={() => setOpenTimePickerEnd(false)}
            onConfirm={(params) => {
              setOpenTimePickerEnd(false);
              setEndTime(new Date(0, 0, 0, params.hours, params.minutes));
            }}
            hours={endTime.getHours()} // default: current hours
            minutes={endTime.getMinutes()} // default: current minutes
          />
          <Button 
            mode="contained" 
            onPress={handleAddEvent}
            style={styles.button}
          >
            Add Event
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding:    8,
    marginVertical: 8,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000', // Adjust the color as needed
  },
  picker: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default EventAddScreen;
