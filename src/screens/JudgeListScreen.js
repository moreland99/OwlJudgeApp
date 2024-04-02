import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const JudgeListScreen = ({ navigation }) => {
  const [judges, setJudges] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const db = getDatabase(app);
    const judgeRef = ref(db, 'judges/');

    onValue(judgeRef, (snapshot) => {
      const data = snapshot.val();
      const judgeList = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setJudges(judgeList);
    });

    return () => judgeRef.off();
  }, []);

  const deleteJudge = (judgeId) => {
    Alert.alert("Delete Judge", "Are you sure?", [
      { text: "Cancel" },
      { text: "OK", onPress: () => {
          remove(ref(getDatabase(app), `judges/${judgeId}`))
            .then(() => Alert.alert("Success", "Judge deleted successfully."))
            .catch((error) => Alert.alert("Error deleting judge", error.message));
        }
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.judgeName}</Title>
        <Paragraph>Expertise: {item.expertise}</Paragraph>
        <Paragraph>Contact: {item.contact}</Paragraph>
        <Paragraph>Availability: {item.availability}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('JudgeDetailsScreen', { judgeId: item.id })}>Edit</Button>
        <Button onPress={() => deleteJudge(item.id)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LogoComponent />
      <FlatList
        data={judges}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 8,
    padding: 8,
  },
  // You may adjust the styles to match your app's design
});

export default JudgeListScreen;