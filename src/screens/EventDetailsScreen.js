import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { Card, Paragraph, Button, List } from 'react-native-paper';
import { format, parseISO, isValid } from 'date-fns';
import { getDatabase, ref, get, set, push, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';

const EventDetailsScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
    const [eventDetails, setEventDetails] = useState({});
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        // Fetch the details of the event
        const eventRef = ref(db, `events/${eventId}`);
        get(eventRef).then((eventSnapshot) => {
            if (eventSnapshot.exists()) {
                setEventDetails(eventSnapshot.val());
            } else {
                console.log('Event data not available');
            }
        });

        // Fetch projects linked to this event
        const projectsRef = ref(db, `projects`);
        get(projectsRef).then((projectsSnapshot) => {
            if (projectsSnapshot.exists()) {
                const allProjects = Object.values(projectsSnapshot.val()).flatMap(project => project);
                const assignedProjects = allProjects.filter(project => project.event === eventId);
                setProjects(assignedProjects);
            } else {
                console.log('No projects found');
            }
        });
    }, [eventId]);

    const renderItem = ({ item }) => (
        <List.Item
            title={item.title}
            description={item.summary}
            onPress={() => {
                Alert.alert(
                    "Judge Request",
                    "Do you want to make a request to judge this project?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { 
                            text: "Yes", onPress: () => handleJudgeRequest(item.id, item.title)
                        }
                    ]
                );
            }}
            left={props => <List.Icon {...props} icon="star" />}
        />
    );


const handleJudgeRequest = (projectId, projectTitle) => {
    const auth = getAuth(app);
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert("Not Authenticated", "You must be logged in to make a request.");
      return;
    }
  
    const db = getDatabase(app);
    const judgeProfileRef = ref(db, `judges/${user.uid}`);
    const requestsRef = ref(db, `judgeRequests/${user.uid}`);
  
    // Check if a request already exists
  get(requestsRef).then((requestsSnapshot) => {
    let existingRequest = false;

    requestsSnapshot.forEach((childSnapshot) => {
      const request = childSnapshot.val();
      if (request.projectId === projectId && ['pending', 'approved'].includes(request.status)) {
        existingRequest = true;
      }
    });

    if (existingRequest) {
      Alert.alert("Request Exists", "You have already made a request for this project.");
      return;
    }

    // Proceed if no existing request found
    fetchJudgeProfileAndSubmitRequest(judgeProfileRef, user, projectId, projectTitle);
  }).catch((error) => {
    Alert.alert("Error", "Failed to check existing requests: " + error.message);
    console.error("Error checking existing requests: ", error);
  });
};
  
  const fetchJudgeProfileAndSubmitRequest = (judgeProfileRef, user, projectId, projectTitle) => {
    get(judgeProfileRef).then((profileSnapshot) => {
      if (!profileSnapshot.exists()) {
        Alert.alert("Error", "Judge profile not found.");
        return;
      }
  
      const profile = profileSnapshot.val();
      const judgeName = profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : "Anonymous";
  
      const requestData = {
        judgeId: user.uid,
        judgeName,
        judgeEmail: profile.email,
        projectId,
        projectTitle,
        requestDate: new Date().toISOString(),
        status: "pending",
        // Include combined key for easy lookup and duplicate check
        judgeId_projectId: `${user.uid}_${projectId}` 
      };
  
      submitJudgeRequest(requestData);
    }).catch((error) => {
      Alert.alert("Error", "Could not retrieve judge profile.");
      console.error("Error fetching judge profile from Firebase: ", error);
    });
  };
  
  const submitJudgeRequest = (requestData) => {
    const db = getDatabase(app);
    const newRequestRef = push(ref(db, 'judgeRequests'));
    set(newRequestRef, requestData).then(() => {
      Alert.alert("Request Sent", "Your request to judge the project has been sent. Please wait for admin approval.");
    }).catch((error) => {
      Alert.alert("Error", "There was a problem sending your request. Please try again.");
      console.error("Error writing request to Firebase: ", error);
    });
  };
  

  
  
  
    

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
