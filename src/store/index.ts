import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import petReducer from './petSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    pet: petReducer,
    // ... other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;