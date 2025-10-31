"use client";

import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { useEffect, useState, useCallback } from "react";

const containerStyle = { width: "100%", height: "400px" }; // Fixed height for the map

interface RouteMapProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

export default function RouteMap({ origin, destination }: RouteMapProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    if (mapLoaded && origin && destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") setDirections(result);
        }
      );
    }
  }, [mapLoaded, origin, destination]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} onLoad={onMapLoad}>
      <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={14}>
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}