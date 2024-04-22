import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Modal, Button, TextInput } from 'react-native-paper';

const EditJudgeForm = ({ isVisible, onClose, judge, onSave }) => {
  const [firstName, setFirstName] = useState(judge?.firstName || '');
  const [lastName, setLastName] = useState(judge?.lastName || '');
  const [email, setEmail] = useState(judge?.email || '');
  const [role, setRole] = useState(judge?.role || '');

  const handleSave = () => {
    // Make sure all fields are included in the updated object
    const updatedJudge = {
      ...judge,
      firstName,
      lastName,
      email,
      role,
    };
    onSave(updatedJudge);
    onClose(); // Close the modal after saving
  };

  // The Modal from react-native-paper needs to be used within the PaperProvider component
  return (
    <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <Text style={styles.modalTitle}>Edit Judge</Text>
      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Role"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save Changes
      </Button>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    minHeight: 500,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    margin: 10,
  },
  saveButton: {
    marginTop: 10,
  },
});

export default EditJudgeForm;

