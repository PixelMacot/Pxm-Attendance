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
    const { getAttendanceData, datesLoader, markdate, attendance } = useContext(CalendarContext)
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
        <div className="AttendanceDashboard pb-5">
            <div className="maincontainer min-h-[70vh]">
                <div className="attendancedashboard-wrapper flex flex-col gap-5">
                    <div className="w-[90%] mx-auto rounded-md shadow-md ">
                        <div className="profile-wrapper py-5">
                            <Profile userData={userData} />
                        </div>
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
                            <div className="w-fit mx-auto">
                                <button
                                    onClick={reload}
                                    className="bg-cyan-700 text-white px-5 py-2 shadow-md rounded-md w-fit mx-auto"
                                >Reload Calendar</button>
                            </div>
                        ) : (
                            <div className="calendarandpresentdays flex flex-wrap justify-center gap-5 border rounde-md md:p-2  w-fit lg:w-[90%] mx-auto rounded-md shadow-md">
                                <div className="calendarapp w-[90vw] md:w-[55vw] mx-auto p-2 border border-gray-200 ">
                                    <ErrorBoundary fallback={<div>Something went wrong</div>}>
                                        <CalendarComponent />
                                    </ErrorBoundary>
                                </div>
                                <div className="presentdayswrapper px-2 w-fit max-w-[95vw]">
                                    <PresentDates arr={markdate} />
                                </div>
                            </div>
                        )
                    }
                    <div className="attendancedashboard-map shadow-md rounded-md w-[90%] mx-auto">

                        {/* <ErrorBoundary fallback={<div>Something went wrong</div>}> */}
                            {/* <MapStructure /> */}
                        {/* </ErrorBoundary> */}
                    </div>

                    {/* <div>
                        <h1>Geofence Map</h1>
                        <GeofenceMap fenceCoordinates={fenceCoordinates} />
                    </div> */}

                </div>
            </div>
        </div>
    )
}

export default AttendanceDashboard