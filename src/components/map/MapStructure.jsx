import React, { useState, useEffect, useContext } from 'react'
import './map.scss'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationContext } from '../../context/LocationContext'

const MapStructure = () => {
    const [mapCenter, setMapCenter] = useState();
    const [placeName, setPlaceName] = useState('');
    const { lat, lon } = useContext(LocationContext)

    // const mapCenter = [latitude, longitude]; // Initial map center (latitude, longitude)
    console.log(mapCenter)

    useEffect(() => {
        setMapCenter([lat, lon])
        const fetchAddress = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
                );
                const data = await response.json();
                setPlaceName(data.display_name.slice(0,50));
            } catch (error) {
                console.error('Error fetching address:', error);
                setPlaceName('Your Location.');
            }
        };
        fetchAddress(lat ,lon)
    }, [])
  
  

    if (!mapCenter) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="map">
            <div className="maincontainer">
                <div className="map-wrapper">

                    <MapContainer
                        center={mapCenter}
                        zoom={13}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={mapCenter}>
                            
                            <Popup>
                            <img src="/logo.png" alt="" className='w-[40%]'/>
                                {placeName || 'Loading...'}
                            </Popup>
                        </Marker>
                    </MapContainer>

                </div>
            </div>
        </div>
    )
}

export default MapStructure