import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const AssignJudgesScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [judges, setJudges] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredJudges, setFilteredJudges] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [searchEvent, setSearchEvent] = useState('');
  const [searchJudge, setSearchJudge] = useState('');

  useEffect(() => {
    const db = getDatabase(app);

    // Fetch events
    const eventsRef = ref(db, 'events/');
    onValue(eventsRef, snapshot => {
      const eventData = snapshot.val() || {};
      const eventsArray = Object.keys(eventData).map(key => ({
        id: key,
        ...eventData[key]
      }));
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
    }, error => {
      Alert.alert("Firebase Error", "Failed to fetch events: " + error.message);
    });

    // Fetch judges
    const judgesRef = ref(db, 'judges/');
    onValue(judgesRef, snapshot => {
      const judgeData = snapshot.val() || {};
      const judgesArray = Object.keys(judgeData).map(key => ({
        id: key,
        ...judgeData[key]
      }));
      setJudges(judgesArray);
      setFilteredJudges(judgesArray);
    }, error => {
      Alert.alert("Firebase Error", "Failed to fetch judges: " + error.message);
    });
  }, []);

  const handleSearchEvent = text => {
    setSearchEvent(text);
    if (!text.trim()) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(e => e.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredEvents(filtered);
    }
  };

  const handleSearchJudge = text => {
    setSearchJudge(text);
    if (!text.trim()) {
      setFilteredJudges(judges);
    } else {
      const filtered = judges.filter(j => j.email.toLowerCase().includes(text.toLowerCase()));
      setFilteredJudges(filtered);
    }
  };

  const assignJudgeToEvent = () => {
    if (!selectedEvent || !selectedJudge) {
      Alert.alert("Selection Missing", "Please select both an event and a judge.");
      return;
    }

    const db = getDatabase(app);
    const judgeAssignmentsRef = ref(db, `judges/${selectedJudge.id}/assignedEvents`);

    get(judgeAssignmentsRef).then((snapshot) => {
      const currentAssignments = snapshot.val() || [];
      if (!currentAssignments.includes(selectedEvent.id)) {
        const updatedAssignments = [...currentAssignments, selectedEvent.id];
        set(judgeAssignmentsRef, updatedAssignments)
          .then(() => Alert.alert("Assignment Complete", "Judge has been assigned to the event successfully."))
          .catch(error => Alert.alert("Assignment Failed", error.message));
      } else {
        Alert.alert("Assignment Exists", "This judge is already assigned to the selected event.");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button icon="arrow-left" mode="outlined" onPress={() => navigation.goBack()}>
        Go Back
      </Button>
      <TextInput
        placeholder="Search for an event"
        value={searchEvent}
        onChangeText={handleSearchEvent}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedEvent(item)}
            style={[
              styles.listItem,
              { backgroundColor: item.id === selectedEvent?.id ? '#e0e0e0' : '#f9f9f9' }
            ]}>
            <Text style={styles.listItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TextInput
        placeholder="Search for a judge"
        value={searchJudge}
        onChangeText={handleSearchJudge}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredJudges}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedJudge(item)}
            style={[
              styles.listItem,
              { backgroundColor: item.id === selectedJudge?.id ? '#e0e0e0' : '#f9f9f9' }
            ]}>
            <Text style={styles.listItemText}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
      <Button
        mode="contained"
        onPress={assignJudgeToEvent}
        style={styles.button}>
        Assign Judge
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  listItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  }
});

export default AssignJudgesScreen;

