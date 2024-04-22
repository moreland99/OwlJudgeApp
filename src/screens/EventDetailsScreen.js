import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Card, Paragraph, Button, List } from 'react-native-paper';
import { format, parseISO, isValid } from 'date-fns';
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
            onPress={() => navigation.navigate('ScoringScreen', { projectId: item.id })}
            left={props => <List.Icon {...props} icon="star" />}
        />
    );

    const safeDateFormat = (dateStr) => {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Date not available';
    };

    const headerComponent = () => (
      <Card style={styles.card}>
        <Card.Title title={eventDetails.name || 'Loading event details...'} />
        <Card.Content>
          <Paragraph>
            Date: {eventDetails.startDate && eventDetails.endDate ? `${safeDateFormat(eventDetails.startDate)} - ${safeDateFormat(eventDetails.endDate)}` : 'Loading dates...'}
          </Paragraph>
          <Paragraph>Location: {eventDetails.location || 'Location not available'}</Paragraph>
          <Paragraph>{eventDetails.details || 'No additional details available'}</Paragraph>
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

