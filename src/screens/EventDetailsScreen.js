import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Card, Paragraph, Button, List } from 'react-native-paper';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const EventDetailsScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
    const [eventDetails, setEventDetails] = useState({});
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        // Fetch the details of the event itself
        const eventRef = ref(db, `events/${eventId}`);
        get(eventRef).then((eventSnapshot) => {
          if (eventSnapshot.exists()) {
            setEventDetails(eventSnapshot.val());
          } else {
            console.log('Event data not available');
            setEventDetails({});
          }
        }).catch((error) => {
          console.error('Error fetching event details:', error);
        });
      
        // Fetch projects linked to this event
        const projectsRef = ref(db, 'projects');
        get(projectsRef).then((projectsSnapshot) => {
          if (projectsSnapshot.exists()) {
            const allProjects = projectsSnapshot.val();
            const assignedProjects = [];
      
            for (const projectId in allProjects) {
              for (const projectDataId in allProjects[projectId]) {
                const projectData = allProjects[projectId][projectDataId];
                if (projectData.event === eventId) {
                  assignedProjects.push({
                    id: projectId,
                    ...projectData
                  });
                }
              }
            }
      
            setProjects(assignedProjects);
          } else {
            console.log('No projects found');
          }
        }).catch((error) => {
          console.error('Error fetching projects:', error);
        });
      }, [eventId]);
      
    
    

    const renderItem = ({ item }) => (
        <List.Item
            title={item.title}
            description={item.summary}
            onPress={() => console.log("Project selected", item.id)}
            left={props => <List.Icon {...props} icon="folder" />}
        />
    );

    const headerComponent = () => (
        <Card style={styles.card}>
            <Card.Title title={eventDetails.name} />
            <Card.Content>
                <Paragraph>Date: {eventDetails.date}</Paragraph>
                <Paragraph>Location: {eventDetails.location}</Paragraph>
                <Paragraph>{eventDetails.details}</Paragraph>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => navigation.goBack()}>Go Back</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <FlatList
            ListHeaderComponent={headerComponent}
            data={projects}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
    },
    card: {
        margin: 10,
        elevation: 4,
    },
    projectList: {
        marginTop: 10,
    },
    projectTitle: {
        fontSize: 16,
    },
});

export default EventDetailsScreen;

