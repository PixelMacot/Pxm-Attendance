import { createContext, useEffect, useState } from "react";
import { getDistance } from "geolib";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { toast } from 'react-toastify';
export const LocationContext = createContext();
export const LocationContextProvider = ({ children }) => {

  const [isUserInsideGeofence, setIsUserInsideGeofence] = useState(false);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState(9999)
  //second code
  const [locationLoader, setLocationLoader] = useState(true)
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [geofenceCenter, setgeofenceCenter] = useState(
    {
      latitude: 28.7292,
      longitude: 77.2840
    }
  )
  // const geofenceCenter = { latitude: 28.6292, longitude: 77.3840 };

  // Calculate the distance in meters that defines your geofence (e.g., 100 meters)
  const geofenceRadius = 10;

  useEffect(() => {
    // Check if geolocation is available in the browser
    fetchOfficeLocation().then(() => {
      handleGetLocationClick()
    }).catch((err) => {
      console.log("err fetching office location", err)
    })
  }, []);


  //fetch office loaction 
  const fetchOfficeLocation = async () => {
    const docRef = doc(db, "officelocation", "h8jzagt3VGDlwpzUdgbI");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Location data:", docSnap.data());
      setgeofenceCenter(
        {
          latitude: docSnap.data().latitude,
          longitude: docSnap.data().longitude
        }
      )
      toast.success("Location data loaded")
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }




  // Function to reverify the user's location when the button is clicked
  const reverifyLocation = () => {
    toast.info("loading location data...",{autoClose:800})
    setError('')
    setLatitude(null);
    setLongitude(null);
    fetchOfficeLocation()
    handleGetLocationClick()
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
          setDistance(distance)
          if (distance <= geofenceRadius) {
            console.log("User is inside the geofence.", distance);
            setIsUserInsideGeofence(true)
          } else {
            console.log("User is outside the geofence.", distance);
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
        locationLoader,
        distance

      }}>
      {children}
    </LocationContext.Provider>
  );
};