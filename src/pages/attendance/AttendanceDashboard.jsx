import React, { useState, useEffect, useContext } from 'react';
import MarkAttendance from '../../components/markattendancebtn/MarkAttendance'
import CalendarComponent from '../../components/calendar/Calendar'
import { ErrorBoundary } from "react-error-boundary";
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import PresentDates from '../../components/presentdates/PresentDates'
import { HolidaysContext } from '../../context/HolidaysContext'
import './atndashboard.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceDashboard = () => {
    const [loader, setLoader] = useState(true)
    const { currentUser, userData } = useContext(AuthContext)
    const { currentMonth, attendance, getAttendanceData, datesLoader, markdate, } = useContext(CalendarContext)
    const { holidaysDataLoading, fetchHolidays } = useContext(HolidaysContext)

    useEffect(() => {
        fetchHolidays()
        getAttendanceData(currentUser.uid)
        if (!holidaysDataLoading && !datesLoader) {
            console.log("data is  loaded")
            toast.success("Data successfully loaded",{autoClose:600})
            setLoader(false)
        }
    }, []);

    const reload = () => {
        fetchHolidays()
        getAttendanceData(currentUser.uid)
        if (!holidaysDataLoading && !datesLoader) {
            console.log("data is  loaded")
            toast.success("Data successfully loaded",{autoClose:600})
            setLoader(false)
        }
    }

    return (
        <div className="AttendanceDashboard">
            <ToastContainer />
            <div className="attendance-dashboard-wrapper ">

                <div className="attendance-btns-wrapper">
                    <img src="/office.png" alt="" className='officeimg' />
                    {
                        userData.dummyData ? (
                            <div className=""></div>
                        ) : (
                            <div className="markattendance-btn px-5 pb-5">
                                <MarkAttendance />
                            </div>
                        )
                    }
                </div>
                {
                    loader ? (
                        <div className="">
                            <button
                                onClick={reload}
                                className="primary-button"
                            >Reload Calendar</button>
                        </div>
                    ) : (
                        <div className="calendar-and-presentdays">
                            <div className="calendarapp">
                                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                                    <CalendarComponent attendance={attendance} markdate={markdate} />
                                </ErrorBoundary>
                            </div>
                            <div className="present-days-wrapper">
                                <PresentDates currentMonth={currentMonth} attendance={attendance} />
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default AttendanceDashboard