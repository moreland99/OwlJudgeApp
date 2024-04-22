import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';
import { parseISO, isAfter, compareAsc, format } from 'date-fns'; // Ensure you have 'date-fns' installed for date operations

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const theme = CustomTheme;
  const auth = getAuth();

  useEffect(() => {
    const today = new Date(); // Today's date object for comparison
    const eventsRef = ref(getDatabase(app), 'events');
    get(eventsRef).then(snapshot => {
      if (snapshot.exists()) {
        let loadedEvents = [];
        snapshot.forEach(childSnapshot => {
          const eventData = childSnapshot.val();
          // Parse the endDate from ISO and compare
          const eventEndDate = parseISO(eventData.endDate);
          if (isAfter(eventEndDate, today)) { // Only include events where the end date is after today
            loadedEvents.push({
              id: childSnapshot.key,
              ...eventData,
            });
          }
        });
        // Sort events by start date in ascending order
        loadedEvents.sort((a, b) => compareAsc(parseISO(a.startDate), parseISO(b.startDate)));
        setEvents(loadedEvents); // Set the sorted events into state
      } else {
        console.log('No events found.');
        setEvents([]); // If no events found, set the events state to an empty array
      }
    }).catch(error => {
      console.error('Error fetching events:', error);
    });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <Card style={[styles.item, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>{item.name}</Title>
          <Paragraph>
            {item.startDate === item.endDate ?
              `On: ${format(parseISO(item.startDate), 'PPPP')}` :
              `From: ${format(parseISO(item.startDate), 'PPPP')} To: ${format(parseISO(item.endDate), 'PPPP')}`}
          </Paragraph>
          <Paragraph>
            Time: {format(parseISO(item.startTime), 'p')} - {format(parseISO(item.endTime), 'p')}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LogoComponent /> 
      <FlatList
  data={events}
  renderItem={renderItem}
  keyExtractor={item => item.id}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default EventListScreen;
