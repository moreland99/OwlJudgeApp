import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigation, useRoute } from '@react-navigation/native';

const JudgeProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;

  useEffect(() => {
    const db = getDatabase();
    const user = getAuth().currentUser;
    const projectsRef = ref(db, `projects`);
    get(projectsRef).then(snapshot => {
      if (snapshot.exists()) {
        const allProjects = Object.keys(snapshot.val()).map(key => ({
          id: key,
          ...snapshot.val()[key]
        })).filter(project => project.event === eventId && project.assignedJudges.includes(user.uid));

        setProjects(allProjects);
      }
    });
  }, [eventId]);

  const handleSelectProject = (projectId) => {
    navigation.navigate('ScoringScreen', { projectId });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectProject(item.id)}>
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default JudgeProjectsScreen;
