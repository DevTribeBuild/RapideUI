
"use client";

import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_RIDER_LOCATION_MUTATION } from '@/graphql/rider/mutations';
import useAuthStore from '@/stores/useAuthStore';

const RiderLocationTracker = () => {
  console.log('RiderLocationTracker component rendered');
  const { user } = useAuthStore();
  const [updateRiderLocation] = useMutation(UPDATE_RIDER_LOCATION_MUTATION);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateRiderLocation({
            variables: {
              input: {
                latitude,
                longitude,
              },
            },
          });
          console.log('Rider location updated:', { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
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
