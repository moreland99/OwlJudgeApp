import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, TextInput, useTheme, Searchbar, Modal, Portal, Provider } from 'react-native-paper';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';

const JudgeListScreen = ({ navigation }) => {
  const [judges, setJudges] = useState([]);
  const [filteredJudges, setFilteredJudges] = useState([]);
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentJudge, setCurrentJudge] = useState(null);

  useEffect(() => {
    const db = getDatabase(app);
    const judgeRef = ref(db, 'judges/');

    const unsubscribe = onValue(judgeRef, (snapshot) => {
      const data = snapshot.val();
      const judgeList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setJudges(judgeList);
      setFilteredJudges(judgeList);
    });

    return () => unsubscribe();
  }, []);

  const onChangeSearch = query => {
    setSearchQuery(query);
    setFilteredJudges(judges.filter(item => item.judgeName.toLowerCase().includes(query.toLowerCase())));
  };

  const deleteJudge = judgeId => {
    Alert.alert("Delete Judge", "Are you sure?", [
      { text: "Cancel" },
      { text: "OK", onPress: () => {
          remove(ref(getDatabase(app), `judges/${judgeId}`))
            .then(() => Alert.alert("Success", "Judge deleted successfully."))
            .catch(error => Alert.alert("Error deleting judge", error.message));
        }
      },
    ]);
  };

  const updateJudgeDetails = async () => {
    if (currentJudge && currentJudge.id) {
      const updates = {};
      updates[`/judges/${currentJudge.id}`] = currentJudge;

      try {
        await update(ref(getDatabase(app)), updates);
        Alert.alert("Success", "Judge details updated successfully.");
        closeEditModal();
      } catch (error) {
        Alert.alert("Error updating judge", error.message);
      }
    }
  };

  const openEditModal = judge => {
    setCurrentJudge(judge);
    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.judgeName}</Title>
        <Paragraph>Expertise: {item.expertise ? item.expertise.area : 'N/A'}</Paragraph>
        <Paragraph>Contact: Email: {item.contact?.email || 'N/A'}, Phone: {item.contact?.phoneNumber || 'N/A'}</Paragraph>
        <Paragraph>Availability: {item.availability ? item.availability.toString() : 'N/A'}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => openEditModal(item)}>Edit</Button>
        <Button onPress={() => deleteJudge(item.id)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  const styles = getStyles(theme);

  return (
    <Provider>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search Judges"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        <FlatList
          data={filteredJudges}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
        <Portal>
          <Modal visible={isModalVisible} onDismiss={closeEditModal} contentContainerStyle={styles.modalContainer}>
            <Card>
              <Card.Title title="Edit Judge Details" />
              <Card.Content>
                <TextInput
                  label="Name"
                  value={currentJudge ? currentJudge.judgeName : ''}
                  onChangeText={text => setCurrentJudge({ ...currentJudge, judgeName: text })}
                  style={styles.input}
                />
                <TextInput
                  label="Expertise"
                  value={currentJudge ? currentJudge.expertise : ''}
                  onChangeText={text => setCurrentJudge({ ...currentJudge, expertise: text })}
                  style={styles.input}
                />
                <TextInput
                  label="Contact"
                  value={currentJudge ? `Email: ${currentJudge.contact?.email || ''}, Phone: ${currentJudge.contact?.phoneNumber || ''}` : ''}
                  onChangeText={text => {
                    const [email, phone] = text.split(', ');
                    setCurrentJudge({
                      ...currentJudge,
                      contact: {
                        email: email.split(': ')[1],
                        phoneNumber: phone.split(': ')[1]
                      }
                    });
                  }}
                  style={styles.input}
                />
                <TextInput
                  label="Availability"
                  value={currentJudge ? currentJudge.availability.toString() : ''}
                  onChangeText={text => setCurrentJudge({ ...currentJudge, availability: text })}
                  style={styles.input}
                />
              </Card.Content>
              <Card.Actions>
                <Button onPress={closeEditModal}>Cancel</Button>
                <Button onPress={updateJudgeDetails}>Save</Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

function getStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    card: {
      margin: 8,
      padding: 8,
      backgroundColor: theme.colors.surface,
    },
    searchbar: {
      margin: 8,
      borderRadius: 2,
      elevation: 1,
      backgroundColor: theme.colors.surface,
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      marginLeft: 20,
      marginRight: 20,
    },
    input: {
      backgroundColor: theme.colors.surface,
      marginBottom: 10,
    }
  });
}

export default JudgeListScreen;
