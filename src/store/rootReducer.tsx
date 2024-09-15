import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;