// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/userSlice"

export const store= configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here if any
  },
});
