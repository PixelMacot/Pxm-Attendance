import React, { useState, useContext, useEffect } from 'react'
import { LocationContext } from '../context/LocationContext'
import { AuthContext } from '../context/AuthContext'
import { CalendarContext } from '../context/CalendarContext'
import moment from 'moment';
import CalendarApp from '../components/CalendarApp';

const SingleAttendance = () => {

    const [currentDate, setCurrentDate] = useState(moment(new Date()).format("DD-MM-YYYY"))
    const [showattendancebtn, setShowAttendancebtn] = useState({})
    const [btnerr, setBtnErr] = useState("")

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



    const { isUserInsideGeofence, error, lat, lon, reverifyLocation } = useContext(LocationContext)
    useEffect(() => {

        if (markdate) {
            checkCurrentDayPresent()
        }


    }, [markdate])

    useEffect(() => {
        attendanceBtn()
        return () => {

        }
    }, [lat, lon])


    const checkCurrentDayPresent = () => {
        let today = markdate.filter((date) => {
            console.log(date, currentDate)
            return date == currentDate
        })
        console.log(today.length)
        if (today.length > 0) {
            setShowAttendancebtn(false)
        } else {
            setShowAttendancebtn(true)
        }
    }

    const attendanceBtn = () => {
        console.log("btn err called")
        console.log(isUserInsideGeofence)
        if (userData.dummyData) {
            setBtnErr("Please update your profile by going to dashboard")
        } else {
            if (!isUserInsideGeofence) {

                setBtnErr("please head inside office and refresh page")
                console.log("head inside office")
            }
        }
        console.log(btnerr)
    }

    return (
        <div>
            <div className="min-h-[70vh]">
                <div className="">
                    <div className="mark w-full my-5">
                        <form className='flex gap-2'>
                            {
                                btnerr ? (
                                    <p>{btnerr}</p>
                                ) : (

                                    <div className="">
                                        <button
                                            onClick={(e) => markAttendance(e, userData)}
                                            className='w-fit text-center  text-sm md:text-lg shadow-md p-2 bg-cyan-800 rounded-md text-white'
                                            style={{ display: showattendancebtn ? 'flex' : 'none' }}
                                        >Entry</button>
                                        <button
                                            onClick={(e) => markAttendance(e, userData)}
                                            className='w-fit text-center  text-sm md:text-lg shadow-md p-2 bg-cyan-800 rounded-md text-white'
                                            style={{ display: showattendancebtn ? 'flex' : 'none' }}
                                        >Exit</button>
                                    </div>)
                            }
                            {/* <button
                                onClick={markAttendance}
                                className='w-fit text-center font-bold text-xl shadow-md px-5 py-2 border-2 border-cyan-400 rounded-md text-black'
                            >Apply for Leave</button> */}
                        </form>
                    </div>
                </div>
                <div className="user-attendance border w-[90%] mx-auto my-8 p-5 shadow-md flex items-center justify-center">
                    {
                        markdate && (

                            <CalendarApp arr={markdate} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SingleAttendance