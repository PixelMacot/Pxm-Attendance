import React, { useState, useEffect, useContext } from 'react';
import Profile from '../../components/profile/Profile';
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import CalendarComponent from '../../components/calendar/Calendar'
import { HolidaysContext } from '../../context/HolidaysContext'
import Quotes from '../../components/quotes/Quotes';
import ShowAnnouncement from '../../components/showannouncement/ShowAnnouncement';
// import FilterHolidays from '../../components/filterholiday/filterholiday';
import moment from 'moment'
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import './home.scss'
import { ErrorBoundary } from "react-error-boundary";
const Home = () => {
  const [loader, setLoader] = useState(true)
  const { currentUser, userData } = useContext(AuthContext)
  const { datesLoader, getAttendanceData } = useContext(CalendarContext)
  const { holidaysDataLoading, fetchHolidays, filteredHolidays } = useContext(HolidaysContext)


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
    if (userData.dob) {
      let cmonth = moment(new Date()).format('MM')
      console.log("userData.dob exits in month", cmonth, userData.dob.slice(5, 7))
      if (cmonth == userData.dob.slice(6, 7)) {
        birthdayAnnouncement()
      }
    }
  }, []);

  const birthdayAnnouncement = async (e) => {
    let dob = moment(userData.dob).format('DD-MM-YYYY')
    let year = moment().year()
    console.log('dob', dob)
    let slug = `Birthday for ${userData.username}`
    console.log(slug)
    await setDoc(doc(db, "announcement", slug), {
      msg: slug,
      date: `${dob.slice(0, 6)}${year}`,
      link: 'notprovided',
      slug: slug
    })
  };

  console.log('filter holidays', filteredHolidays)
  return (
    <section className='home-wrapper'>
      <div className="home-container">
        <div className="profile">
          <ErrorBoundary fallback={<div className='my-40 px-20 font-bold'>Something went wrong while showing profile page</div>}>
            <Profile userData={userData} quote={true} />
          </ErrorBoundary>

          {/* <Quotes /> */}
          {/* <ShowAnnouncement /> */}
        </div>
        < div className="announcement-container ">
          <ErrorBoundary fallback={<div className='my-40 px-20 font-bold'>Something went wrong while showing announcement page</div>}>
            <ShowAnnouncement />
          </ErrorBoundary>
        </div>
        <div>
        </div>
      </div>
    </section >
  )
}

export default Home