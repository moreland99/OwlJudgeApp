import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Import Picker from the new package

const AssignJudgesScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [judges, setJudges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredJudges, setFilteredJudges] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchEvent, setSearchEvent] = useState('');
  const [searchJudge, setSearchJudge] = useState('');
  const [searchProject, setSearchProject] = useState('');

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
      console.error("Firebase Error", error);
      Alert.alert("Firebase Error", "Failed to fetch judges: " + error.message);
    });

    // Fetch projects
    const projectsRef = ref(db, 'projects/');
    onValue(projectsRef, snapshot => {
      const projectData = snapshot.val() || {};
      const projectsArray = Object.keys(projectData).map(key => ({
        id: key,
        ...projectData[key]
      }));
      setProjects(projectsArray);
    }, error => {
      Alert.alert("Firebase Error", "Failed to fetch projects: " + error.message);
    });

  }, []);

  useEffect(() => {
    // Filter projects based on selected event
    if (selectedEvent) {
      const filtered = projects.filter(project => project.eventId === selectedEvent.id);
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects([]);
    }
  }, [selectedEvent]);

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

  const handleSearchProject = text => {
    setSearchProject(text);
    if (!text.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => project.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredProjects(filtered);
    }
  };
  
  const assignJudgeToEventAndProject = () => {
    if (!selectedEvent || !selectedJudge || !selectedProject) {
      Alert.alert("Selection Missing", "Please select an event, a judge, and a project.");
      return;
    }

    const db = getDatabase(app);
    const judgeAssignmentsRef = ref(db, `judges/${selectedJudge.id}/assignedEvents`);
    const projectAssignmentsRef = ref(db, `judges/${selectedJudge.id}/assignedProjects`);

    // Update judge's assigned events
    get(judgeAssignmentsRef).then((snapshot) => {
      const currentEventAssignments = snapshot.val() || [];
      if (!currentEventAssignments.includes(selectedEvent.id)) {
        const updatedEventAssignments = [...currentEventAssignments, selectedEvent.id];
        set(judgeAssignmentsRef, updatedEventAssignments)
          .then(() => {
            // Update judge's assigned projects
            get(projectAssignmentsRef).then((snapshot) => {
              const currentProjectAssignments = snapshot.val() || [];
              if (!currentProjectAssignments.includes(selectedProject.id)) {
                const updatedProjectAssignments = [...currentProjectAssignments, selectedProject.id];
                set(projectAssignmentsRef, updatedProjectAssignments)
                  .then(() => Alert.alert("Assignment Complete", "Judge and project have been assigned to the event successfully."))
                  .catch(error => Alert.alert("Assignment Failed", error.message));
              } else {
                Alert.alert("Assignment Exists", "This judge is already assigned to the selected project.");
              }
            });
          })
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
      {selectedEvent && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select a Project:</Text>
          <Picker
            selectedValue={selectedProject}
            onValueChange={(itemValue, itemIndex) => setSelectedProject(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Project" value={null} />
            {filteredProjects.map(project => (
              <Picker.Item key={project.id} label={project.name} value={project} />
            ))}
          </Picker>
        </View>
      )}
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
        onPress={assignJudgeToEventAndProject}
        style={styles.button}>
        Assign Judge and Project
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
  },
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default AssignJudgesScreen;

