import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, useTheme, Card, IconButton } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import LogoComponent from '../components/LogoComponent';

const EventAddScreen = ({ navigation }) => {
  const theme = useTheme();
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [openTimePickerStart, setOpenTimePickerStart] = useState(false);
  const [openTimePickerEnd, setOpenTimePickerEnd] = useState(false);

  const handleAddEvent = () => {
    alert(`Event "${eventName}" added!`);
    navigation.goBack();
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
            right={<TextInput.Icon name="calendar" />}
          />
          <Button icon="calendar" mode="outlined" onPress={() => setOpenStartDatePicker(true)} style={styles.button}>
            Pick Start Date
          </Button>
          <DatePickerModal
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
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default EventAddScreen;
