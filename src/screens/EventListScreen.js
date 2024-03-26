import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';

const eventsData = [
  { id: '1', name: 'Spring Hackathon', date: '2023-03-12' },
  { id: '2', name: 'Alumni Meetup', date: '2023-04-20' },
  { id: '3', name: 'Tech Conference', date: '2023-05-15' },
  { id: '4', name: 'Summer Coding Camp', date: '2023-06-10' },
  { id: '5', name: 'Innovation Challenge', date: '2023-07-22' },

  // Add more events as needed
];

const EventListScreen = ({ navigation }) => {
  const theme = useTheme(); // Use the theme

  const renderItem = ({ item }) => (
    <Card style={[styles.item, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Title style={{ color: theme.colors.onSurface }}>{item.name}</Title>
        <Paragraph>{item.date}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
    <LogoComponent />
      <FlatList
        data={eventsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddEvent')}
        style={{ margin: 10 }}
      >
        Add New Event
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  // Removed title style as Title component from React Native Paper comes with its own styling
});

export default EventListScreen;

