import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const database = getDatabase(app);
    const eventsRef = ref(database, 'events');

    // Listen for database changes, updating state accordingly
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedEvents = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      setEvents(loadedEvents);
    }, {
      onlyOnce: true // If you want to fetch the data only once; remove this option if you want real-time updates
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={[styles.item, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Title style={{ color: theme.colors.onSurface }}>{item.name}</Title>
        <Paragraph>{item.date}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LogoComponent />
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddEvent')}
        style={{ margin: 10 }}
      >
        Add New Event
      </Button>
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