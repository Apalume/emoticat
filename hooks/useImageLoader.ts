import { useState, useEffect } from 'react';
import { getPetImageData } from '@/src/api/catApi';

export const useImageLoader = (imageKey: string | null) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (imageKey) {
        try {
          setLoading(true);
          const data = await getPetImageData(imageKey);
          if (isMounted) {
            setImageUri(data);
          }
        } catch (error) {
          console.error('Error loading image:', error);
          if (isMounted) {
            setImageUri(null);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        setImageUri(null);
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [imageKey]);

  return { imageUri, loading };
};