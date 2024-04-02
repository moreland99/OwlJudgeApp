import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';

const AdminDashboardScreen = ({ navigation }) => {
  const [eventCount, setEventCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [judgeCount, setJudgeCount] = useState(0);
  const [recentScores, setRecentScores] = useState([]);
  const theme = useTheme(); // Using theme for consistent styling

  useEffect(() => {
    const db = getDatabase();
    const fetchData = async () => {
      const eventRef = ref(db, 'events/');
      onValue(eventRef, (snapshot) => {
        const data = snapshot.val();
        setEventCount(Object.keys(data).length);
      });

      const projectRef = ref(db, 'projects/');
      onValue(projectRef, (snapshot) => {
        const data = snapshot.val();
        setProjectCount(Object.keys(data).length);
      });

      const judgeRef = ref(db, 'judges/');
      onValue(judgeRef, (snapshot) => {
        const data = snapshot.val();
        setJudgeCount(Object.keys(data).length);
      });

      const scoresRef = ref(db, 'scores/');
      onValue(scoresRef, (snapshot) => {
        const data = snapshot.val();
        setRecentScores(Object.values(data)); // Assuming 'data' is an object where each key is a score entry
      });
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text style={styles.title}>Admin Dashboard</Text>
        {/* Stats Display */}
        <Text style={styles.statText}>Total Events: {eventCount}</Text>
        <Text style={styles.statText}>Total Projects: {projectCount}</Text>
        <Text style={styles.statText}>Total Judges: {judgeCount}</Text>
        {/* Quick Link Buttons */}
        <Button 
          icon="calendar-check" 
          mode="contained" 
          onPress={() => navigation.navigate('Event List')}
          style={styles.button}
          color={theme.colors.primary}>View Events</Button>
        <Button 
          icon="account-group" 
          mode="contained" 
          onPress={() => navigation.navigate('Judge Details')}
          style={styles.button}
          color={theme.colors.accent}>View Judges</Button>
        <Button 
          icon="book-open-page-variant" 
          mode="contained" 
          onPress={() => navigation.navigate('Project Submission')}
          style={styles.button}
          color={theme.colors.primary}>View Projects</Button>
        <Button 
          icon="scoreboard" 
          mode="contained" 
          onPress={() => navigation.navigate('Scoring & Feedback')}
          style={styles.button}
          color={theme.colors.accent}>View Scores</Button>
        {/* Add more quick links as needed */}
      </Card.Content>
    </Card>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      margin: 10,
      padding: 20,
      borderRadius: 8, // Rounded corners for the card
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: '#344955', // Adjust color as per theme
    },
    statText: {
      fontSize: 16,
      marginBottom: 10,
      color: '#232F34', // Adjust color as per theme
    },
    button: {
      marginTop: 10,
      paddingVertical: 5,
      marginHorizontal: 10,
      borderRadius: 20, // Rounded corners for buttons
    },
    // You can add or adjust styles as needed
  });
  
  export default AdminDashboardScreen;