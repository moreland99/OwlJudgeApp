import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import LogoutButton from '../components/LogoutButton';
import { useRoute } from '@react-navigation/native';
import CustomTheme from '../../theme';

const JudgeDashboardScreen = () => {
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [judgeKey, setJudgeKey] = useState(null);
  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      if (newUser) {
        // Set judgeKey based on the user
        setJudgeKey(newUser.uid);
        console.log("Judge Key:", judgeKey);
      } else {
        setJudgeKey(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user || !judgeKey) {
      console.log('Waiting for user login and judgeKey...');
      return;
    }
  
    console.log('User and judgeKey confirmed:', user.email, judgeKey);
    const judgeProfileRef = ref(db, `judges/${judgeKey}/assignedEvents`);
  
    get(judgeProfileRef).then((snapshot) => {
      if (snapshot.exists()) {
        const assignedEventIds = snapshot.val();
        const eventsFetchPromises = assignedEventIds.map(eventId => get(ref(db, `events/${eventId}`)));
  
        Promise.all(eventsFetchPromises).then(eventSnapshots => {
          const events = eventSnapshots.map(snap => ({ ...snap.val(), id: snap.key }));
          setAssignedEvents(events);
        });
      } else {
        console.log('No assigned events data found for this judge');
      }
    });
  }, [user, judgeKey]); // React when user or judgeKey changes
  
  

  const greetUser = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  };

  const renderEventCard = ({ item }) => ( 
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
      </Card.Content>
    </Card> 
  );

  return (
    <View style={styles.container}>
    <LogoutButton />
      <Text style={styles.welcomeText}>{`${greetUser()} ${user?.displayName || user?.email}`}</Text>
      <FlatList
        horizontal
        data={assignedEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalList}
      />
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    padding: CustomTheme.spacing(2),
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: CustomTheme.spacing(2),
  },
  horizontalList: {
    flexGrow: 0,
  },
  card: { 
    margin: CustomTheme.spacing(1),
    width: 250,
    borderRadius: 8,
    elevation: 3,
  },
});

export default JudgeDashboardScreen;

