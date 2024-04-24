import React, { useState, useEffect } from 'react';
import { View, SectionList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';

const ProjectListScreen = ({ navigation }) => {
  const [projectSections, setProjectSections] = useState([{ title: 'Scored Projects', data: [] }, { title: 'Unscored Projects', data: [] }]);
  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in:', user.uid); // Log the user ID
        const judgeProjectsRef = ref(db, `judges/${user.uid}/assignedProjects`);
        const unsub = onValue(judgeProjectsRef, (snapshot) => {
          if (snapshot.exists()) {
            const projectIDs = Object.keys(snapshot.val()).filter(key => snapshot.val()[key] === true);

            // Clear previous projects data before fetching new
            console.log('Clearing project sections data'); // Log data clearing
            setProjectSections([{ title: 'Scored Projects', data: [] }, { title: 'Unscored Projects', data: [] }]);

            projectIDs.forEach((projectId) => {
              const projectRef = ref(db, `projects/${projectId}`);
              onValue(projectRef, (projectSnapshot) => {
                if (projectSnapshot.exists()) {
                  const scoreRef = ref(db, `scores/${projectId}/${user.uid}`);
                  onValue(scoreRef, (scoreSnapshot) => {
                    const projectData = {
                      id: projectId,
                      ...projectSnapshot.val(),
                      score: scoreSnapshot.exists() ? scoreSnapshot.val().score : undefined
                    };
                    console.log('Project data received:', projectData); // Log project data received
                    updateProjectsState(projectData);
                  });
                }
              });
            });
          }
        });
        return () => {
          console.log('Detaching listeners on logout'); // Log listener detachment
          unsub();  // Detach listener for judgeProjectsRef
          off(judgeProjectsRef);  // Ensure all listeners are turned off when the component unmounts
        };
      } else {
        console.log('User is not logged in or has logged out.'); // Log the logout or not logged in state
      }
    });
    return () => {
      console.log('Cleaning up auth listener'); // Log the cleanup
      authUnsub();  // Clean up the auth state listener
    };
  }, [auth, db]);

  function updateProjectsState(newProjectData) {
    console.log('Updating projects state with new data:', newProjectData); // Log the state update attempt
    setProjectSections(prevSections => {
      const scoredIndex = prevSections.findIndex(section => section.title === 'Scored Projects');
      const unscoredIndex = prevSections.findIndex(section => section.title === 'Unscored Projects');

      let newScoredProjects = [...prevSections[scoredIndex].data];
      let newUnscoredProjects = [...prevSections[unscoredIndex].data];

      const scoredProjectIndex = newScoredProjects.findIndex(p => p.id === newProjectData.id);
      const unscoredProjectIndex = newUnscoredProjects.findIndex(p => p.id === newProjectData.id);

      if (newProjectData.score !== undefined) {
        if (scoredProjectIndex === -1) {
          newScoredProjects.push(newProjectData);
        }
        if (unscoredProjectIndex !== -1) {
          newUnscoredProjects.splice(unscoredProjectIndex, 1);
        }
      } else if (unscoredProjectIndex === -1) {
        newUnscoredProjects.push(newProjectData);
      }

      const newSections = [...prevSections];
      newSections[scoredIndex].data = newScoredProjects;
      newSections[unscoredIndex].data = newUnscoredProjects;

      console.log('New scored projects:', newScoredProjects); // Log the new scored projects array
      console.log('New unscored projects:', newUnscoredProjects); // Log the new unscored projects array
      return newSections;
    });
  }

  return (
    <View style={styles.container}>
      <LogoComponent />
      <SectionList
        sections={projectSections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (!item.score) {
                navigation.navigate('ProjectScoringScreen', { projectId: item.id });
              }
            }}
            disabled={!!item.score}
            style={{ opacity: item.score ? 0.7 : 1 }}
          >
            <Card style={[styles.item, { backgroundColor: CustomTheme.colors.surface }]}>
              <Card.Content>
                <Title style={{ color: CustomTheme.colors.onSurface }}>{item.title}</Title>
                <Paragraph>{item.summary}</Paragraph>
                {item.score && <Text>Score: {item.score}</Text>}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    fontSize: 18,
    backgroundColor: '#f0f0f0',
    padding: 10,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ProjectListScreen;
