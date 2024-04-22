import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, useTheme, Modal } from 'react-native-paper';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import EditJudgeForm from './EditJudgeForm';

const JudgeListScreen = ({ navigation }) => { 
  const [judges, setJudges] = useState([]);
  const [currentJudge, setCurrentJudge] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const db = getDatabase();
    const judgesRef = ref(db, 'judges/');
    onValue(judgesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedJudges = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setJudges(loadedJudges);
    });
  }, []);

  // Function to trigger judge edit modal
  const editJudge = (judge) => {
    setCurrentJudge(judge);
    setIsEditModalVisible(true);
  };

  // Function to delete a judge
  const deleteJudge = (judgeId) => {
    const db = getDatabase();
    const judgeRef = ref(db, `judges/${judgeId}`);
    remove(judgeRef)
      .then(() => {
        // Update local state after successful deletion
        setJudges(judges.filter(judge => judge.id !== judgeId));
      })
      .catch(error => console.error("Error deleting judge:", error));
  };

  // Function to confirm before deleting a judge
const confirmDeleteJudge = (judgeId) => {
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this judge?",
    [
      // The "Yes" button
      {
        text: "Yes",
        onPress: () => deleteJudge(judgeId),
      },
      // The "No" button
      // Does nothing but dismiss the dialog when pressed
      {
        text: "No",
      },
    ],
  );
};

  // Function to update judge details
  const handleUpdateJudge = (updatedJudge) => {
    const db = getDatabase();
    const judgeRef = ref(db, `judges/${updatedJudge.id}`);
    update(judgeRef, updatedJudge)
      .then(() => {
        const updatedJudges = judges.map(judge => {
          return judge.id === updatedJudge.id ? updatedJudge : judge;
        });
        setJudges(updatedJudges);
        setIsEditModalVisible(false); // Close modal after update
      })
      .catch(error => {
        console.error("Error updating judge details:", error);
      });
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {judges.map((judge) => (
          <TouchableOpacity key={judge.id} onPress={() => editJudge(judge)}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>{judge.firstName} {judge.lastName}</Title>
                <Paragraph>Email: {judge.email}</Paragraph>
                <Paragraph>Role: {judge.role}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => editJudge(judge)}>Edit</Button>
                <Button onPress={() => confirmDeleteJudge(judge.id)}>Delete</Button>
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={isEditModalVisible} onDismiss={() => setIsEditModalVisible(false)}>
        <EditJudgeForm
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          judge={currentJudge}
          onSave={handleUpdateJudge}
        />
      </Modal>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  card: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default JudgeListScreen;

