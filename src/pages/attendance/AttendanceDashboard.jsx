import React, { useState, useEffect, useContext } from 'react';
import MarkAttendance from '../../components/markattendancebtn/MarkAttendance'
// import MapStructure from '../../components/map/MapStructure'
import CalendarComponent from '../../components/calendar/Calendar'
import { ErrorBoundary } from "react-error-boundary";
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import Profile from '../../components/profile/Profile'
import PresentDates from '../../components/presentdates/PresentDates'
import { HolidaysContext } from '../../context/HolidaysContext'
import { LocationContext } from '../../context/LocationContext'
import moment from 'moment';
import GeofenceMap from "../../components/map/SecondMap";

const AttendanceDashboard = () => {
    const [loader, setLoader] = useState(true)
    const { currentUser, userData } = useContext(AuthContext)
    // const { currentMonth, currentMonthPresentDays, attendance, markdatefunction } = useContext(CalendarContext)
    const { currentMonth, attendance, getAttendanceData, datesLoader, markdate, } = useContext(CalendarContext)
    const { holidaysDataLoading, fetchHolidays } = useContext(HolidaysContext)
    const { isUserInsideGeofence, error, lat, lon, reverifyLocation } = useContext(LocationContext)

    useEffect(() => {

        fetchHolidays()
        getAttendanceData(currentUser.uid)
        if (!holidaysDataLoading && !datesLoader) {
            console.log("data is  loaded")
            setLoader(false)
        }
    }, []);

    useEffect(() => {
        if (isUserInsideGeofence) {
            console.log("from attendance dashboard location", isUserInsideGeofence)
        } else {
            console.log("from attendance dashboard location", isUserInsideGeofence)
        }
    }, [isUserInsideGeofence])

    const reload = () => {
        fetchHolidays()
        getAttendanceData(currentUser.uid)
        if (!holidaysDataLoading && !datesLoader) {
            console.log("data is  loaded")
            setLoader(false)
        }
    }
    const fenceCoordinates = [
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
    ];

    return (
        <div className="AttendanceDashboard">

            <div className="attendancedashboard-wrapper ">
                <div className="">
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
                        <div className="calendarandpresentdays">
                            <div className="calendarapp">
                                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                                    <CalendarComponent attendance={attendance} markdate={markdate} />
                                </ErrorBoundary>
                            </div>
                            <div className="presentdayswrapper px-2 w-fit max-w-[95vw]">
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