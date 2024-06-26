import React, { useState, useEffect } from 'react';
import {ScrollView, StyleSheet, View, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    const newProjectRef = push(projectsRef); // This generates a new unique key for the project
  
    const newProject = {
      id: newProjectRef.key,
      teamMembers,
      title,
      summary,
      event: selectedEvent
    };
  
    set(newProjectRef, newProject) // Use 'set' instead of 'push' to set the project data
      .then(() => {
        alert('Project submitted successfully with ID ' + newProjectRef.key + '!');
        navigation.navigate('AdminDashboard'); // Changed from goBack to navigate
      })
      .catch((error) => {
        alert("Failed to submit project: " + error.message);
      });
  };

  

  return (
    <KeyboardAwareScrollView
  contentContainerStyle={[styles.container, { justifyContent: 'center' }]} // Add specific layout styles here
  extraScrollHeight={20}
  enableOnAndroid={true}
  keyboardShouldPersistTaps="handled"
>
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
    </KeyboardAwareScrollView>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 10,
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



