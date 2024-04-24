// src/context/FirebaseContext.js
import React, { createContext, useState, useCallback } from 'react';

export const FirebaseContext = createContext({
  attachListener: () => {},
  detachListeners: () => {}
});

export const FirebaseProvider = ({ children }) => {
  const [listeners, setListeners] = useState([]);

  const attachListener = useCallback((ref, eventType, handler, errorFn) => {
    ref.on(eventType, handler, errorFn);
    setListeners(prev => [...prev, { ref, eventType, handler }]);
  }, []);

  const detachListeners = useCallback(() => {
    listeners.forEach(({ ref, eventType, handler }) => {
      ref.off(eventType, handler);
    });
    setListeners([]);
  }, [listeners]);

  return (
    <FirebaseContext.Provider value={{ attachListener, detachListeners }}>
      {children}
    </FirebaseContext.Provider>
  );
};
