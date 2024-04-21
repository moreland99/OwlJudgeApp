import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

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
    const auth = getAuth(app);
    const db = getDatabase(app);
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Authenticated UID:", user.uid);
        const eventsRef = ref(db, 'events/');
        const judgesRef = ref(db, 'judges/');
        const projectsRef = ref(db, 'projects/');
        
        onValue(eventsRef, snapshot => {
          const eventData = snapshot.val() || {};
          setEvents(Object.keys(eventData).map(key => ({ id: key, ...eventData[key] })));
          setFilteredEvents(Object.keys(eventData).map(key => ({ id: key, ...eventData[key] })));
        }, error => {
          Alert.alert("Firebase Error", "Failed to fetch events: " + error.message);
        });

        onValue(judgesRef, snapshot => {
          const judgeData = snapshot.val() || {};
          setJudges(Object.keys(judgeData).map(key => ({ id: key, ...judgeData[key] })));
          setFilteredJudges(Object.keys(judgeData).map(key => ({ id: key, ...judgeData[key] })));
        }, error => {
          console.error("Firebase Error", error);
          Alert.alert("Firebase Error", "Failed to fetch judges: " + error.message);
        });

        onValue(projectsRef, snapshot => {
          const projectData = snapshot.val() || {};
          setProjects(Object.keys(projectData).map(key => ({ id: key, ...projectData[key] })));
          setFilteredProjects(Object.keys(projectData).map(key => ({ id: key, ...projectData[key] })));
        }, error => {
          Alert.alert("Firebase Error", "Failed to fetch projects: " + error.message);
        });
      } else {
        console.log("No authenticated user");
      }
    });

    return () => unsubscribeAuth(); // Clean up auth listener
  }, []);

  const handleSearchEvent = text => {
    setSearchEvent(text);
    setFilteredEvents(events.filter(e => e.name.toLowerCase().includes(text.toLowerCase())));
  };

  const handleSearchJudge = text => {
    setSearchJudge(text);
    setFilteredJudges(judges.filter(j => j.email.toLowerCase().includes(text.toLowerCase())));
  };

  const handleSearchProject = text => {
    setSearchProject(text);
    setFilteredProjects(projects.filter(p => p.name.toLowerCase().includes(text.toLowerCase())));
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

  const assignProjectToJudge = () => {
    if (!selectedProject || !selectedJudge) {
      Alert.alert("Selection Missing", "Please select both a project and a judge.");
      return;
    }

    const db = getDatabase(app);
    const projectAssignmentsRef = ref(db, `judges/${selectedJudge.id}/assignedProjects`);

    get(projectAssignmentsRef).then((snapshot) => {
      const currentAssignments = snapshot.val() || [];
      if (!currentAssignments.includes(selectedProject.id)) {
        const updatedAssignments = [...currentAssignments, selectedProject.id];
        set(projectAssignmentsRef, updatedAssignments)
          .then(() => Alert.alert("Assignment Complete", "Project has been assigned to the judge successfully."))
          .catch(error => Alert.alert("Assignment Failed", error.message));
      } else {
        Alert.alert("Assignment Exists", "This judge is already assigned to the selected project.");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button icon="arrow-left" mode="outlined" onPress={() => navigation.goBack()}>Go Back</Button>
      <TextInput placeholder="Search for an event" value={searchEvent} onChangeText={handleSearchEvent} style={styles.searchInput} />
      <FlatList data={filteredEvents} keyExtractor={item => item.id} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelectedEvent(item)} style={[styles.listItem, { backgroundColor: item.id === selectedEvent?.id ? '#e0e0e0' : '#f9f9f9' }]}>
          <Text style={styles.listItemText}>{item.name}</Text>
        </TouchableOpacity>
      )} />
      <TextInput placeholder="Search for a judge" value={searchJudge} onChangeText={handleSearchJudge} style={styles.searchInput} />
      <FlatList data={filteredJudges} keyExtractor={item => item.id} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelectedJudge(item)} style={[styles.listItem, { backgroundColor: item.id === selectedJudge?.id ? '#e0e0e0' : '#f9f9f9' }]}>
          <Text style={styles.listItemText}>{item.email}</Text>
        </TouchableOpacity>
      )} />
      <Button mode="contained" onPress={assignJudgeToEvent} style={styles.button}>Assign Judge</Button>
      <TextInput placeholder="Search for a project" value={searchProject} onChangeText={handleSearchProject} style={styles.searchInput} />
      <FlatList data={filteredProjects} keyExtractor={item => item.id} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelectedProject(item)} style={[styles.listItem, { backgroundColor: item.id === selectedProject?.id ? '#e0e0e0' : '#f9f9f9' }]}>
          <Text style={styles.listItemText}>{item.name}</Text>
        </TouchableOpacity>
      )} />
      <Button mode="contained" onPress={assignProjectToJudge} style={styles.button}>Assign Project</Button>
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
  button: {
    marginVertical: 10,
  }
});

export default AssignJudgesScreen;
