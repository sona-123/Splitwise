import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/userSlice";

// Create the Redux store with configureStore
export const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here if any
  },
});
