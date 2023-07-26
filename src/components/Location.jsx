import React, { useEffect, useState } from 'react';

const Location = () => {
  const [isUserInsideGeofence, setIsUserInsideGeofence] = useState(false);
  const [error, setError] = useState(null);

  // Replace these with the latitude and longitude of your target location
  const targetLatitude = 28.6292;
  const targetLongitude = 77.3840;
  // Calculate the distance in meters that defines your geofence (e.g., 100 meters)
  const geofenceRadius = 10;

  // Function to handle successful retrieval of user's location
  const successHandler = (position) => {
    const { latitude, longitude } = position.coords;
    const distanceToTarget = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      targetLatitude,
      targetLongitude
    );

    // Check if the user is inside the geofence
    const insideGeofence = distanceToTarget <= geofenceRadius;
    setIsUserInsideGeofence(insideGeofence);

    // Run your function when the user is inside the geofence
    if (insideGeofence) {
      handleUserInsideGeofence();
    }
  };

  // Function to handle errors when trying to retrieve user's location
  const errorHandler = (error) => {
    console.error('Error fetching location: ', error);
    setError('Error fetching location. Please allow location access.');
  };

  // Function to calculate the distance between two sets of latitude and longitude
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Convert distance to meters
    return distance;
  };

  // Function to convert degrees to radians
  const deg2rad = (deg) => deg * (Math.PI / 180);

  // Function to run when the user is inside the geofence
  const handleUserInsideGeofence = () => {
    console.log('User is inside the geofence. Run your function here.');
    // Your custom logic or function call when the user is inside the geofence
  };


  useEffect(() => {




    // Check if geolocation is available in the browser
    if ('geolocation' in navigator) {
      // Get the user's location
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    } else {
      console.error('Geolocation is not available in this browser.');
      setError('Geolocation is not available in this browser.');
    }
  }, []);

  // Function to reverify the user's location when the button is clicked
  const reverifyLocation = () => {
    setError(null); // Clear any previous errors
    setIsUserInsideGeofence(false); // Reset the geofence state

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    } else {
      console.error('Geolocation is not available in this browser.');
      setError('Geolocation is not available in this browser.');
    }
  };

  return (
    <div className='flex flex-col gap-20 justify-center p-10'>
      {error && <p>Error: {error}</p>}
      {isUserInsideGeofence ? (
        <p>You are inside the geofence!</p>
      ) : (
        <p>You are outside the geofence.</p>
      )}

      <button onClick={reverifyLocation}
        className="w-fit border bg-cyan-700 text-white p-2 rounded-md shadow-md"
      >Reverify Location</button>
    </div>
  );
};

export default Location;
