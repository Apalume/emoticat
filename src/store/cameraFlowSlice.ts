import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { analyzeCat } from '../api/catApi';
import { getEmotionEmoji } from '../utils/emotionUtils';

interface CameraFlowState {
  stage: 'petSelection' | 'imageCapture' | 'analysisResult';
  selectedPet: number | null; // This now represents the pet's ID
  image: string | null;
  analyzing: boolean;
  analysisResult: any;
  emotionDetails: any;
  analysisTimestamp: string | null;
}

const initialState: CameraFlowState = {
  stage: 'petSelection',
  selectedPet: null,
  image: null,
  analyzing: false,
  analysisResult: null,
  emotionDetails: null,
  analysisTimestamp: null,
};

export const analyzeImage = createAsyncThunk(
  'cameraFlow/analyzeImage',
  async ({ image, petId }: { image: string; petId: number | undefined }, { dispatch, rejectWithValue }) => {
    dispatch(setAnalyzing(true));
    dispatch(setAnalysisTimestamp(new Date().toISOString()));
    try {
      console.log(`in analyzeImage for ${petId}`);
      if (petId === undefined) {
        throw new Error('No pet selected');
      }
      const data = await analyzeCat(image, petId);
      console.log('API response:', data); // Add this log
      if (!data.message.startsWith('ERROR:')) {
        return { 
          analysisResult: { 
            emotion: data.message, 
            image_key: data.imageKey
          }, 
          emotionDetails: data.emotionDetails
        };
      }
      return rejectWithValue(data.message);
    } catch (error) {
      console.error('Error in analyzeImage:', error);
      return rejectWithValue(error.message || 'Analysis failed');
    }
  }
);

const cameraFlowSlice = createSlice({
  name: 'cameraFlow',
  initialState,
  reducers: {
    setStage: (state, action: PayloadAction<CameraFlowState['stage']>) => {
      state.stage = action.payload;
    },
    setSelectedPet: (state, action: PayloadAction<number | null>) => {
      state.selectedPet = action.payload;
    },
    setImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
    },
    setAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.analyzing = action.payload;
    },
    setAnalysisResult: (state, action: PayloadAction<any>) => {
      state.analysisResult = action.payload;
    },
    setEmotionDetails: (state, action: PayloadAction<any>) => {
      state.emotionDetails = action.payload;
    },
    setAnalysisTimestamp: (state, action: PayloadAction<string | null>) => {
      state.analysisTimestamp = action.payload;
    },
    resetCameraFlow: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeImage.pending, (state) => {
        state.analyzing = true;
        state.analysisResult = null;
        state.emotionDetails = null;
      })
      .addCase(analyzeImage.fulfilled, (state, action) => {
        state.analyzing = false;
        console.log('Reducer received:', action.payload); // Add this log
        const { analysisResult, emotionDetails } = action.payload;
        state.analysisResult = {
          emotion: analysisResult.emotion,
          emoji: getEmotionEmoji(analysisResult.emotion),
        };
        state.emotionDetails = emotionDetails;
        state.stage = 'analysisResult';
      })
      .addCase(analyzeImage.rejected, (state, action) => {
        state.analyzing = false;
        state.analysisResult = {
          emotion: 'Failed to analyze image. Please try again.',
          emoji: '❓',
        };
        state.stage = 'analysisResult';
      });
  },
});

export const {
  setStage,
  setSelectedPet,
  setImage,
  setAnalyzing,
  setAnalysisResult,
  setEmotionDetails,
  setAnalysisTimestamp,
  resetCameraFlow,
} = cameraFlowSlice.actions;

export default cameraFlowSlice.reducer;