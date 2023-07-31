import React, { useState, useEffect, useContext } from 'react';
import CalendarApp from '../../components/calenda/CalendarApp';
import moment from 'moment';
import Profile from '../../components/profile/Profile';
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import CalendarComponent from '../../components/calendar/Calendar'
import { HolidaysContext } from '../../context/HolidaysContext'

const Home = () => {
  const [loader, setLoader] = useState(true)
  const { currentUser, userData } = useContext(AuthContext)
  const { datesLoader, getAttendanceData, attendance } = useContext(CalendarContext)
  const { holidaysDataLoading, fetchHolidays } = useContext(HolidaysContext)


  useEffect(() => {

    fetchHolidays()
    getAttendanceData(currentUser.uid)

    if (!holidaysDataLoading && !datesLoader) {
      console.log("data is  loaded")
      setLoader(false)
    }
  }, []);

  return (
    <section className='min-h-[100vh]'>

      <div className="shadow-md w-[90%] mx-auto py-5 my-2">
        <Profile userData={userData} />
      </div>
      <div className="shadow-md w-[90%] mx-auto my-5">
        {
          !loader && (
            <CalendarComponent />
          )
        }

      </div>
    </section>
  )
}

export default Home