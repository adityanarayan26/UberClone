'use client'

import React, { useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView } from '@react-google-maps/api';
import { useSourceContext, useDestinationContext } from '@/app/utils/Context';

const GoogleMapComp = () => {
  const { source } = useSourceContext();
  const { destination } = useDestinationContext();

  const [directionRoute, setDirectionRoute] = useState(null);
  const [center, setCenter] = useState({
    lat: 18.582,
    lng: 72.8321
  });

  // State for the map instance
  const [map, setMap] = useState(null);

  // NEW: State for animated polyline
  const [animatedPolyline, setAnimatedPolyline] = useState(null);

  // --- Define Uber-style marker icons as SVG Data URIs ---
  
  // FIXED: Replaced # with %23 for URL encoding
  // Source icon: Black circle with a white square
  const sourceIconUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="8" fill="%23000000"/>
    <rect x="4" y="4" width="8" height="8" fill="%23FFFFFF"/>
  </svg>`;

  // FIXED: Replaced # with %23 for URL encoding
  // Destination icon: Standard black map pin
  const destinationIconUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="%23000000" d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
  </svg>`;
  
  // Create icon objects for the map, checking if window.google is available
  const sourceIcon = window.google ? {
    url: sourceIconUrl,
    scaledSize: new window.google.maps.Size(16, 16),
    anchor: new window.google.maps.Point(8, 8), // Center
  } : null;

  const destinationIcon = window.google ? {
    url: destinationIconUrl,
    scaledSize: new window.google.maps.Size(24, 24),
    anchor: new window.google.maps.Point(12, 24), // Bottom-center
  } : null;

  // --- End of new marker definitions ---


  // Re-center map when SOURCE changes
  useEffect(() => {
    if (source && Object.keys(source).length > 0) {
      setCenter({
        lat: source.lat,
        lng: source.lng
      });
    }
  }, [source]); 

  // Re-center map when DESTINATION changes
  useEffect(() => {
    if (destination && Object.keys(destination).length > 0) {
      setCenter({
        lat: destination.lat,
        lng: destination.lng
      });
    }
  }, [destination]);

  // Handle calculating directions
  useEffect(() => {
    if (source && destination) {
      // Both source and destination are present, calculate route
      directions();
    } else {
      // Source or destination is missing, clear the route and polyline
      setDirectionRoute(null);
      if (animatedPolyline) {
        animatedPolyline.setMap(null);
        setAnimatedPolyline(null);
      }
    }
  }, [source, destination]); // Triggers when source or destination changes

  const directions = () => {
    if (window.google && window.google.maps && window.google.maps.DirectionsService) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: { lat: source?.lat, lng: source?.lng },
        destination: { lat: destination?.lat, lng: destination?.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionRoute(result);

          if (map) {
            map.fitBounds(result.routes[0].bounds);
          }

          // Animate polyline
          const routePath = result.routes[0].overview_path;
          if (animatedPolyline) {
            animatedPolyline.setMap(null);
          }
          const polyline = new window.google.maps.Polyline({
            path: [],
            strokeColor: '#000000',
            strokeWeight: 4,
            map: map,
          });
          setAnimatedPolyline(polyline);

          let index = 0;
          const interval = setInterval(() => {
            if (index < routePath.length) {
              polyline.getPath().push(routePath[index]);
              index++;
            } else {
              clearInterval(interval);
            }
          }, 12); // faster animation speed

        } else {
          console.error(`Error fetching directions: ${status}`);
          setDirectionRoute(null);
          if (animatedPolyline) {
            animatedPolyline.setMap(null);
            setAnimatedPolyline(null);
          }
        }
      });
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '500px' ,borderRadius:'10px'}}
      center={center}
      zoom={10}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
      }}
      // NEW: Get the map instance on load
      onLoad={(mapInstance) => { setMap(mapInstance); }}
    >
      {/* Source Marker */}
      {source && (
        <MarkerF
          position={{ lat: source.lat, lng: source.lng }}
          icon={sourceIcon} // UPDATED: Use new icon
        />
      )}

      {/* Destination Marker */}
      {destination && (
        <MarkerF
          position={{ lat: destination.lat, lng: destination.lng }}
          icon={destinationIcon} // UPDATED: Use new icon
        />
      )}

      {/* Source Label */}
      {source && (
        <OverlayView
          position={{ lat: source.lat, lng: source.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          // Offset the component to be below the 16x16 marker
          getPixelPositionOffset={(width, height) => ({
            x: -width / 2, // Center horizontally
            y: 12, // Place below the marker (8px half-height + 4px spacing)
          })}
        >
          <div className='flex items-center justify-center'>
            {/* UPDATED: Simplified styling for Uber-like label */}
            <p className='text-black bg-transparent text-sm font-uberMedium capitalize'>{source.label}</p>
          </div>
        </OverlayView>
      )}

      {/* Destination Label */}
      {destination && (
        <OverlayView
          position={{ lat: destination.lat, lng: destination.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          // Offset the component to be above the pin's anchor point
          getPixelPositionOffset={(width, height) => ({
            x: -width / 2, // Center horizontally
            y: -height - 28, // Place above the pin (24px icon height + 4px spacing)
          })}
        >
          <div className='flex items-center justify-center'>
            {/* UPDATED: Simplified styling for Uber-like label */}
            <p className='text-black bg-transparent text-sm font-uberMedium capitalize'>{destination.label}</p>
          </div>
        </OverlayView>
      )}

      {/* REMOVED: DirectionsRenderer block to enable manual polyline animation */}
    </GoogleMap>
  );
};

export default GoogleMapComp;
