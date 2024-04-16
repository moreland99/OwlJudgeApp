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
      const judgeProfileRef = ref(getDatabase(app), `judges/${user.uid}/assignedEvents`);
      get(judgeProfileRef).then((snapshot) => {
        if (snapshot.exists()) {
          const assignedEventIds = snapshot.val();
          const eventsFetchPromises = assignedEventIds.map(eventId =>
            get(ref(getDatabase(app), `events/${eventId}`))
          );
          Promise.all(eventsFetchPromises).then(eventSnapshots => {
            const assignedEvents = eventSnapshots.map(snap => ({ ...snap.val(), id: snap.key }));
            setEvents(assignedEvents);
          });
        }
      });
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