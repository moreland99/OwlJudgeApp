import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const theme = CustomTheme;
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Reference to the assigned events for the logged-in judge
      const assignedEventsRef = ref(getDatabase(app), `judges/${user.uid}/assignedEvents`);
      get(assignedEventsRef).then(snapshot => {
        if (snapshot.exists()) {
          // Get the event IDs from the snapshot
          const eventIDs = Object.keys(snapshot.val()).filter(key => snapshot.val()[key] === true);
          
          // Fetch details for each event ID
          const eventDetailsPromises = eventIDs.map(eventId =>
            get(ref(getDatabase(app), `events/${eventId}`))
          );
          
          Promise.all(eventDetailsPromises).then(eventSnapshots => {
            const loadedEvents = eventSnapshots.map(snap => ({
              id: snap.key,
              ...snap.val(),
            }));
            setEvents(loadedEvents); // Set the loaded events into state
          });
        } else {
          console.log('No assigned events found.');
          setEvents([]); // If no events are assigned, set the events state to an empty array
        }
      }).catch(error => {
        console.error('Error fetching assigned events:', error);
      });
    } else {
      console.log('No user logged in.');
    }
  }, []);
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <Card style={[styles.item, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>{item.name}</Title>
          <Paragraph>{item.date}</Paragraph>
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