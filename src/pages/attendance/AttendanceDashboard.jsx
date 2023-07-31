import React, { useState, useEffect, useContext } from 'react';
import MarkAttendance from '../../components/markattendancebtn/MarkAttendance'
import MapStructure from '../../components/map/MapStructure'
import CalendarComponent from '../../components/calendar/Calendar'
import { ErrorBoundary } from "react-error-boundary";
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import Profile from '../../components/profile/Profile'
import PresentDates from '../../components/presentdates/PresentDates'
import { HolidaysContext } from '../../context/HolidaysContext'

const AttendanceDashboard = () => {
    const [loader, setLoader] = useState(true)
    const { currentUser, userData } = useContext(AuthContext)
    const { getAttendanceData, datesLoader, markdate, attendance } = useContext(CalendarContext)
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
                            <div>Loading...</div>
                        ) : (
                            <div className="calendarandpresentdays flex flex-wrap justify-center gap-5 border rounde-md md:p-2  w-fit lg:w-[90%] mx-auto rounded-md shadow-md">
                                <div className="calendarapp w-fit p-2 border border-gray-200 ">
                                    <ErrorBoundary fallback={<div>Something went wrong</div>}>
                                        <CalendarComponent />
                                    </ErrorBoundary>
                                </div>
                                <div className="presentdayswrapper px-2  w-fit">
                                    <PresentDates arr={markdate} />
                                </div>
                            </div>
                        )
                    }
                    <div className="attendancedashboard-map shadow-md rounded-md w-[90%] mx-auto">
                        <MapStructure />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AttendanceDashboard