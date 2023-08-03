import { createContext, useEffect, useState } from "react";
import { getDistance } from "geolib";

export const LocationContext = createContext();

export const LocationContextProvider = ({ children }) => {

  const [isUserInsideGeofence, setIsUserInsideGeofence] = useState(false);
  const [error, setError] = useState(null);
  //second code
  const [locationLoader,setLocationLoader] = useState(true)
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const geofenceCenter = { latitude: 28.6292, longitude: 77.3840 };

  // Calculate the distance in meters that defines your geofence (e.g., 100 meters)
  const geofenceRadius = 10;

  useEffect(() => {
    // Check if geolocation is available in the browser
    handleGetLocationClick()

  }, []);

  // Function to reverify the user's location when the button is clicked
  const reverifyLocation = () => {
    setLatitude(null);
    setLongitude(null);
  };

  const handleGetLocationClick = () => {
    console.log("fn location called")
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationLoader(false)
          const userPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const distance = getDistance(userPosition, geofenceCenter);

          if (distance <= geofenceRadius) {
            console.log("User is inside the geofence.");
            setIsUserInsideGeofence(true)
          } else {
            console.log("User is outside the geofence.");
            setIsUserInsideGeofence(false)
          }
        },
        (error) => {
          setLatitude(28.5292);
          setLongitude(77.3840);
          setLocationLoader(false)
          console.error("Error getting user location:", error.message);
          setError(error.message)
        }
      );
    } else {
      setLatitude(28.5292);
      setLongitude(77.3840);
      setLocationLoader(false)
      console.error("Geolocation is not available in this browser.");
    }
  };

  return (
    <LocationContext.Provider value={
      {
        handleGetLocationClick,
        isUserInsideGeofence,
        error,
        latitude,
        longitude,
        reverifyLocation,
        locationLoader
      
      }}>
      {children}
    </LocationContext.Provider>
  );
};