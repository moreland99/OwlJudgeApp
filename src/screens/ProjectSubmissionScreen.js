import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Menu, Divider, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const ProjectSubmissionScreen = ({ navigation }) => {
  const theme = useTheme();
  const [projectNumber, setProjectNumber] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sponsoringCompany, setSponsoringCompany] = useState('');

  const handleSubmit = () => {
    const database = getDatabase(app);
    const projectsRef = ref(database, 'projects');
    const newProjectRef = push(projectsRef);
  
    const newProject = {
      id: newProjectRef.key,
      projectNumber,
      title,
      selectedCategory,
      selectedTopic,
      sponsoringCompany,
      event: '', // You will need to update this with the event ID
      assignedJudge: '' // And this with the judge ID
    };
  
    set(newProjectRef, newProject)
      .then(() => {
        alert('Project submitted successfully with ID ' + newProjectRef.key + '!');
        navigation.goBack();
      })
      .catch((error) => {
        alert("Failed to submit project: " + error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}>
      <LogoComponent />
      <Text style={[styles.title, {color: theme.colors.text}]}>Submit Your Project</Text>
      <TextInput
        mode="outlined"
        label="Project Number"
        value={projectNumber}
        onChangeText={setProjectNumber}
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary }}}
      />
      <TextInput
        mode="outlined"
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary }}}
      />
      {/* Implement Category and Topic selection UI */}
      <TextInput
        mode="outlined"
        label="Sponsoring Company"
        value={sponsoringCompany}
        onChangeText={setSponsoringCompany}
        style={styles.input}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default ProjectSubmissionScreen;

