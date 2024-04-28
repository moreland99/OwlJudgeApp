import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { Card } from 'react-native-paper';
import { app } from '../firebase/firebaseConfig'; 
import CustomTheme from '../../theme';  

const AdminScoreScreen = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getDatabase(app);  // Initialize Firebase Database

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    get(eventsRef).then((snapshot) => {
      if (snapshot.exists()) {
        setEvents(Object.values(snapshot.val()));
      } else {
        console.log("No events available");
      }
      setLoading(false);
    }).catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, []);

  const selectEvent = (eventId) => {
    setLoading(true);
    setSelectedEvent(eventId);
    const projectsRef = ref(db, 'projects');
    get(projectsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const allProjects = Object.values(snapshot.val());
        console.log("All projects:", allProjects);  // Log all projects
  
        // Make sure to match the field name used in your Firebase database
        const filteredProjects = allProjects.filter(project => project.event === eventId);
        console.log("Filtered projects:", filteredProjects);  // Log filtered projects
  
        setProjects(filteredProjects);
      } else {
        console.log("No projects available for this event");
      }
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });
  };
  
  

  const selectProject = (projectId) => {
    setLoading(true);
  
    // Fetch the specific project scores based on projectId
    const scoresRef = ref(db, `scores/${projectId}`);
    get(scoresRef).then((snapshot) => {
      if (snapshot.exists()) {
        const scoresData = snapshot.val();
        
        // Create an array of score objects including feedback
        const scoresArray = Object.values(scoresData).map(scoreObj => ({
          score: Number(scoreObj.score), // Convert the score to a number
          feedback: scoreObj.feedback
        }));
  
        // Calculate the average score
        const averageScore = scoresArray
          .reduce((acc, cur) => acc + cur.score, 0) / (scoresArray.length || 1);
        
        // Find the selected project's details
        const selectedProj = projects.find(p => p.id === projectId);
  
        // Set the selected project with detailed scores and the average score
        setSelectedProject({
          ...selectedProj,
          scores: scoresArray,
          averageScore
        });
  
      } else {
        console.log("No scores available for this project");
      }
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching scores:", error);
      setLoading(false);
    });
  };
  
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => selectEvent(item.id)}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.text}>{item.name}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity onPress={() => selectProject(item.id)}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.text}>{item.title}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator />;
  }
  
  return (
    <View style={styles.container}>
      {selectedProject ? (
        <View style={styles.scoreContainer}>
          <Text style={styles.averageScoreText}>
            Average Score: {selectedProject.averageScore.toFixed(2)}
          </Text>
          {selectedProject.scores.map((scoreDetail, index) => (
            <View key={index} style={styles.scoreDetailContainer}>
              <Text style={styles.scoreValue}>Score: {scoreDetail.score}</Text>
              <Text style={styles.feedback}>Feedback: {scoreDetail.feedback}</Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => setSelectedProject(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Projects</Text>
          </TouchableOpacity>
        </View>
      ) : !selectedEvent ? (
        // Show the list of events if no event is selected
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        // Show the list of projects or a message if no project is selected
        projects.length > 0 ? (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProjectItem}
          />
        ) : (
          <Text style={styles.noProjectsText}>No projects found for this event.</Text>
        )
      )}
    </View>
  );
  
  
  
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: CustomTheme.colors.background,
    },
    scoreContainer: {
        padding: CustomTheme.spacing(2),
    },
    averageScoreText: {
        marginBottom: CustomTheme.spacing(2),
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: CustomTheme.colors.secondary,
    },
    scoreDetailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: CustomTheme.spacing(1),
        borderBottomWidth: 1,
        borderBottomColor: CustomTheme.colors.secondary, // Use a light color for the separator lines
      },
    header: {
      fontSize: CustomTheme.fonts.labelLarge.fontSize,
      fontWeight: CustomTheme.fonts.labelLarge.fontWeight,
      color: CustomTheme.colors.text,
      padding: CustomTheme.spacing(2),
      backgroundColor: CustomTheme.colors.secondary,
      textAlign: 'center',
      borderRadius: CustomTheme.roundness,
      margin: CustomTheme.spacing(1),
      elevation: 1,
    },
    scoreItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: CustomTheme.spacing(2),
      borderBottomWidth: 1,
      borderBottomColor: CustomTheme.colors.secondary,
    },
    scoreValue: {
      fontSize: CustomTheme.fonts.bodySmall.fontSize,
      color: CustomTheme.colors.text,
      flex: 1,
      textAlign: 'left',
    },
    feedback: {
      fontSize: CustomTheme.fonts.bodySmall.fontSize,
      color: CustomTheme.colors.accent,
      flex: 1,
      textAlign: 'right',
      fontStyle: 'italic',
    },
    backButton: {
      padding: CustomTheme.spacing(1),
      backgroundColor: CustomTheme.colors.primary,
      alignItems: 'center',
      margin: CustomTheme.spacing(2),
      borderRadius: CustomTheme.components.card.container.borderRadius,
    },
    backButtonText: {
      color: CustomTheme.colors.text,
      fontSize: CustomTheme.fonts.medium.fontSize,
      fontWeight: CustomTheme.fonts.medium.fontWeight,
    },
    averageScoreText: {
      fontSize: CustomTheme.fonts.medium.fontSize,
      fontWeight: CustomTheme.fonts.medium.fontWeight,
      color: CustomTheme.colors.primary,
      padding: CustomTheme.spacing(1),
      marginVertical: CustomTheme.spacing(1),
      textAlign: 'center',
    },
    noProjectsText: {
        textAlign: 'center',
        padding: CustomTheme.spacing(2),
      },
    card: {
      ...CustomTheme.components.card.container,
      margin: CustomTheme.spacing(1),
      padding: CustomTheme.spacing(1),
    },
    cardContent: {
      ...CustomTheme.components.card.content,
    },
    cardTitle: {
      ...CustomTheme.components.card.title,
    },
  });

export default AdminScoreScreen;
