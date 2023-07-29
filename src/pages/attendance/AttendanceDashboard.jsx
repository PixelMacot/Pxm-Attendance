import React, { useState, useEffect, useContext } from 'react';
import MarkAttendance from '../../components/markattendancebtn/MarkAttendance'
import MapStructure from '../../components/map/MapStructure'
import CalendarComponent from '../../components/calendar/Calendar'
import { ErrorBoundary } from "react-error-boundary";
import { AuthContext } from '../../context/AuthContext'
import { CalendarContext } from '../../context/CalendarContext'
import Profile from '../../components/Profile'
import PresentDates from '../../components/PresentDates'

const AttendanceDashboard = () => {
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
        <div className="AttendanceDashboard pb-5">
            <div className="maincontainer min-h-[70vh]">
                <div className="attendancedashboard-wrapper flex flex-col gap-5">
                    <div className="w-[90%] mx-auto rounded-md shadow-md ">
                        <div className="profile-wrapper ">
                            <Profile userData={userData} />
                        </div>
                        <div className="markattendance-btn px-5 pb-5">
                            <MarkAttendance />
                        </div>
                    </div>
                    {
                        markdate && (
                            <div className="calendarandpresentdays flex flex-wrap gap-5 px-2 ">

                                <div className="calendarapp w mx-auto rounded-md shadow-md ">

                                    <ErrorBoundary fallback={<div>Something went wrong</div>}>
                                        <CalendarComponent />
                                    </ErrorBoundary>

                                </div>
                                <div className="presentdayswrapper px-2 mx-auto w-fit">
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