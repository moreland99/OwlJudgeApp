import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Modal } from 'react-native';
import { Button, Card, Title, Paragraph, FAB, useTheme } from 'react-native-paper';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import EventAddForm from './EventAddScreen'; // This component is for adding new events
import EventEditForm from './EventEditForm'; // Assuming this is your event edit form component

// Utility functions to format dates and times safely
const formatDate = (dateString) => {
  if (!dateString) return 'No date provided';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Invalid date' : new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(date);
};

const formatTime = (timeString) => {
  if (!timeString) return 'No time provided';
  const time = new Date(timeString);
  return isNaN(time.getTime()) ? 'Invalid time' : new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(time);
};


// Function to delete an event
const deleteEvent = (eventId) => {
  Alert.alert("Confirm Delete", "Are you sure you want to delete this event?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "OK", onPress: () => {
        const db = getDatabase();
        const eventRef = ref(db, `events/${eventId}`);
        remove(eventRef).then(() => Alert.alert("Event deleted successfully")).catch(error => Alert.alert("Failed to delete event", error.message));
      }
    }
  ]);
};

const EventDashboardScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const eventsRef = ref(db, 'events/');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedEvents = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setEvents(loadedEvents);
    });
  }, []);

  // Function to trigger event edit modal
  const editEvent = (event) => {
    setCurrentEvent(event);
    setIsEditModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {events.map((event) => (
          <TouchableOpacity key={event.id} onPress={() => { /* Navigate to event detail if necessary */ }}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={{ color: theme.colors.primary }}>{event.name}</Title>
                <Paragraph>Start Date: {formatDate(event.startDate)} at {formatTime(event.startTime)}</Paragraph>
                <Paragraph>End Date: {formatDate(event.endDate)} at {formatTime(event.endTime)}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => editEvent(event)}>Edit</Button>
                <Button onPress={() => deleteEvent(event.id)}>Delete</Button>
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEvent')}
        theme={{ colors: { accent: theme.colors.accent } }}
      />
      
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        {/* Assuming EventEditForm is a component you've created for editing events */}
        <EventEditForm event={currentEvent} onClose={() => setIsEditModalVisible(false)} />
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
    borderRadius: 8,
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default EventDashboardScreen;

 