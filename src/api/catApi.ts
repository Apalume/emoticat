const url = process.env.EXPO_PUBLIC_API_URL;

export const analyzeCat = async (base64Image: string) => {
  console.log(url)
  const response = await fetch(`${url}/analyze-cat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image }),
  });
  
  if (!response.ok) {
    console.error('API response not OK:', response.status, response.statusText);
    throw new Error(`API response not OK: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
  
};

export const getEmotionDetails = async (emotion: string) => {
  const response = await fetch(`${url}/get-emotion-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emotion }),
  });

  if (!response.ok) {
    throw new Error('Invalid emotion details response');
  }

  return response.json();
};