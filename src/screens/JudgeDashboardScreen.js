import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO, isAfter } from 'date-fns';
import LogoutButton from '../components/LogoutButton';
import LogoComponent from '../components/LogoComponent';
import CustomTheme from '../../theme';

const JudgeDashboardScreen = () => {
  const navigation = useNavigation();
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const db = getDatabase();
  const auth = getAuth();
  const [judgeData, setJudgeData] = useState(null); // State variable to hold judge's data


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      if (newUser) {
        const judgeProfileRef = ref(db, `judges/${newUser.uid}`);
        get(judgeProfileRef).then((snapshot) => {
          if (snapshot.exists()) {
            const judgeDataFromDB = snapshot.val(); // Assuming snapshot.val() returns the judge's data
            setJudgeData(judgeDataFromDB); // Set the judge's data in the state variable
            const { assignedEvents } = judgeDataFromDB;
            const eventIDs = Object.keys(assignedEvents).filter(key => assignedEvents[key] === true);
            const eventDetailsPromises = eventIDs.map(eventId =>
              get(ref(db, `events/${eventId}`))
            );
            Promise.all(eventDetailsPromises).then(eventSnapshots => {
              const loadedEvents = eventSnapshots.map(snap => ({
                id: snap.key,
                ...snap.val(),
              }));
              const validEvents = loadedEvents.filter(event => isAfter(new Date(event.endDate), new Date()));
              setAssignedEvents(loadedEvents);
              setUpcomingEvents(validEvents);
            });
          } else {
            console.log('No assigned events data found for this judge');
          }
        });
      }
    });
  
    return () => unsubscribe(); 
  }, []);

  

  const handleEventSelect = (event) => {
    setCurrentEvent(event);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Function to greet the user based on the time of the day and judge's first name
  const greetUser = () => {
    const hour = new Date().getHours();
    const userName = judgeData?.firstName || ''; // Use the first name from judge's data
    return hour < 12 ? `Good Morning, ${userName}` : hour < 18 ? `Good Afternoon, ${userName}` : `Good Evening, ${userName}`;
  };
  
   

  const renderEventCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleEventSelect(item)}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>Date: {item.startDate ? format(parseISO(item.startDate), 'PPP') : 'N/A'} - {item.endDate ? format(parseISO(item.endDate), 'PPP') : 'N/A'}</Paragraph>
          <Paragraph>Time: {item.startTime ? format(parseISO(item.startTime), 'p') : 'N/A'} - {item.endTime ? format(parseISO(item.endTime), 'p') : 'N/A'}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

    // Sorting function to sort events by start date
    const sortByStartDate = (eventA, eventB) => {
      const startDateA = new Date(eventA.startDate);
      const startDateB = new Date(eventB.startDate);
      return startDateA - startDateB;
    };

    return (
      <View style={styles.container}>
        <LogoutButton />
        <LogoComponent />
        <Text style={styles.welcomeText}>{greetUser()}</Text>
        <Text style={styles.header}>Upcoming Events</Text>
        <FlatList
          data={upcomingEvents.sort(sortByStartDate)}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTextTitle}>{currentEvent?.name}</Text>
              <Text style={styles.modalTextDetail}>{`Details: ${currentEvent?.details}`}</Text>
              <Text style={styles.modalTextDate}>{`From: ${currentEvent?.startDate ? format(parseISO(currentEvent.startDate), 'PPPP') : 'N/A'} To: ${currentEvent?.endDate ? format(parseISO(currentEvent.endDate), 'PPPP') : 'N/A'}`}</Text>
              <Text style={styles.modalTextTime}>{`Time: ${currentEvent?.startTime ? format(parseISO(currentEvent.startTime), 'pp') : 'N/A'} - ${currentEvent?.endTime ? format(parseISO(currentEvent.endTime), 'pp') : 'N/A'}`}</Text>
              <Button mode="contained" onPress={handleCloseModal}>Close</Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CustomTheme.spacing(2),
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: CustomTheme.spacing(1),
  },
  horizontalList: {
    flexGrow: 0,
    marginBottom: CustomTheme.spacing(2),
  },
  card: {
    margin: CustomTheme.spacing(1),
    width: '90%',
    borderRadius: 8,
    elevation: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTextTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalTextDetail: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTextDate: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTextTime: {
    marginBottom: 20,
    textAlign: 'center',
  }, 
  welcomeText: {
    fontSize: 24, // Original larger size for greeting
    fontWeight: 'bold',
    marginVertical: CustomTheme.spacing(2), // Ensure vertical spacing for clarity
  },
  header: {
    fontSize: 16, // Smaller font size for "Upcoming Events"
    fontWeight: 'normal', // Less emphasis compared to the greeting
    color: '#666', // Optional: Change color to make it less prominent
    marginTop: CustomTheme.spacing(1),
    marginBottom: CustomTheme.spacing(1),
  }
});

export default JudgeDashboardScreen;

