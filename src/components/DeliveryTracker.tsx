"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { UPDATE_RIDER_LOCATION } from '@/graphql/rider/mutations';
import { RIDER_LOCATION_UPDATED_SUBSCRIPTION } from '@/graphql/rider/queries';
import useAuthStore from '@/stores/useAuthStore';

interface DeliveryTrackerProps {
  orderId?: string; // Required for users/admins to track a specific order
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ orderId }) => {
  const { user } = useAuthStore();
  const [currentRiderLocation, setCurrentRiderLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [updateRiderLocation] = useMutation(UPDATE_RIDER_LOCATION);
  const lastLocation = useRef<{ latitude: number; longitude: number } | null>(null);

  // --- Rider-side: Stream own location ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const sendLocationUpdate = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

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
          console.error('Error getting location:', error);
        }
      );
    };

    if (user?.userType === 'RIDER') {
      // Update location immediately on component mount
      sendLocationUpdate();

      // Update location every 5 minutes
      intervalId = setInterval(sendLocationUpdate, 5 * 60 * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, updateRiderLocation]);

  // --- User/Admin-side: Subscribe to rider location ---
  const { data: subscriptionData, error: subscriptionError } = useSubscription(
    RIDER_LOCATION_UPDATED_SUBSCRIPTION,
    {
      variables: { orderId },
      skip: !orderId || user?.userType === 'RIDER', // Skip if no orderId or if current user is a RIDER
    }
  );

  useEffect(() => {
    if (subscriptionError) {
      console.error('Subscription error:', subscriptionError);
    }
    if (subscriptionData?.riderLocationUpdated) {
      const { latitude, longitude } = subscriptionData.riderLocationUpdated;
      setCurrentRiderLocation({ latitude, longitude });
      console.log('Rider location update received:', { latitude, longitude });
    }
  }, [subscriptionData, subscriptionError]);

  // --- Render Map (Placeholder) ---
  return (
    <div>
      {user?.userType === 'RIDER' && (
        <p>Your location is being streamed for active deliveries.</p>
      )}

      {(user?.userType === 'USER' || user?.userType === 'ADMIN') && orderId && (
        <div>
          <h3>Tracking Rider for Order: {orderId}</h3>
          {currentRiderLocation ? (
            <div>
              <p>Rider Latitude: {currentRiderLocation.latitude}</p>
              <p>Rider Longitude: {currentRiderLocation.longitude}</p>
              {/* Placeholder for map rendering */}
              <div style={{ width: '100%', height: '400px', backgroundColor: '#e0e0e0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Map will be rendered here showing rider at: {currentRiderLocation.latitude}, {currentRiderLocation.longitude}</p>
              </div>
            </div>
          ) : (
            <p>Waiting for rider location updates...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryTracker;
