import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmotionRecord {
  image: string;
  emotion: string;
  emotionText: string;
  tipsAndRecs: string[];
  timestamp: number;
}

interface PetState {
  coverPicture: string | null;
  name: string;
  birthday: string | null;
  breed: string | null;
  emotionHistory: EmotionRecord[];
}

const initialState: PetState = {
  coverPicture: null,
  name: 'Muna',
  birthday: null,
  breed: null,
  emotionHistory: [],
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    updatePetInfo: (state, action: PayloadAction<Partial<PetState>>) => {
      return { ...state, ...action.payload };
    },
    addEmotionRecord: (state, action: PayloadAction<EmotionRecord>) => {
      state.emotionHistory.unshift(action.payload);
    },
    clearEmotionHistory: (state) => {
      state.emotionHistory = [];
    },
  },
});

export const { updatePetInfo, addEmotionRecord, clearEmotionHistory } = petSlice.actions;

export default petSlice.reducer;