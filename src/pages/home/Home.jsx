import React, { useState, useEffect, useContext } from 'react';
import Profile from '../../components/profile/Profile';
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import CalendarComponent from '../../components/calendar/Calendar'
import { HolidaysContext } from '../../context/HolidaysContext'
import Quotes from '../../components/quotes/Quotes';
import ShowAnnouncement from '../../components/showannouncement/ShowAnnouncement';
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
        <div className="shadow-md w-[95%] mx-auto py-5 my-2">
          <Profile userData={userData} quote={true} />
          {/* <Quotes /> */}
          {/* <ShowAnnouncement /> */}
        </div>
        <div className="shadow-md w-[95%] mx-auto my-5">

          < div className=" calendar-announcement-container flex  flex-wrap  gap-5 justify-between items-center">
            <div className="w-[100%] lg:w-[40%]">
              <ShowAnnouncement/>
            </div>
            {/* {
              loader && (
                <div className="w-fit mx-auto">
                  <button
                    onClick={reload}
                    className="bg-cyan-700 text-white px-5 py-2 shadow-md rounded-md w-fit mx-auto"
                  >Reload Calendar</button>
                </div>)
            }
            <div className="home-calendar lg:w-[50%]">
              {!loader && (<CalendarComponent />)}
            </div> */}
          </div>
        </div>
        <div>
        </div>
      </div>
    </section >
  )
}

export default Home