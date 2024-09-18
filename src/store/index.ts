import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import petReducer from './petSlice';
import cameraReducer from './cameraFlowSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    pet: petReducer,
    cameraFlow: cameraReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;