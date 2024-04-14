import React, { useState } from 'react';
import { Portal, Modal, Card, List, Button } from 'react-native-paper';

const AssignJudgesScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <Portal>
  <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
    <Card>
      <Card.Title title="Assign Judge to Event" />
      <Card.Content>
        {/* Dropdown for selecting an event */}
        <List.Accordion
          title="Select Event"
          left={props => <List.Icon {...props} icon="calendar" />}>
          {eventsList.map(event => (
            <List.Item
              key={event.id}
              title={event.name}
              onPress={() => setSelectedEventId(event.id)}
            />
          ))}
        </List.Accordion>

        {/* Dropdown for selecting a judge */}
        <List.Accordion
          title="Select Judge"
          left={props => <List.Icon {...props} icon="gavel" />}>
          {judgesList.map(judge => (
            <List.Item
              key={judge.id}
              title={judge.email} // Assuming you want to display the judge's email
              onPress={() => setSelectedJudgeId(judge.id)}
            />
          ))}
        </List.Accordion>

        <Button
          mode="contained"
          onPress={() => {
            setModalVisible(false);
            assignJudgeToEvent(selectedEventId, selectedJudgeId);
          }}>
          Assign Judge
        </Button>
      </Card.Content>
    </Card>
  </Modal>
</Portal>

  );
};

export default AssignJudgesScreen;