import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const ProjectSubmissionScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  // Add more states as needed for project submission

  const handleSubmit = () => {
    alert('Project submitted successfully!');
    // Later, this will integrate with your backend
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Submit Your Project</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <TextInput
        style={styles.input}
        placeholder="Project Description"
        value={projectDescription}
        onChangeText={setProjectDescription}
        multiline
      />
      {/* Add more inputs as needed */}
      <Button title="Submit Project" onPress={handleSubmit} />
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
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});

export default ProjectSubmissionScreen;
