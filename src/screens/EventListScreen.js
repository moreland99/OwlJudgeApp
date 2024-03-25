import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const eventsData = [
  { id: '1', name: 'Event 1', date: '2022-01-01' },
  { id: '2', name: 'Event 2', date: '2022-02-02' },
  // Add more events as needed
];

const EventListScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={eventsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Add New Event" onPress={() => navigation.navigate('AddEvent')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
});

export default EventListScreen;
