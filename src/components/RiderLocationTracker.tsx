
"use client";

import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_RIDER_LOCATION } from '@/graphql/rider/mutations';
import useAuthStore from '@/stores/useAuthStore';

const RiderLocationTracker = () => {
  const { user } = useAuthStore();
  const [updateRiderLocation, { data, loading, error }] = useMutation(UPDATE_RIDER_LOCATION);
  const lastLocation = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (error) {
      console.error('Failed to update rider location:', error);
    }
  }, [error]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!position || !position.coords) {
            console.error('Error: Geolocation position or coordinates are null/undefined.');
            return;
          }
          const { latitude, longitude } = position.coords;

          if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            console.error('Error: Latitude or longitude are not valid numbers:', { latitude, longitude });
            return;
          }

          if (
            !lastLocation.current ||
            latitude !== lastLocation.current.latitude ||
            longitude !== lastLocation.current.longitude
          ) {
            updateRiderLocation({
              variables: {
                input: {
                  latitude,
                  longitude,
                },
              },
            });
            lastLocation.current = { latitude, longitude };
            console.log('Rider location updated:', { latitude, longitude });
          } else {
            console.log('Rider location has not changed.');
          }
        },
        (error) => {
          console.error('Error getting location:', error.code, error.message);
          // Handle specific error codes if necessary
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            // case error.UNKNOWN_ERROR:
            //   console.error("An unknown error occurred.");
            //   break;
          }
        }
      );
    };

    if (user?.userType === 'RIDER') {
      // Update location immediately on component mount
      updateLocation();

      // Update location every 5 minutes
      intervalId = setInterval(updateLocation, 5 * 60 * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, updateRiderLocation]);

  return null;
};

export default RiderLocationTracker;
