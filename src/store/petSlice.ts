import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmotionRecord {
  image: string;
  emotion: string;
  emotionText: string;
  tipsAndRecs: string[];
  timestamp: number;
}

interface Pet {
  coverPicture: string | null;
  name: string;
  birthday: string | null;
  breed: string | null;
  emotionHistory: EmotionRecord[];
}

interface PetState {
  pets: Pet[];
}

const initialState: PetState = {
  pets: []
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    updatePetInfo: (state, action: PayloadAction<{ index: number; pet: Partial<Pet> }>) => {
      const { index, pet } = action.payload;
      state.pets[index] = { ...state.pets[index], ...pet };
    },
    addEmotionRecord: (state, action: PayloadAction<{ index: number; record: EmotionRecord }>) => {
      const { index, record } = action.payload;
      state.pets[index].emotionHistory.unshift(record);
    },
    clearEmotionHistory: (state, action: PayloadAction<number>) => {
      state.pets[action.payload].emotionHistory = [];
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    removePet: (state, action: PayloadAction<number>) => {
      state.pets.splice(action.payload, 1);
    },
  },
});

export const { updatePetInfo, addEmotionRecord, clearEmotionHistory, addPet, removePet } = petSlice.actions;

export default petSlice.reducer;