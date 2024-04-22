import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, useTheme, Modal, Portal, List, Badge, IconButton } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import CustomTheme from '../../theme';

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
  const [showAllRequests, setShowAllRequests] = useState(false);
  
  const CustomTheme = useTheme();
  const styles = getDynamicStyles(CustomTheme);

  const [notificationsCount, setNotificationsCount] = useState(0); // To keep track of the number of notifications

  useEffect(() => {
    const db = getDatabase(app);
    const eventListRef = ref(db, 'events/');
    const judgeListRef = ref(db, 'judges/');
    const projectListRef = ref(db, 'projects/'); 
    const requestsRef = ref(db, 'judgeRequests');


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
 onValue(requestsRef, (snapshot) => {
  const now = Date.now();
  const twoHoursAgo = now - 2 * 60 * 60 * 1000;
  const requests = [];

  snapshot.forEach((requestSnapshot) => {
    const requestId = requestSnapshot.key;
    const request = requestSnapshot.val();
    // Apply the time filter only if showAllRequests is false
    if (showAllRequests || new Date(request.requestDate).getTime() >= twoHoursAgo) {
      requests.push({
        id: requestId,
        ...request
      });
    }
  });

  setJudgeRequests(requests);
}, (error) => {
  console.error("Firebase onValue error: ", error);
});
}, [showAllRequests]); // Re-run the effect when showAllRequests changes




  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const handleSelectEvent = (eventId) => setSelectedEventId(eventId);
  const handleSelectJudge = (judgeId) => setSelectedJudgeId(judgeId);

  const toggleRequestView = () => {
    setShowAllRequests(!showAllRequests);
  };

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

        <Button
  onPress={toggleRequestView}
  contentStyle={styles.toggleButton} // Use contentStyle instead of style
  labelStyle={styles.toggleButtonText} // Set labelStyle for button text
>
  {showAllRequests ? "Show Only Recent Requests" : "Show All Requests"}
</Button>



        {judgeRequests.length > 0 && (
          <>
            <Text style={styles.notificationsHeader}>Notifications</Text>
            {judgeRequests.map(request => (
              <Card key={request.id} style={{ margin: 10 }}>
                <Card.Title
                  title={`Judge Request: ${request.judgeName}`}
                  subtitle={`Project: ${request.projectTitle}`}
                  left={(props) => <List.Icon {...props} icon="bell-ring" color={CustomTheme.colors.notification} />}
                  right={(props) => <Badge {...props} size={24} style={styles.badge}>NEW</Badge>}
                  CustomTheme={CustomTheme} // Pass the CustomTheme as a prop
                />
                <Card.Actions>
                  <Button onPress={() => {
                    navigation.navigate('AssignJudges', {
                      judgeId: request.judgeId,
                      eventId: request.eventId,
                      projectId: request.projectId
                    });
                  }}>View Details</Button>
                </Card.Actions>
              </Card>
            ))}
          </>
        )}
      </View>
      <Portal>
        <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          {/* Modal content could go here */}
        </Modal>
      </Portal>
    </ScrollView>
  );
};


const getDynamicStyles = () => StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: CustomTheme.colors.background,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  quickLinkCard: {
    width: '48%',
    margin: 2,
    padding: 10,
    alignItems: 'center',
    backgroundColor: CustomTheme.colors.surface,
  },
  card: {
    borderRadius: CustomTheme.roundness,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CustomTheme.colors.surface,
  },
  buttonIcon: {
    justifyContent: 'center',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: CustomTheme.colors.surface,
  },
  statLabel: {
    fontSize: 16,
    color: CustomTheme.colors.text,
  },
  statCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CustomTheme.colors.primary,
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
    paddingLeft: 10,
    color: CustomTheme.colors.primary,
  },
  notificationCard: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderColor: CustomTheme.colors.notification,
    borderWidth: 1,
  },
  badge: {
    backgroundColor: CustomTheme.colors.accent,
    color: 'white',
  },
  toggleButton: {
    backgroundColor: CustomTheme.colors.secondary,
    padding: 10,
    elevation: 4,
    borderRadius: CustomTheme.roundness,
  },
  toggleButtonText: {
    color: CustomTheme.colors.text,
  },
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
