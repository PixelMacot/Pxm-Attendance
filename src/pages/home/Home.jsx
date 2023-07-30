import React, { useState, useEffect, useContext } from 'react';
import CalendarApp from '../../components/calenda/CalendarApp';
import moment from 'moment';
import Profile from '../../components/profile/Profile';
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import CalendarComponent from '../../components/calendar/Calendar'

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

      <div className="shadow-md w-[90%] mx-auto py-5">
        <Profile userData={userData}
          markAttendance={markAttendance}
          show={true}
          datearr={markdate} />
      </div>
     <div className="shadow-md w-[90%] mx-auto my-5">
     {
        markdate && (
          <CalendarComponent />
        )
      }
     </div>
    </section>
  )
}

export default Home