import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmotionRecord {
  image_key: string; // Add this line
  emotion: string;
  emotionText: string;
  tipsAndRecs: string[];
  timestamp: number;
}

interface Pet {
  id: number;
  image_key: string | null; // Changed from imageKey to image_key
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
    addEmotionRecord: (state, action: PayloadAction<{ petId: number; record: EmotionRecord }>) => {
      const { petId, record } = action.payload;
      const pet = state.pets.find(p => p.id === petId);
      if (pet) {
        if (!pet.emotionHistory) {
          pet.emotionHistory = [];
        }
        pet.emotionHistory.unshift(record);
      }
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
    setAllPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
    },
  },
});

export const { updatePetInfo, addEmotionRecord, clearEmotionHistory, addPet, removePet, setAllPets } = petSlice.actions;
export default petSlice.reducer;