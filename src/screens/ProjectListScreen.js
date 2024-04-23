import React, { useState, useEffect } from 'react';
import { View, SectionList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';

const ProjectListScreen = ({ navigation }) => {
  const [projectSections, setProjectSections] = useState([{ title: 'Scored Projects', data: [] }, { title: 'Unscored Projects', data: [] }]);
  const auth = getAuth();
  const db = getDatabase(app);

  useEffect(() => {
    const authUnsub = auth.onAuthStateChanged(user => {
      if (user) {
        const judgeProjectsRef = ref(db, `judges/${user.uid}/assignedProjects`);
        const unsub = onValue(judgeProjectsRef, snapshot => {
          if (snapshot.exists()) {
            const projectIDs = Object.keys(snapshot.val()).filter(key => snapshot.val()[key] === true);
            projectIDs.forEach(projectId => {
              const projectRef = ref(db, `projects/${projectId}`);
              onValue(projectRef, projectSnapshot => {
                if (projectSnapshot.exists()) {
                  const scoreRef = ref(db, `scores/${projectId}/${user.uid}`);
                  onValue(scoreRef, scoreSnapshot => {
                    const projectData = {
                      id: projectId,
                      ...projectSnapshot.val(),
                      score: scoreSnapshot.exists() ? scoreSnapshot.val().score : undefined
                    };
                    updateProjectsState(projectData);
                  }, { onlyOnce: true });
                }
              }, { onlyOnce: true });
            });
          }
        });
        return () => {
          unsub();
          off(judgeProjectsRef);
        };
      }
    });
    return () => authUnsub();
  }, [auth, db]);
  

  function updateProjectsState(newProjectData) {
    setProjectSections(prevSections => {
      const scoredIndex = prevSections.findIndex(section => section.title === 'Scored Projects');
      const unscoredIndex = prevSections.findIndex(section => section.title === 'Unscored Projects');

      const newScoredProjects = [...prevSections[scoredIndex].data];
      const newUnscoredProjects = prevSections[unscoredIndex].data.filter(p => p.id !== newProjectData.id);

      if (newProjectData.score !== undefined) {
        newScoredProjects.push(newProjectData);
      } else {
        newUnscoredProjects.push(newProjectData);
      }

      const newSections = [...prevSections];
      newSections[scoredIndex].data = newScoredProjects;
      newSections[unscoredIndex].data = newUnscoredProjects;

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



