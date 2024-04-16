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
        // Fetch event details
        const eventRef = ref(getDatabase(app), `events/${eventId}`);
        get(eventRef).then((eventSnapshot) => {
            if (eventSnapshot.exists()) {
                const eventData = eventSnapshot.val();
                setEventDetails(eventData);
    
                // Now fetch the projects
                const projectsRef = ref(getDatabase(app), 'projects');
                get(projectsRef).then((projectsSnapshot) => {
                    if (projectsSnapshot.exists()) {
                        const allProjects = projectsSnapshot.val();
    
                        // Log all projects to debug
                        console.log('All Projects:', allProjects);
    
                        // Filter projects that are associated with the event
                        const assignedProjects = Object.keys(allProjects)
                            .filter(key => allProjects[key].event === eventId)
                            .map(key => ({ ...allProjects[key], id: key }));
    
                        // Log the assigned projects for debugging
                        console.log('Assigned Projects:', assignedProjects);
    
                        setProjects(assignedProjects);
                    } else {
                        console.log('No projects found in the database.');
                    }
                });
            } else {
                console.log('Event data not available');
                setEventDetails({});
            }
        }).catch((error) => {
            console.error('Error fetching event data:', error);
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

