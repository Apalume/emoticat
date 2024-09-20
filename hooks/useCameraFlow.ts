import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  setStage,
  setSelectedPet,
  setImage,
  setAnalysisResult,
  setEmotionDetails,
} from '@/src/store/cameraFlowSlice';

export function useCameraFlow() {
  const dispatch = useDispatch();

  const compressAndResizeImage = useCallback(async (uri) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 512, height: 512 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipulatedImage.base64;
  }, []);

  const handleImageSelection = useCallback(async (type) => {
    let result;
    if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }
  
    if (!result.canceled) {
      dispatch(setImage(result.assets[0].uri));
      const compressedImage = await compressAndResizeImage(result.assets[0].uri);
      dispatch(analyzeImage(compressedImage));
    }
  }, [dispatch, compressAndResizeImage]);

  const handleNewPicture = useCallback(() => {
    dispatch(setImage(null));
    dispatch(setAnalysisResult(null));
    dispatch(setEmotionDetails(null));
    dispatch(setStage('imageCapture'));
  }, [dispatch]);

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return '';
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const handleContinue = useCallback(() => {
    dispatch(setStage('imageCapture'));
  }, [dispatch]);

  const handleCancelSelection = useCallback(() => {
    dispatch(setSelectedPet(null));
    dispatch(setStage('petSelection'));
  }, [dispatch]);

  return {
    handleImageSelection,
    handleNewPicture,
    formatTimestamp,
    handleContinue,
    handleCancelSelection,
    setSelectedPet: (pet: number | null) => dispatch(setSelectedPet(pet)),
  };
}