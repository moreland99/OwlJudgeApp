import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const ProjectSubmissionScreen = ({ navigation }) => {
  const theme = useTheme();
  const [teamMembers, setTeamMembers] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');


  useEffect(() => {
    const database = getDatabase(app);
    const eventsRef = ref(database, 'events');

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedEvents = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      setEvents(loadedEvents);
    }, {
      onlyOnce: true
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = () => {
    const database = getDatabase(app);
    const projectsRef = ref(database, 'projects');
    const newProjectRef = push(projectsRef);

    const newProject = {
      id: newProjectRef.key,
      teamMembers,
      title,
      summary,
      event: selectedEvent
    };

    push(newProjectRef, newProject)
      .then(() => {
        alert('Project submitted successfully with ID ' + newProjectRef.key + '!');
        navigation.goBack();
      })
      .catch((error) => {
        alert("Failed to submit project: " + error.message);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LogoComponent />
      <Text style={[styles.title, {color: theme.colors.text}]}>Submit Your Project</Text>
      <Picker
        selectedValue={selectedEvent}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSelectedEvent(itemValue)}
      >
        {events.map((event) => (
          <Picker.Item key={event.id} label={event.name} value={event.id} />
        ))}
      </Picker>
      <TextInput
        mode="outlined"
        label="Team Members"
        placeholder="Enter team members separated by commas"
        value={teamMembers}
        onChangeText={setTeamMembers}
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary }}}
      />
      <TextInput
        mode="outlined"
        label="Project Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary }}}
      />
      <TextInput
        mode="outlined"
        label="Project Summary"
        value={summary}
        onChangeText={setSummary}
        style={styles.inputLarge}
        theme={{ colors: { primary: theme.colors.primary }}}
      />
      <Button 
        mode="contained" 
        onPress={handleSubmit} 
        style={styles.button}
        color={theme.colors.primary}
      >
        Submit Project
      </Button>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    //justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  inputLarge: {
    height: 100, // Adjust the height for a larger input area
  },
  button: {
    marginTop: 20,
  },
});


export default ProjectSubmissionScreen;



