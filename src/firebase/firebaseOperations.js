// src/firebase/firebaseOperations.js
import { getDatabase, ref, update } from 'firebase/database';
import { app } from './firebaseConfig'; // Make sure this path is correct

export const assignJudgeToEvent = (eventId, judgeUid) => {
  const db = getDatabase(app); // Change variable name from database to db
  const updates = {};
  updates['events/' + eventId + '/judges/' + judgeUid] = true;
  updates['judges/' + judgeUid + '/events/' + eventId] = true;

  return update(ref(db), updates);
};