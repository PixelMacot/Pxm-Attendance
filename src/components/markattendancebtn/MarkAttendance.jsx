import React, { useContext, useEffect, useState } from 'react'
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext'
import moment from 'moment';
import { CalendarContext } from '../../context/CalendarContext'
import MapStructure from '../map/MapStructure'
import { LocationContext } from '../../context/LocationContext'
import './markattendance.scss'


const MarkAttendance = () => {
    const [currentDate, setCurrentDate] = useState(moment(new Date()).format("DD-MM-YYYY"))
    const [showattendancebtn, setShowAttendancebtn] = useState(true)
    const [btnerr, setBtnErr] = useState()
    const [showexit, setShowExit] = useState(true)
    const { currentUser, userData } = useContext(AuthContext)
    const { getAttendanceData, markdate, attendance, markdatefunction } = useContext(CalendarContext)
    const { isUserInsideGeofence, error, lat, lon, reverifyLocation } = useContext(LocationContext)
    console.log(lat, lon)


    console.log("markrenderr")
    useEffect(() => {
        // setShowAttendancebtn(show)  
        return () => {
            if (!isUserInsideGeofence) {
                setBtnErr("You are not at office please visit office to mark attendance")
                setShowAttendancebtn(false)
                setShowExit(false)
            } else {
                if (markdate) {
                    checkCurrentDayPresent()
                }
            }
        };
    }, [markdate])

    const checkCurrentDayPresent = () => {
        console.log(attendance)
        let ata = attendance
        console.log("filter called")
        let today = markdate.filter((date) => {
            console.log(date, currentDate)
            return date == currentDate
        })
        console.log(today)
        if (today.length > 0) {
            setShowAttendancebtn(false)
            // console.log(ata[today].exit)
            if (ata[today[0]].exit) {
                setShowExit(false)
            } else {
                if (btnerr) {
                    setShowExit(false)
                } else {
                    setShowExit(true)
                }
            }
        } else {
            if (btnerr) {
                setShowExit(false)
                setShowAttendancebtn(false)
            } else {
                setShowAttendancebtn(true)
            }

        }
    }
 
    //function to post attendance data into cloud firestore
    const markAttendance = async (e, type) => {
        e.preventDefault()
        console.log(userData)
        let newDate = new Date()
        let arrivalDate = moment(newDate).format("DD-MM-YYYY")
        // let arrivalDate = "14-06-2023"
        console.log(arrivalDate)
        try {
            let docExitData = {
                [arrivalDate]: {
                    name: userData.username,
                    markdate: arrivalDate,
                    arrivalDate: Timestamp.fromDate(new Date()),
                    entry: moment(newDate).format("HH-mm-ss"),
                }
            };
            // console.log("datatobeinserted", docData)
            const docRef = doc(db, "attendance", userData.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                let exits = docSnap.data().hasOwnProperty(moment(newDate).format("DD-MM-YYYY"))
                console.log(exits)
                if (exits) {
                    let entry = docSnap.data()[moment(newDate).format("DD-MM-YYYY")].entry
                    docExitData = {
                        [arrivalDate]: {
                            name: userData.username,
                            markdate: arrivalDate,
                            arrivalDate: Timestamp.fromDate(new Date()),
                            entry: entry,
                            exit: moment(newDate).format("HH-mm-ss"),
                        }
                    }
                    setShowAttendancebtn(false)
                } else {
                    docExitData = {
                        [arrivalDate]: {
                            name: userData.username,
                            markdate: arrivalDate,
                            arrivalDate: Timestamp.fromDate(new Date()),
                            entry: moment(newDate).format("HH-mm-ss"),
                        }
                    }
                }
                await updateDoc(doc(db, "attendance", userData.uid), docExitData);
                // console.log("Document written with ID: ", userData.uid);
                setShowExit(false)
                getAttendanceData(userData.uid)
            } else {
                await setDoc(doc(db, "attendance", userData.uid), docExitData);
                // console.log("Document written with ID: ", userData.uid);
                getAttendanceData(userData.uid)
            }

        } catch (err) {
            console.error("Error adding document: ", err);
        }

    }

    return (
        <div className="markattendance">
            <div className="maincontainer">
                <div className="markattendance-wrapper">

                    <div className="markattendance-buttons">
                        {
                            btnerr && (
                                <p>{btnerr}</p>
                            )
                        }
                        {
                            showattendancebtn && (
                                <button
                                    onClick={(e) => markAttendance(e, "entry")}
                                    className='markattendance-btn'
                                >Entry</button>
                            )
                        }
                        {
                            showexit && (
                                <button
                                    onClick={(e) => markAttendance(e, "entry")}
                                    className='markattendance-btn'
                                >Exit</button>
                            )
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MarkAttendance