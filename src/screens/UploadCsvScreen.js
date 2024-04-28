import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { getDatabase, ref, update } from 'firebase/database';

const UploadCsvScreen = () => {
  const [csvData, setCsvData] = useState([]);
  const [debugMessage, setDebugMessage] = useState('Awaiting action');

  const handleUploadData = async (parsedData, nodePath) => {
    const db = getDatabase();
    const updates = {};

    // Prepare updates for Firebase batch upload
    parsedData.forEach(dataItem => {
      const newRef = ref(db, nodePath).push(); // Creates a new entry with a unique key
      updates[newRef.key] = dataItem; // Maps the unique key to the data item
    });

    try {
      await update(ref(db), updates); // Performs all updates in a single operation
      Alert.alert('Success', 'Data has been uploaded to Firebase.');
    } catch (error) {
      console.error('Firebase update error:', error);
      Alert.alert('Error', `There was an error uploading the data: ${error.message}`);
    }
  };

  const handleSelectFile = async () => {
    setDebugMessage("Starting file selection");
    try {
        const pickerResult = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
        console.log('File picked:', pickerResult);

        if (pickerResult.type === 'success' && pickerResult.assets && pickerResult.assets.length > 0) {
            const fileUri = pickerResult.assets[0].uri;
            setDebugMessage(`File URI: ${fileUri}`);  // Log the file URI
            console.log('File URI:', fileUri);

            try {
                setDebugMessage('Attempting to read the CSV content...');
                const csvContent = await FileSystem.readAsStringAsync(fileUri);
                setDebugMessage('CSV content read successfully.');
                console.log('File read:', csvContent);

                try {
                    Papa.parse(csvContent, {
                        complete: (result) => {
                            console.log('Parsed:', result);
                            setCsvData(result.data);
                            console.log('Data ready for upload:', result.data);
                            handleUploadData(result.data, 'judges');
                        },
                        header: true,
                        skipEmptyLines: true,
                    });
                } catch (parseError) {
                    console.error('Parsing error:', parseError);
                }
            } catch (readError) {
                // Log and display detailed read error
                const errorMsg = `Error reading file: ${readError.message}`;
                console.error(errorMsg);
                setDebugMessage(errorMsg);
                Alert.alert('File Reading Error', errorMsg);
            }
        }
    } catch (err) {
        // Log and display detailed selection error
        const errorMsg = `Error during file selection: ${err.message}`;
        console.error(errorMsg);
        setDebugMessage(errorMsg);
        Alert.alert('Error', errorMsg);
    }
};



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{debugMessage}</Text>
      <Button title="Select CSV File" onPress={handleSelectFile} />
      {csvData.length > 0 && (
        <Text>{`${csvData.length} records loaded from CSV.`}</Text>
      )}
    </View>
  );
};

export default UploadCsvScreen;
