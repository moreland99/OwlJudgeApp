import React, { useState, useEffect } from 'react';
import { View, SectionList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';

const ProjectListScreen = ({ navigation }) => {
  const [projectSections, setProjectSections] = useState([{ title: 'Scored Projects', data: [] }, { title: 'Unscored Projects', data: [] }]);
  const auth = getAuth();
  const db = getDatabase(app);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const judgeProjectsRef = ref(db, `judges/${user.uid}/assignedProjects`);
      get(judgeProjectsRef).then(snapshot => {
        if (snapshot.exists()) {
          const projectIDs = Object.keys(snapshot.val()).filter(key => snapshot.val()[key] === true);
          const projectDetailsPromises = projectIDs.map(id => 
            get(ref(db, `projects/${id}`)).then(projectSnapshot => {
              if (projectSnapshot.exists()) {
                return get(ref(db, `scores/${id}/${user.uid}`)).then(scoreSnapshot => {
                  return {
                    id: id,
                    ...projectSnapshot.val(),
                    score: scoreSnapshot.exists() ? scoreSnapshot.val().score : undefined
                  };
                });
              }
            })
          );

          Promise.all(projectDetailsPromises).then(projects => {
            const scoredProjects = projects.filter(p => p.score !== undefined);
            const unscoredProjects = projects.filter(p => p.score === undefined);
            setProjectSections([
              { title: 'Scored Projects', data: scoredProjects },
              { title: 'Unscored Projects', data: unscoredProjects }
            ]);
          });
        } else {
          console.log('No projects are assigned to this judge.');
        }
      });
    }
  }, []);

  const renderProject = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (!item.score) {
          navigation.navigate('ScoringScreen', { projectId: item.id });
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
  );
  

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.header}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={projectSections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderProject}
        renderSectionHeader={renderSectionHeader}
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


