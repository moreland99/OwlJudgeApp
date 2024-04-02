// src/config/localeSetup.js
import { registerTranslation } from 'react-native-paper-dates';
import { enUS } from 'date-fns/locale'; // Import the locale you want to use

registerTranslation('en-US', {
  save: 'Save',
  close: 'Close',
  selectSingle: 'Select date',
  typeInDate: 'Type in date',
  previous: 'Previous',
  next: 'Next',
  // Add other keys as needed
});
