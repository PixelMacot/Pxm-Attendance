import React, { useState, useEffect, useContext } from 'react';
import Profile from '../../components/profile/Profile';
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import CalendarComponent from '../../components/calendar/Calendar'
import { HolidaysContext } from '../../context/HolidaysContext'
import Quotes from '../../components/quotes/Quotes';
// import FilterHolidays from '../../components/filterholiday/filterholiday';

const Home = () => {
  const [loader, setLoader] = useState(true)
  const { currentUser, userData } = useContext(AuthContext)
  const { datesLoader, getAttendanceData, attendance } = useContext(CalendarContext)
  const { holidaysDataLoading, fetchHolidays, holidaysData, filteredHolidays } = useContext(HolidaysContext)


  const reload = () => {
    fetchHolidays()
    getAttendanceData(currentUser.uid)
    if (!holidaysDataLoading && !datesLoader) {
      console.log("data is  loaded")
      setLoader(false)
    }
  }

  useEffect(() => {
    reload()
    if (!holidaysDataLoading && !datesLoader) {
      console.log("data is  loaded")
      setLoader(false)
    }
  }, []);
  console.log('filter holidays', filteredHolidays)
  return (
    <section className='home-wrapper'>
      <div className="home-container">
        <div className="shadow-md w-[90%] mx-auto py-5 my-2">
          <Profile userData={userData} />
          <Quotes />
        </div>
        <div className="shadow-md w-[90%] mx-auto my-5">
          {
            loader && (
              <div className="w-fit mx-auto">
                <button
                  onClick={reload}
                  className="bg-cyan-700 text-white px-5 py-2 shadow-md rounded-md w-fit mx-auto"
                >Reload Calendar</button>
              </div>)
          }
          < div className=" calendar-quotes-container flex flex-wrap gap-28 justify-center items-center">
            <div className="home-calendar lg:w-[50%]">
              {!loader && (<CalendarComponent />)}
            </div>
            <div className="w-[400px]">
            
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
    </section >
  )
}

export default Home