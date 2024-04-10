// EventEditForm.js
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, useTheme, Card } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import LogoComponent from '../components/LogoComponent'; // Adjust import path as necessary
import { getDatabase, ref, update } from 'firebase/database';

const EventEditForm = ({ event, onClose }) => {
  const theme = useTheme();
  const [eventName, setEventName] = useState(event.name);
  const [startDate, setStartDate] = useState(new Date(event.startDate));
  const [endDate, setEndDate] = useState(new Date(event.endDate));
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date(event.startTime));
  const [endTime, setEndTime] = useState(new Date(event.endTime));
  const [openTimePickerStart, setOpenTimePickerStart] = useState(false);
  const [openTimePickerEnd, setOpenTimePickerEnd] = useState(false);

  const handleEditEvent = () => {
    const db = getDatabase();
    const eventRef = ref(db, `events/${event.id}`);
    update(eventRef, {
      name: eventName,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    }).then(() => {
      alert(`Event "${eventName}" updated!`);
      onClose();
    }).catch((error) => {
      alert("Failed to update event: " + error.message);
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LogoComponent />
      <Card style={styles.card}>
        <Card.Content>
          <Text style={{ color: theme.colors.text, marginBottom: 20 }}>Edit Event</Text>
          <TextInput
            mode="outlined"
            label="Event Name"
            value={eventName}
            onChangeText={setEventName}
            style={styles.input}
            right={<TextInput.Icon name="calendar" />}
          />
          {/* Start Date Picker */}
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
          {/* End Date Picker */}
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
          {/* Start Time Picker */}
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
          {/* End Time Picker */}
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
            onPress={handleEditEvent}
            style={styles.button}
          >
            Update Event
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
    padding: 8,
    marginVertical: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default EventEditForm;

