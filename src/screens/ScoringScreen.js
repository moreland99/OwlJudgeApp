import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, get, set, push, auth } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';  // Ensure the correct path is used

const ScoringScreen = ({ route, navigation }) => {
  const { projectId } = route.params;  // Ensure projectId is passed correctly
  const [projectDetails, setProjectDetails] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const auth = getAuth(app);
  const user = auth.currentUser;

  useEffect(() => {
    if (projectId) {
      const projectRef = ref(getDatabase(app), `projects/${projectId}`);
      get(projectRef).then((snapshot) => {
        if (snapshot.exists()) {
          // Assuming that the project data might be nested under an unknown key
          const projectData = snapshot.val();
          const projectKey = Object.keys(projectData)[0]; // This gets the first key under the project
          const details = projectData[projectKey];
          console.log('Project details:', details);  // Debugging: Log fetched data
          setProjectDetails(details);
        } else {
          console.log('No project data available');  // Debugging: Log if no data
        }
      }).catch((error) => {
        console.error('Error fetching project data:', error);  // Error handling
      });
    }
  }, [projectId]);
  

  const handleSubmitScore = () => {
    const db = getDatabase(app);
    const judgeId = auth.currentUser.uid; // Assuming you're using Firebase Authentication
    const scoreRef = ref(db, `scores/${projectId}/${judgeId}`);
    
    // Check if a score already exists
    get(scoreRef).then((snapshot) => {
      if (snapshot.exists()) {
        alert('You have already submitted a score for this project.');
      } else {
        // Submit the new score
        set(scoreRef, {
          score: score,
          feedback: feedback,
          timestamp: Date.now()
        }).then(() => {
          alert('Score and feedback submitted successfully!');
          navigation.goBack();
        }).catch((error) => {
          console.error('Failed to submit score:', error);
          alert('Failed to submit score and feedback.');
        });
      }
    }).catch((error) => {
      console.error('Error checking existing score:', error);
    });
  };
  

  if (!projectDetails) {
    return (
      <View style={[styles.container, { backgroundColor: CustomTheme.colors.background }]}>
        <Text>Loading project details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: CustomTheme.colors.background }]}>
      <LogoComponent />
      <Card style={styles.card}>
        <Card.Content>
          <Text style={[styles.text, { color: CustomTheme.colors.text }]}>Score Project: {projectDetails.title}</Text>
          <Text>Project Summary: {projectDetails.summary}</Text>

          <TextInput
            mode="outlined"
            label="Score (0-100)"
            keyboardType="numeric"
            value={score}
            onChangeText={text => setScore(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Feedback"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100 }]}
          />
          <Button
            mode="contained"
            onPress={handleSubmitScore}
            style={styles.button}
          >
            Submit Score
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    width: '100%',
    paddingVertical: 8,
    marginVertical: 8,
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
  },
});

export default ScoringScreen;


