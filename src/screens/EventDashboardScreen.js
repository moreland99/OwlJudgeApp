import React, { useState, useEffect } from 'react';
import { ScrollView, View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, useTheme } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import EventAddForm from './EventAddScreen'; // This component is assumed to be a modal-ready form

const EventDashboardScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const eventsRef = ref(db, 'events/');
    onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedEvents = data ? Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        })) : [];
        setEvents(loadedEvents);
    });
}, []);

const dynamicStyles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
      {events.map((event) => (
    <TouchableOpacity key={event.id} onPress={() => { /* Navigate to event detail */ }}>
        <Card style={styles.card}>
            <Card.Content>
                <Title style={{ color: theme.colors.primary }}>{event.name}</Title>
                <Paragraph>Start Date: {event.startDate}</Paragraph>
                <Paragraph>End Date: {event.endDate}</Paragraph>
                <Paragraph>Start Time: {event.startTime}</Paragraph>
                <Paragraph>End Time: {event.endTime}</Paragraph>
            </Card.Content>
        </Card>
    </TouchableOpacity>
))}
      </ScrollView>
      <FAB
  style={dynamicStyles.fab}
  icon="plus"
  onPress={() => navigation.navigate('AddEvent')}
  theme={{ colors: { accent: theme.colors.accent } }}
/>
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <EventAddForm onClose={() => setAddModalVisible(false)} />
      </Modal>
    </View>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  card: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 8, // Rounded corners for a modern look
    elevation: 4, // Subtle shadow for depth
  },
});

export default EventDashboardScreen;
