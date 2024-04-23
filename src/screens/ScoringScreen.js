import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
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
    console.log("Received project ID:", projectId);
    if (projectId) {
      const projectRef = ref(getDatabase(app), `projects/${projectId}`);
      get(projectRef).then((snapshot) => {
        if (snapshot.exists()) {
          setProjectDetails(snapshot.val());
        } else {
          console.log('No project data available');
        }
      }).catch((error) => {
        console.error('Error fetching project data:', error);
      });
    }
  }, [projectId]);
  
  
  

  const handleSubmitScore = () => {
    const db = getDatabase(app);
  
    // Ensure we have a logged in user before proceeding
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to submit a score.');
      return;
    }
  
    const judgeId = user.uid;
    const scoreRef = ref(db, `scores/${projectId}/${judgeId}`);
  
    // Now we check if a score already exists
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "position"} // Changed to "position" for Android
      keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 84}  // Adjusted for typical header + status bar height
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: CustomTheme.colors.background }]}
        keyboardShouldPersistTaps='handled'  // Helps with tapping buttons without dismissing the keyboard
      >
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
    </KeyboardAvoidingView>
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


