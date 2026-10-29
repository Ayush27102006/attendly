/**
 * store.js — Redux Store Configuration
 * ======================================
 * PE-2 Requirement 3: Redux Toolkit — configureStore
 *
 * This file creates the single Redux store for the entire app.
 * configureStore() from Redux Toolkit automatically:
 *   - Sets up Redux DevTools Extension (you can inspect state in browser)
 *   - Adds redux-thunk middleware (needed for async thunks)
 *   - Enables the Immer library (allows "mutating" state in reducers safely)
 *
 * Viva question: "What is the Redux store?"
 * → A single JavaScript object that holds the entire application state.
 *   Components read state with useSelector(). They change state by
 *   dispatching actions with useDispatch().
 */

import { configureStore } from '@reduxjs/toolkit';
import attendanceReducer from '../features/attendance/attendanceSlice';

const store = configureStore({
  reducer: {
    // The 'attendance' key here determines where the state lives:
    // state.attendance.data, state.attendance.status, etc.
    attendance: attendanceReducer,
  },
});

export default store;

