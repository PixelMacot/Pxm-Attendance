import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import { getDistance, isPointInPolygon } from "geolib";

const GeofenceMap = ({ fenceCoordinates }) => {
  const [insideGeofence, setInsideGeofence] = useState(false);

  const CheckGeofence = () => {
    const map = useMapEvents({
      click: (e) => {
        const clickedPosition = [e.latlng.lat, e.latlng.lng];
        const isInside = isPointInPolygon(clickedPosition, fenceCoordinates);
        setInsideGeofence(isInside);
      },
    });

    return null;
  };

  const handleButtonClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = [position.coords.latitude, position.coords.longitude];
          const isInside = isPointInPolygon(userPosition, fenceCoordinates);
          setInsideGeofence(isInside);
          if (isInside) {
            // Call your function here if the user is inside the geofence
            // YourFunction();
          }
        },
        (error) => {
          console.error("Error getting user location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  useEffect(() => {
    // You can also use Geolib functions here for additional geospatial calculations
  }, [fenceCoordinates]);

  return (
    <div>
      <MapContainer center={[0, 0]} zoom={12} style={{ height: "400px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polygon positions={fenceCoordinates} />
        <CheckGeofence />
      </MapContainer>
      <button onClick={handleButtonClick}>Check User Location</button>
      {insideGeofence ? <p>User is inside the geofence.</p> : <p>User is outside the geofence.</p>}
    </div>
  );
};

export default GeofenceMap;
