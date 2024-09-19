import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  'Content-Type': 'application/json',
};

const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const addPet = async (petData: any) => {
  try {
    return await apiClient('/pets/add', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

export const analyzeCat = async (base64Image: string, petId: number) => {
  try {
    return await apiClient('/cats/analyze', {
      method: 'POST',
      body: JSON.stringify({ image: base64Image, petId }),
    });
  } catch (error) {
    console.error('Error analyzing cat:', error);
    throw error;
  }
};

export const getEmotionDetails = async (emotion: string) => {
  try {
    return await apiClient('/cats/get-emotion-details', {
      method: 'POST',
      body: JSON.stringify({ emotion }),
    });
  } catch (error) {
    console.error('Error getting emotion details:', error);
    throw error;
  }
};

export const getPetDetails = async (petId: number) => {
  try {
    return await apiClient(`/pets/${petId}`);
  } catch (error) {
    console.error('Error fetching pet details:', error);
    throw error;
  }
};

export const getAllPets = async () => {
  try {
    return await apiClient('/pets');
  } catch (error) {
    console.error('Error fetching all pets:', error);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An unknown error occurred');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
export const register = async (username: string, email: string, password: string) => {
  try {
    return await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export default apiClient;