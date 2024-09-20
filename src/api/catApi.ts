import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  'Content-Type': 'application/json',
};

const PETS_CACHE_KEY = 'cached_pets';
const PETS_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds


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
    const formData = new FormData();
    formData.append('name', petData.name);
    formData.append('breed', petData.breed);
    formData.append('birthday', petData.birthday);

    if (petData.image) {
      const fileInfo = await FileSystem.getInfoAsync(petData.image);
      if (fileInfo.exists) {
        formData.append('image', {
          uri: petData.image,
          name: 'pet_image.jpg',
          type: 'image/jpeg'
        } as any);
      } else {
        throw new Error('Image file does not exist');
      }
    }

    const response = await apiClient('/pets/add', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Ensure the response matches the Pet interface
    return {
      pet: {
        ...response.pet,
        image_key: response.pet.image_key, // Ensure this property exists
      }
    };
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

export const analyzeCat = async (base64Image: string, petId: number | undefined) => {
  try {
    if (!base64Image) {
      throw new Error('Image is required');
    }
    if (petId === undefined) {
      throw new Error('Pet ID is required');
    }
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

export const getAllPets = async (forceRefresh = false) => {
  try {
    // Check cache first if not forcing a refresh
    if (!forceRefresh) {
      const cachedData = await AsyncStorage.getItem(PETS_CACHE_KEY);
      if (cachedData) {
        const { timestamp, pets } = JSON.parse(cachedData);
        if (Date.now() - timestamp < PETS_CACHE_EXPIRY) {
          console.log('Returning cached pets data');
          return pets;
        }
      }
    }

    // If cache is missing, expired, or refresh is forced, fetch from server
    const response = await fetch(`${API_URL}/pets`, {
      headers: {
        ...headers,
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pets = await response.json();

    // Update cache
    await AsyncStorage.setItem(PETS_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      pets
    }));

    return pets;
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
    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.token || !response.username) {
      throw new Error('Registration failed: Invalid response from server');
    }

    return {
      username: response.username,
      token: response.token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getPetImageData = async (imageKey: string): Promise<string> => {
  const cacheKey = `pet_image_${imageKey}`;
  
  try {
    // Check if the image is cached
    const cachedPath = await AsyncStorage.getItem(cacheKey);
    if (cachedPath && await FileSystem.getInfoAsync(cachedPath).then(info => info.exists)) {
      return cachedPath;
    }

    // If not cached, fetch from server
    const response = await fetch(`${API_URL}/pets/image/${encodeURIComponent(imageKey)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const fileReaderInstance = new FileReader();
    return new Promise((resolve, reject) => {
      fileReaderInstance.onload = async () => {
        if (typeof fileReaderInstance.result === 'string') {
          const base64Data = fileReaderInstance.result.split(',')[1];
          // Remove the .jpg extension from imageKey if it's already there
          const cleanImageKey = imageKey.endsWith('.jpg') ? imageKey.slice(0, -4) : imageKey;
          const filePath = `${FileSystem.cacheDirectory}${cleanImageKey}.jpg`;
          
          try {
            console.log('Writing to file:', filePath);
            console.log('Base64 data length:', base64Data.length);
            
            // Check if the directory exists
            const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
            const dirInfo = await FileSystem.getInfoAsync(dirPath);
            if (!dirInfo.exists) {
              console.log('Creating directory:', dirPath);
              await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
            }
            
            await FileSystem.writeAsStringAsync(filePath, base64Data, { encoding: FileSystem.EncodingType.Base64 });
            await AsyncStorage.setItem(cacheKey, filePath);
            resolve(filePath);
          } catch (writeError) {
            console.error('Error writing file:', writeError);
            reject(writeError);
          }
        } else {
          reject(new Error('Failed to read image data'));
        }
      };
      fileReaderInstance.onerror = reject;
      fileReaderInstance.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image data:', error);
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
  }
};

export default apiClient;