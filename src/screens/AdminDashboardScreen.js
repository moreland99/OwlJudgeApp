import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, useTheme, Modal, Portal, List } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { assignJudgeToEvent } from '../firebase/firebaseOperations';

const AdminDashboardScreen = ({ navigation }) => {
  // State for event, project, judge counts, and recent scores
  const [eventCount, setEventCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [judgeCount, setJudgeCount] = useState(0);
  const [recentScores, setRecentScores] = useState([]);
  // State for modal visibility
  const [isModalVisible, setModalVisible] = useState(false);
  // State for lists of events and judges
  const [eventsList, setEventsList] = useState([]);
  const [judgesList, setJudgesList] = useState([]);
  // State for selected event and judge
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedJudgeId, setSelectedJudgeId] = useState(null);
  
  const theme = useTheme();

  useEffect(() => {
    const db = getDatabase();
    // Fetch events
    const eventListRef = ref(db, 'events/');
    onValue(eventListRef, (snapshot) => {
      const events = [];
      snapshot.forEach((childSnapshot) => {
        events.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setEventsList(events);
      setEventCount(events.length);
    });

    // Fetch judges
    const judgeListRef = ref(db, 'judges/');
    onValue(judgeListRef, (snapshot) => {
      const judges = [];
      snapshot.forEach((childSnapshot) => {
        judges.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setJudgesList(judges);
      setJudgeCount(judges.length);
    });

    // Fetch scores (the existing logic here seems to be for a different purpose)
    // ...
  }, []);

  // Function to handle opening the modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to handle selecting an event
  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
  };

  // Function to handle selecting a judge
  const handleSelectJudge = (judgeId) => {
    setSelectedJudgeId(judgeId);
  };

  // Function to handle assigning the selected judge to the selected event
  const handleAssignJudge = () => {
    if (selectedEventId && selectedJudgeId) {
      assignJudgeToEvent(selectedEventId, selectedJudgeId)
        .then(() => {
          setModalVisible(false);
          Alert.alert('Success', 'Judge has been assigned to the event.');
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    } else {
      Alert.alert('Error', 'Please select both an event and a judge.');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={styles.title}>Admin Dashboard</Text>
          
          {/* Stats Display */}
          <Text style={styles.statText}>Total Events: {eventCount}</Text>
          <Text style={styles.statText}>Total Projects: {projectCount}</Text>
          <Text style={styles.statText}>Total Judges: {judgeCount}</Text>
          
          {/* Quick Link Buttons */}
          <Button 
            icon="calendar-check" 
            mode="contained" 
            onPress={() => navigation.navigate('Event List')}
            style={styles.button}
            color={theme.colors.primary}>View Events</Button>
          <Button 
            icon="account-group" 
            mode="contained" 
            onPress={() => navigation.navigate('Judge Details')}
            style={styles.button}
            color={theme.colors.accent}>View Judges</Button>
          <Button 
            icon="book-open-page-variant" 
            mode="contained" 
            onPress={() => navigation.navigate('Project Submission')}
            style={styles.button}
            color={theme.colors.primary}>View Projects</Button>
          <Button 
            icon="scoreboard" 
            mode="contained" 
            onPress={() => navigation.navigate('Scoring & Feedback')}
            style={styles.button}
            color={theme.colors.accent}>View Scores</Button>

          <Button
            icon="account-plus"
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.button}
            color={theme.colors.primary}>
            Assign Judges to Events
          </Button>
        </Card.Content>
      </Card>
      <Portal>
        <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Card>
            <Card.Title title="Assign Judge to Event" />
            <Card.Content>
              {/* Dropdown for selecting an event */}
              <List.Accordion
                title="Select Event"
                expanded={selectedEventId !== null}>
                {eventsList.map(event => (
                  <List.Item
                    key={event.id}
                    title={event.name}
                    onPress={() => setSelectedEventId(event.id)}
                  />
                ))}
              </List.Accordion>
              {/* Dropdown for selecting a judge */}
              <List.Accordion
                title="Select Judge"
                expanded={selectedJudgeId !== null}>
                {judgesList.map(judge => (
                  <List.Item
                    key={judge.id}
                    title={judge.email}
                    onPress={() => setSelectedJudgeId(judge.id)}
                  />
                ))}
              </List.Accordion>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {
                assignJudgeToEvent(selectedEventId, selectedJudgeId);
                setModalVisible(false);
              }}>Assign</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
  },
});

export default AdminDashboardScreen;