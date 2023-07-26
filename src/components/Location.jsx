import React, { useEffect, useState } from 'react';

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to handle successful retrieval of user's location
    const successHandler = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    };

    // Function to handle errors when trying to retrieve user's location
    const errorHandler = (error) => {
      setError('Error fetching location. Please allow location access.');
    };

    // Check if geolocation is available in the browser
    if ('geolocation' in navigator) {
      // Get the user's location
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    } else {
      setError('Geolocation is not available in this browser.');
    }
  }, []);

  return (
    <div>
      {location ? (
        <div>
          <h2>Your Location:</h2>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : (
        <p>{error || 'Fetching your location...'}</p>
      )}
    </div>
  );
};

export default Location;
