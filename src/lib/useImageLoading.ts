'use client';

import { useState, useEffect, useCallback } from 'react';

interface ImageLoadingState {
  isLoading: boolean;
  loadedImages: Set<string>;
  totalImages: number;
}

export function useImageLoading(imageUrls: string[]) {
  const [loadingState, setLoadingState] = useState<ImageLoadingState>({
    isLoading: imageUrls.length > 0, // Only loading if there are images to load
    loadedImages: new Set(),
    totalImages: imageUrls.length
  });

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadingState(prev => {
      const newLoadedImages = new Set(prev.loadedImages);
      newLoadedImages.add(imageUrl);
      
      // Only consider loading complete when we've loaded the required number of images
      const isLoading = newLoadedImages.size < prev.totalImages;
      
      return {
        isLoading,
        loadedImages: newLoadedImages,
        totalImages: prev.totalImages
      };
    });
  }, []);

  const handleImageError = useCallback((imageUrl: string) => {
    // Treat failed images as "loaded" to not block the UI indefinitely
    handleImageLoad(imageUrl);
  }, [handleImageLoad]);

  // Reset loading state when imageUrls change
  useEffect(() => {
    setLoadingState({
      isLoading: imageUrls.length > 0,
      loadedImages: new Set(),
      totalImages: imageUrls.length
    });
    
    // Fallback: if no images are loaded after 3 seconds, assume they're all loaded
    if (imageUrls.length > 0) {
      const timeout = setTimeout(() => {
        setLoadingState(prev => {
          if (prev.loadedImages.size === 0) {
            return {
              isLoading: false,
              loadedImages: new Set(imageUrls), // Mark all as loaded
              totalImages: imageUrls.length
            };
          }
          return prev;
        });
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [imageUrls]);

  return {
    isLoading: loadingState.isLoading,
    loadedCount: loadingState.loadedImages.size,
    totalCount: loadingState.totalImages,
    handleImageLoad,
    handleImageError
  };
}

