import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to local storage for web

import rootReducer from './reducers'; // Assuming you have a rootReducer

const persistConfig = {
  key: 'root', // Key for the persistor
  storage, // Storage type (default: local storage)
  whitelist: ['auth'], // List of reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const persistor = persistStore(persistedReducer);
