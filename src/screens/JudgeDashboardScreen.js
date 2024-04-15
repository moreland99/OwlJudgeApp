import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, onValue, off } from 'firebase/database';
import CustomTheme from '../../theme';

const JudgeDashboardScreen = () => {
  const [assignedEvents, setAssignedEvents] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();

  useEffect(() => {
    if (user) {
      const judgeProfileRef = ref(db, `judges/${user.uid}/assignedEvents`);

      const listener = onValue(judgeProfileRef, async (snapshot) => {
        const assignedEventIds = snapshot.val() || [];
        console.log('Assigned Event IDs:', assignedEventIds); // Log the assigned event IDs
        const eventDetailsPromises = assignedEventIds.map((eventId) => get(ref(db, `events/${eventId}`)));

        const eventSnapshots = await Promise.all(eventDetailsPromises);
        const fetchedEvents = eventSnapshots.map((snap) => ({
          id: snap.key,
          ...snap.val(),
        }));

        console.log('Fetched Events:', fetchedEvents); // Log the fetched events
        setAssignedEvents(fetchedEvents);
      });

      // Clean up listener on unmount
      return () => {
        off(judgeProfileRef, 'value', listener);
      };
    }
  }, [user]); // Dependency array includes `user` to re-run the effect when the user changes

  const greetUser = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  };

  const renderEventCard = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        {/* Add other details as needed */}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{`${greetUser()} ${user.displayName || user.email}`}</Text>
      <FlatList
        horizontal
        data={assignedEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalList}
      />
      {/* Additional UI components can be added here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CustomTheme.spacing(2),
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: CustomTheme.spacing(2),
  },
  horizontalList: {
    flexGrow: 0,
  },
  card: {
    margin: CustomTheme.spacing(1),
    width: 250,
    borderRadius: 8,
    elevation: 3,
  },
  // ... other styles
});

export default JudgeDashboardScreen;

