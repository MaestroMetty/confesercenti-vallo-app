'use client';

import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  userPostalCode: string | null;
  isLoading: boolean;
  error: string | null;
  isEnabled: boolean;
}

/**
 * Custom hook to get user's location and convert it to postal code (CAP)
 * Uses browser geolocation API and OpenStreetMap Nominatim for reverse geocoding
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    userPostalCode: null,
    isLoading: false,
    error: null,
    isEnabled: false,
  });

  /**
   * Reverse geocoding: Convert coordinates to postal code using OpenStreetMap Nominatim
   */
  const getPostalCodeFromCoordinates = useCallback(async (
    latitude: number,
    longitude: number
  ): Promise<string | null> => {
    try {
      // Use OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'EnergyTeamApp/1.0', // Required by Nominatim
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch postal code');
      }

      const data = await response.json();
      const postalCode = data.address?.postcode;

      if (!postalCode) {
        throw new Error('Postal code not found in response');
      }

      return postalCode;
    } catch (error) {
      console.error('Error getting postal code:', error);
      throw error;
    }
  }, []);

  /**
   * Get user's current position and convert to postal code
   */
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalizzazione non supportata dal browser',
        isLoading: false,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const postalCode = await getPostalCodeFromCoordinates(latitude, longitude);

          setState({
            userPostalCode: postalCode,
            isLoading: false,
            error: null,
            isEnabled: true,
          });
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: 'Impossibile ottenere il CAP dalla posizione',
            isLoading: false,
            isEnabled: false,
          }));
        }
      },
      (error) => {
        let errorMessage = 'Errore durante la geolocalizzazione';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permesso di geolocalizzazione negato';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Posizione non disponibile';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout durante la richiesta di posizione';
            break;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          isEnabled: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, [getPostalCodeFromCoordinates]);

  /**
   * Disable location filtering
   */
  const disableLocation = useCallback(() => {
    setState({
      userPostalCode: null,
      isLoading: false,
      error: null,
      isEnabled: false,
    });
  }, []);

  return {
    userPostalCode: state.userPostalCode,
    isLoading: state.isLoading,
    error: state.error,
    isEnabled: state.isEnabled,
    getCurrentLocation,
    disableLocation,
  };
}

