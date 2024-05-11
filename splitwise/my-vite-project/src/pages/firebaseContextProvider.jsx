// FirebaseContextProvider.js
import React, { createContext } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { app } from '../firebase';

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
    const auth = getAuth(app);
    const db = getDatabase(app);

    return (
        <FirebaseContext.Provider value={{ auth, db }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseContext;
