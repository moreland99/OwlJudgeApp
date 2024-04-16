import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, useTheme, Card } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';

const ScoringScreen = ({ navigation }) => {
  const theme = useTheme();
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmitScore = () => {
    alert('Score and feedback submitted successfully!');
    // Placeholder for further processing or backend integration
    navigation.goBack();
  };
  

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LogoComponent />
      <Card style={styles.card}>
        <Card.Content>
          <Text style={[styles.text, { color: theme.colors.text }]}>Score Project</Text>

          <TextInput
            mode="outlined"
            label="Score (0-100)"
            keyboardType="numeric"
            value={score}
            onChangeText={text => setScore(text.replace(/[^0-9]/g, ''))} // This ensures only numbers are entered
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Feedback"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100 }]} // Adjust height for multiline feedback input
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
