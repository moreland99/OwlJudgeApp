import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';

const ProjectListScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]); // State to hold fetched projects
  const theme = CustomTheme;
  const auth = getAuth();

  useEffect(() => {
    const db = getDatabase(app);
    const user = auth.currentUser; 
  
    if (user) {
      const assignedProjectsRef = ref(db, `judges/${user.uid}/assignedProjects`);
      get(assignedProjectsRef).then(snapshot => {
        if (snapshot.exists()) { 
          const projectIDs = Object.keys(snapshot.val()).filter(key => snapshot.val()[key] === true);
          console.log('Project IDs:', projectIDs);
  
          const projectDetailsPromises = projectIDs.map(id => get(ref(db, `projects/${id}`)));
  
          Promise.all(projectDetailsPromises).then(projectSnapshots => {
            const projects = projectSnapshots.map(snap => {
              if (snap.exists()) {
                return {
                  id: snap.key,
                  ...snap.val(),
                };
              } else {
                console.log(`No data available for project ID: ${snap.key}`);
                return {
                  id: snap.key,
                  title: 'Title Not Available',
                  summary: 'Summary Not Available',
                };
              }
            });
  
            console.log('Fetched Projects:', projects);
            setProjects(projects);
          });
        } else {
          console.log('No projects are assigned to this judge.');
        }
      }).catch(error => {
        console.error('Error fetching assigned projects:', error);
      });
    } else {
      console.log('No user is logged in.'); 
    }
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
    >
      <Card style={[styles.item, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>{item.title}</Title>
          <Paragraph>{item.summary}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    <LogoComponent />
      <FlatList
        data={projects}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
});

export default ProjectListScreen;

