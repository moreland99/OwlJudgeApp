import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute hook

const AssignJudgesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use useRoute hook to access route object
  const [events, setEvents] = useState([]);
  const [judges, setJudges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredJudges, setFilteredJudges] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchEvent, setSearchEvent] = useState("");
  const [searchJudge, setSearchJudge] = useState("");
  const [searchProject, setSearchProject] = useState("");

  useEffect(() => {
    const db = getDatabase(app);

    // Fetch events
    const eventsRef = ref(db, "events/");
    onValue(
      eventsRef,
      (snapshot) => {
        const eventData = snapshot.val() || {};
        const eventsArray = Object.keys(eventData).map((key) => ({
          id: key,
          ...eventData[key],
        }));
        setEvents(eventsArray);
        setFilteredEvents(eventsArray);
      },
      (error) => {
        Alert.alert(
          "Firebase Error",
          "Failed to fetch events: " + error.message
        );
      }
    );

    // Fetch judges
    const judgesRef = ref(db, "judges/");
    onValue(
      judgesRef,
      (snapshot) => {
        const judgeData = snapshot.val() || {};
        const judgesArray = Object.keys(judgeData).map((key) => ({
          id: key,
          ...judgeData[key],
        }));
        setJudges(judgesArray);
        setFilteredJudges(judgesArray);
      },
      (error) => {
        console.error("Firebase Error", error);
        Alert.alert(
          "Firebase Error",
          "Failed to fetch judges: " + error.message
        );
      }
    );

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

    // Check if there are navigation parameters
    if (route.params) {
      const { judgeId, eventId, projectId } = route.params;
      if (judgeId) {
        setSelectedJudge(judgeId);
      }
      if (eventId) {
        setSelectedEvent(eventId);
      }
      if (projectId) {
        setSelectedProject(projectId);
      }
    }
  }, [route.params]);

  useEffect(() => {
    console.log("Projects loaded:", projects);
    console.log("Selected event ID:", selectedEvent?.id);

    if (selectedEvent) {
      const filtered = projects.filter((project) => {
        console.log("Project event ID:", project.event);
        return String(project.event) === String(selectedEvent.id);
      });

      console.log(`Filtered projects for event ${selectedEvent.id}:`, filtered);
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects([]);
    }
  }, [selectedEvent, projects]);

  const handleSearchEvent = (text) => {
    setSearchEvent(text);
    if (!text.trim()) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((e) =>
        e.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };

  const handleSearchJudge = (text) => {
    setSearchJudge(text);
    if (!text.trim()) {
      setFilteredJudges(judges);
    } else {
      const filtered = judges.filter((j) =>
        j.email.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJudges(filtered);
    }
  };

  const handleSearchProject = (text) => {
    setSearchProject(text);
    if (!text.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  // Make sure to update the selectedProject with an object, not just the id
  const onProjectSelected = (itemValue) => {
    const project = projects.find((p) => p.id === itemValue);
    setSelectedProject(project);
  };

  const handleSelectProject = (project) => {
    if (selectedProjects.some(selected => selected.id === project.id)) {
      setSelectedProjects(selectedProjects.filter(selected => selected.id !== project.id));
    } else {
      setSelectedProjects([...selectedProjects, project]);
    }
  };

  const assignJudgeToEventAndProject = () => {
    if (!selectedEvent || !selectedJudge || selectedProjects.length === 0) {
      Alert.alert("Selection Missing", "Please select an event, a judge, and at least one project.");
      return;
    }

    const db = getDatabase(app);
    const updates = {};

    
    updates[
      `judges/${selectedJudge.id}/assignedEvents/${selectedEvent.id}`
    ] = true;
    updates[
      `judges/${selectedJudge.id}/assignedProjects/${selectedProject.id}`
    ] = true;

    update(ref(db), updates)
      .then(() =>
        Alert.alert(
          "Assignment Complete",
          "Judge and project have been assigned to the event successfully."
        )
      )
      .catch((error) =>
        Alert.alert(
          "Assignment Failed",
          "Failed to assign judge and project: " + error.message
        )
      );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Button
              icon="arrow-left"
              mode="outlined"
              onPress={() => navigation.goBack()}
            >
              Go Back
            </Button>
            <TextInput
              placeholder="Search for an event"
              value={searchEvent}
              onChangeText={handleSearchEvent}
              style={styles.searchInput}
            />
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedEvent(item)}
            style={[
              styles.listItem,
              {
                backgroundColor: item.id === selectedEvent?.id ? "#e0e0e0" : "#f9f9f9",
              },
            ]}
          >
            <Text style={styles.listItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
            {selectedEvent && (
              <View style={styles.section}>
                <Text style={styles.label}>Projects for the selected event:</Text>
                <FlatList
                  data={filteredProjects}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedProject(item)}
                      style={[
                        styles.listItem,
                        {
                          backgroundColor: item.id === selectedProject?.id ? "#e0e0e0" : "#f9f9f9",
                        },
                      ]}
                    >
                      <Text style={styles.listItemText}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />
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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedJudge(item)}
                  style={[
                    styles.listItem,
                    {
                      backgroundColor: item.id === selectedJudge?.id ? "#e0e0e0" : "#f9f9f9",
                    },
                  ]}
                >
                  <Text style={styles.listItemText}>{item.email}</Text>
                </TouchableOpacity>
              )}
            />
            <Button
              mode="contained"
              onPress={assignJudgeToEventAndProject}
              style={styles.button}
            >
              Assign Judge and Project
            </Button>
          </>
        }
      />
    </KeyboardAvoidingView>
  );
  
  
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between", // Adjusted to space out the content
  },
  section: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
  listItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  pickerContainer: {
    marginTop: 20, // Add space above the picker container
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
  button: {
    marginVertical: 20, // Increase vertical margin for the button
  },
  // Add any additional styles you need for other elements
});

export default AssignJudgesScreen;
