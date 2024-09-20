import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPetDetails } from '@/src/api/catApi';

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

export const fetchPetDetails = createAsyncThunk(
  'pets/fetchDetails',
  async (petId: number, { rejectWithValue }) => {
    try {
      const response = await getPetDetails(petId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const petSlice = createSlice({
  name: 'pet',
  initialState: {
    pets: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updatePetInfo: (state, action: PayloadAction<{ index: number; pet: Partial<Pet> }>) => {
      const { index, pet } = action.payload;
      state.pets[index] = { ...state.pets[index], ...pet };
    },
    updatePet: (state, action) => {
      const updatedPet = action.payload;
      const index = state.pets.findIndex(pet => pet.id === updatedPet.id);
      if (index !== -1) {
        state.pets[index] = updatedPet;
      }
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchPetDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPetDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.pets.findIndex(pet => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        } else {
          state.pets.push(action.payload);
        }
      })
      .addCase(fetchPetDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
    },
});

export const { updatePetInfo, updatePet, addEmotionRecord, clearEmotionHistory, addPet, removePet, setAllPets } = petSlice.actions;
export default petSlice.reducer;