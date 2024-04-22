import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, useTheme, Modal, Portal, List, Badge, IconButton } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const AdminDashboardScreen = ({ navigation }) => {
  const [eventCount, setEventCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [judgeCount, setJudgeCount] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const [judgesList, setJudgesList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedJudgeId, setSelectedJudgeId] = useState(null);
  const [judgeRequests, setJudgeRequests] = useState([]);
  
  const theme = useTheme();
  const styles = getDynamicStyles(theme);

  const [notificationsCount, setNotificationsCount] = useState(0); // To keep track of the number of notifications

  useEffect(() => {
    const db = getDatabase(app);
    const eventListRef = ref(db, 'events/');
    const judgeListRef = ref(db, 'judges/');
    const projectListRef = ref(db, 'projects/'); 


    // Fetch Events
    onValue(eventListRef, (snapshot) => {
      const events = [];
      snapshot.forEach((childSnapshot) => {
        events.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setEventsList(events);
      setEventCount(events.length);
    });

    // Fetch Judges
    onValue(judgeListRef, (snapshot) => {
      const judges = [];
      snapshot.forEach((childSnapshot) => {
        judges.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setJudgesList(judges);
      setJudgeCount(judges.length);
    });

    //Fetch Projects
    onValue(projectListRef, (snapshot) => {
      const projects = [];
      snapshot.forEach((childSnapshot) => {
        projects.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setProjectCount(projects.length); // Set the project count based on the number of projects
    });

 // Fetch Judge Requests
 const requestsRef = ref(db, 'judgeRequests');
 onValue(requestsRef, (snapshot) => {
   const requests = [];
   snapshot.forEach((requestSnapshot) => {
     const requestId = requestSnapshot.key;
     const request = requestSnapshot.val();
     requests.push({
       id: requestId,
       ...request
     });
   });
   setJudgeRequests(requests);
   setNotificationsCount(requests.length); // Update the notifications count
 }, (error) => {
   console.error("Firebase onValue error: ", error);
 });
}, []);




  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const handleSelectEvent = (eventId) => setSelectedEventId(eventId);
  const handleSelectJudge = (judgeId) => setSelectedJudgeId(judgeId);

  return (
    <ScrollView style={styles.fullscreen}>
      <View style={styles.container}>
        <View style={styles.statsContainer}>
          <StatCard label="Total Events" count={eventCount} styles={styles} />
          <StatCard label="Total Projects" count={projectCount} styles={styles} />
          <StatCard label="Total Judges" count={judgeCount} styles={styles} />
        </View>
        <View style={styles.quickLinksContainer}>
          <QuickLinkButton title="View Events" iconName="calendar-check" onPress={() => navigation.navigate('EventDashboard')} styles={styles} />
          <QuickLinkButton title="View Judges" iconName="account-group" onPress={() => navigation.navigate('JudgeList')} styles={styles} />
          <QuickLinkButton title="View Projects" iconName="book-open-page-variant" onPress={() => navigation.navigate('ProjectSubmission')} styles={styles} />
          <QuickLinkButton title="View Scores" iconName="scoreboard" onPress={() => navigation.navigate('Scoring & Feedback')} styles={styles} />
          <QuickLinkButton title="Assign Judges" iconName="account-plus" onPress={() => navigation.navigate('AssignJudges')} styles={styles} />
        </View>
  
        {/* Notifications Section */}
        {judgeRequests.length > 0 && (
          <>
            <Text style={styles.notificationsHeader}>Notifications</Text>
            {judgeRequests.map((request) => (
              <Card key={request.id} style={styles.notificationCard}>
                <Card.Title
                  title={`Judge Request: ${request.judgeName || "Unknown"}`}
                  subtitle={`Project: ${request.projectTitle}`}
                  left={(props) => <List.Icon {...props} icon="bell-ring" color={theme.colors.notification} />}
                  right={(props) => <Badge {...props} size={24} style={styles.badge}>NEW</Badge>}
                />
                <Card.Actions>
                  <Button onPress={() => navigation.navigate('JudgeDetails', { judgeId: request.judgeId })}>View Details</Button>
                </Card.Actions>
              </Card>
            ))}
          </>
        )}
      </View>
      <Portal>
        <Modal visible={isModalVisible} onDismiss={closeModal} contentContainerStyle={styles.modalContainer}>
          {/* ... Modal content ... */}
        </Modal>
      </Portal>
    </ScrollView>
  );
  
};

const getDynamicStyles = (theme) => StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1, // Ensure the container takes full available space
    padding: 10,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Changed to 'space-around' for better spacing
  },
  quickLinkCard: {
    width: '48%', // Slightly less than half to fit two items per row
    margin: 2, // Uniform margin for vertical and horizontal
    padding: 10,
    alignItems: 'center', // Center items inside the card
  },
  card: {
    borderRadius: 15,
    flex: 1, // Ensures the card stretches to fill the space
    justifyContent: 'center', // Centers content vertically within the card
  },
  buttonIcon: {
    justifyContent: 'center',
    fontSize: 16, // Adjusted for better text visibility
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // other styles like padding or margin if necessary
  },
  
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  statCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
  },
  notificationsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: theme.colors.primary,
    paddingLeft: 10,
  },
  notificationCard: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderColor: theme.colors.notification,
    borderWidth: 1, // Adding a border to highlight the notification card
  },
  badge: {
    backgroundColor: theme.colors.accent, // Use accent color for the badge
    color: 'white', // White text color for the badge
  }
});


const StatCard = ({ label, count, styles }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statCount}>{count}</Text>
  </View>
);

const QuickLinkButton = ({ title, iconName, onPress, styles }) => (
  <TouchableOpacity style={styles.quickLinkCard} onPress={onPress}>
    <Card style={styles.card}>
      <Card.Content>
        <Button icon={iconName} labelStyle={{ fontSize: styles.buttonIcon.fontSize }} numberOfLines={3} style={styles.buttonIcon}>
          {title}
        </Button>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

export default AdminDashboardScreen;
