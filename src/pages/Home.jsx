import React, { useState, useEffect, useContext } from 'react';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import CalendarApp from '../components/CalendarApp';
import moment from 'moment';
import Profile from '../components/Profile';
import { AuthContext } from '../context/AuthContext'
import { CalendarContext } from '../context/CalendarContext'
import { LocationContext } from '../context/LocationContext'

const Home = () => {
  const { currentUser, userData } = useContext(AuthContext)
  const { getAttendanceData, markAttendance, markdate, attendance, markdatefunction } = useContext(CalendarContext)
  

  useEffect(() => {
    return () => {
      getAttendanceData(currentUser.uid)
    };
  }, []);

  useEffect(() => {
    markdatefunction()
    return () => {
    };
  }, [attendance]);



  return (
    <section className='min-h-[100vh]'>

      <div className="">


        <Profile userData={userData}
          markAttendance={markAttendance}
          show={true}
          datearr={markdate} />

        {/* //user-attendance-info */}
        <div className="user-attendance border w-[90%] mx-auto my-8 p-5 shadow-md flex items-center justify-center">
          {
            markdate && (
              <CalendarApp arr={markdate} />
            )
          }
        </div>
      </div>

    </section>
  )
}

export default Home