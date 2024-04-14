import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Card, Paragraph, Title, useTheme } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase/firebaseConfig'; // Make sure your Firebase config is correctly imported

const JudgeDashboardScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const theme = useTheme();
  const [judgesList, setJudgesList] = useState([]);
const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    const db = getDatabase(app);
    const eventsRef = ref(db, 'events');

    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedEvents = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      setEvents(loadedEvents);

      // Fetch judges
  const judgesRef = ref(db, 'judges/');
  onValue(judgesRef, (snapshot) => {
    const judgesData = snapshot.val() || {};
    const judgesArray = Object.keys(judgesData).map(key => ({
      id: key,
      ...judgesData[key]
    }));
    setJudgesList(judgesArray);
  });

  // Fetch events
  const eventsRef = ref(db, 'events/');
  onValue(eventsRef, (snapshot) => {
    const eventsData = snapshot.val() || {};
    const eventsArray = Object.keys(eventsData).map(key => ({
      id: key,
      ...eventsData[key]
    }));
    setEventsList(eventsArray);
  });

      // Update calendar marked dates
      const newMarkedDates = {};
      loadedEvents.forEach(event => {
        newMarkedDates[event.date] = { marked: true, dotColor: 'blue', activeOpacity: 0.5 };
      });
      setMarkedDates(newMarkedDates);
    });
  }, []);

  const renderItem = ({ item }) => (
    <Card onPress={() => navigation.navigate('EventDetails', { eventId: item.id })} style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.date}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Judge Dashboard</Text>
      <Calendar
        markingType={'dot'}
        markedDates={markedDates}
      />
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    margin: 10,
    padding: 10,
  },
  list: {
    marginVertical: 20,
  },
});

export default JudgeDashboardScreen;

