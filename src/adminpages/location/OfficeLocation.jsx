import React, { useState } from 'react'
import { doc, setDoc} from "firebase/firestore";
import { db } from '../../firebase';

import './officelocation.scss'

const OfficeLocation = () => {
  const [latitude, setLatitude] = useState(28.6292);
  const [longitude, setLongitude] = useState(77.3840);
  const [radius, setRadius] = useState(10)
  const [error, setError] = useState('');
  const [locationLoader, setLocationLoader] = useState(true)
  const [msg, setMsg] = useState('')

  const handleGetLocationClick = (e) => {
    e.preventDefault()
    console.log("fn location called")
    setError('')
    setMsg('')
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(4));
          setLongitude(position.coords.longitude.toFixed(4));
          setLocationLoader(false)
          setMsg("successfully fetched location")
        },
        (error) => {
          setLocationLoader(false)
          console.error("Error getting user location:", error.message);
          setError(error.message)
        }
      );
    } else {
      setLocationLoader(false)
      console.error("Geolocation is not available in this browser.");
    }
  };

const uploadToFirestore = async (e) => {
    e.preventDefault()
   await setDoc(doc(db, "officelocation", "h8jzagt3VGDlwpzUdgbI"), {
        latitude:latitude,
        longitude:longitude,
        radius:radius,
      
    }).then(()=>{
      setMsg("successfully updated office location")
    })
    // console.log("Document written with ID: ", docRef.id);
};

  return (
    <div className="office-location-container mt-10 lg:mt-20">
      <div className="office-location-wrapper">
        <div className="shadow-md m-5 p-10 w-[95vw] lg:w-[40vw] mx-auto">
          <h1 className="text-xl py-5 text-center font-bold text-cyan-900 ">Change Office Location</h1>
          <form
            className='flex flex-col gap-5'
            onSubmit={uploadToFirestore}
          >
            <input
              name='latitude'
              value={latitude}
              onChange={(e)=>setLatitude(e.target.value)}
              placeholder='enter latitude'
              className='border py-2 px-5 rounded-md'
              type='number'
              maxLength="7"
              minLength="6"
            />
            <input
              name='longitude'
              value={longitude}
              onChange={(e)=>setLongitude(e.target.value)}
              placeholder='enter longitude'
              className='border py-2 px-5 rounded-md'
              type='number'
              maxLength="7"
              minLength="6"
            />
            <input
              name='radius'
              value={radius}
              onChange={(e)=>setRadius(e.target.value)}
              placeholder='enter Radius'
              className='border py-2 px-5 rounded-md'
              type='number'
              maxLength="7"
              minLength="2"
            />
            {
              error && (
                <p className="text-red-500 font-bold">{error}</p>
              )
            }
            <p className="text-green-700 font-bold">
              {msg}
            </p>
            <button className='flex gap-2 items-center border-2 border-cyan-700 w-fit px-5 py-2 rounded-md '
              onClick={handleGetLocationClick}
            >
              <img src='/twocoordinates.png' className='w-[25px]'/>
              Locate
              
              </button>
            <button className='flex gap-2 items-center border-2 border-cyan-700 w-fit px-5 py-2 rounded-md '>
              Update
              </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OfficeLocation