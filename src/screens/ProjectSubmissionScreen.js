import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Menu, Divider, useTheme } from 'react-native-paper';
import LogoComponent from '../components/LogoComponent';

const categories = ['Category 1', 'Category 2', 'Category 3']; // Example categories
const topics = ['Topic 1', 'Topic 2', 'Topic 3']; // Example topics

const ProjectSubmissionScreen = ({ navigation }) => {
  const theme = useTheme(); // Use the custom theme for styling
  const [projectNumber, setProjectNumber] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCategoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isTopicMenuVisible, setTopicMenuVisible] = useState(false);
  const [sponsoringCompany, setSponsoringCompany] = useState('');

  const openCategoryMenu = () => setCategoryMenuVisible(true);
  const closeCategoryMenu = () => setCategoryMenuVisible(false);

  const openTopicMenu = () => setTopicMenuVisible(true);
  const closeTopicMenu = () => setTopicMenuVisible(false);

  const handleSubmit = () => {
    alert('Project submitted successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}>
      <LogoComponent />
      <Text style={[styles.title, {color: theme.colors.text}]}>Submit Your Project</Text>
      <TextInput
        mode="outlined"
        label="Project Number"
        value={projectNumber}
        onChangeText={setProjectNumber}
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary }}}
      />
      <TextInput
        mode="outlined"
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary }}}
      />
      <Menu
        visible={isCategoryMenuVisible}
        onDismiss={closeCategoryMenu}
        anchor={<Button mode="outlined" onPress={openCategoryMenu} style={styles.menuButton}>{selectedCategory || 'Select a Category'}</Button>}>
        {categories.map((category) => (
          <Menu.Item key={category} onPress={() => { setSelectedCategory(category); closeCategoryMenu(); }} title={category} />
        ))}
      </Menu>
      <Menu
        visible={isTopicMenuVisible}
        onDismiss={closeTopicMenu}
        anchor={<Button mode="outlined" onPress={openTopicMenu} style={styles.menuButton}>{selectedTopic || 'Select a Topic'}</Button>}>
        {topics.map((topic) => (
          <Menu.Item key={topic} onPress={() => { setSelectedTopic(topic); closeTopicMenu(); }} title={topic} />
        ))}
      </Menu>
      <TextInput
        mode="outlined"
        label="Sponsoring Company"
        value={sponsoringCompany}
        onChangeText={setSponsoringCompany}
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary }}}
      />
      <Button 
        mode="contained" 
        onPress={handleSubmit} 
        style={styles.button}
        color={theme.colors.primary}
      >
        Submit Project
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  menuButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default ProjectSubmissionScreen;
