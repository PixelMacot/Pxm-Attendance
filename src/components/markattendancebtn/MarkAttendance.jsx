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
    const [err, setErr] = useState()
    const [msg, setMsg] = useState()
    const [currentDate, setCurrentDate] = useState(moment(new Date()).format("DD-MM-YYYY"))
    const [showattendancebtn, setShowAttendancebtn] = useState(false)
    const [btnerr, setBtnErr] = useState()
    const [showexit, setShowExit] = useState(true)
    const [disablebtn, setDisableBtn] = useState({
        entry: true,
        exit: true
    })
    const { currentUser, userData } = useContext(AuthContext)
    const { getAttendanceData, markdate, attendance, markdatefunction, datesLoader } = useContext(CalendarContext)
    const { isUserInsideGeofence, error, latitude, longitude, reverifyLocation, distance } = useContext(LocationContext)
    console.log(latitude, longitude)

    console.log("markrenderr")

    useEffect(() => {
        btnshow()
    }, [attendance, isUserInsideGeofence])

    const btnshow = () => {
        console.log("location", isUserInsideGeofence)
        if (!isUserInsideGeofence) {
            setBtnErr("You are not at office please visit office to mark attendance")
        } else {

            let entry = attendance.hasOwnProperty(moment(new Date).format("DD-MM-YYYY"))
            if (attendance) {
                console.log("attendace data is loaded", entry)
                if (entry) {
                    let exitdata = attendance[moment(new Date).format("DD-MM-YYYY")].hasOwnProperty("exit")
                    if (exitdata) {
                        console.log("data exits")
                        setDisableBtn({
                            entry: true,
                            exit: true
                        })
                        setMsg("your office day is completed")
                    } else {
                        setDisableBtn({
                            entry: true,
                            exit: false
                        })
                    }
                } else {
                    console.log("data do not exit")
                    if (attendance == 'newuser') {
                        setDisableBtn({
                            entry: false,
                            exit: true
                        })
                        return
                    }
                    setDisableBtn({
                        entry: false,
                        exit: true
                    })
                }
            }
            // if (markdate) {
            //     checkCurrentDayPresent()
            // }
        }
    }

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
                console.log(docExitData)

                updateDoc(doc(db, "attendance", userData.uid), docExitData).then(() => {
                    console.log('Data successfully updated in Firestore!');
                    getAttendanceData(userData.uid)
                    btnshow()
                    if (type == "entry") {

                        setMsg("Welcome to office")
                        setDisableBtn({
                            entry: true,
                            exit: false
                        })
                    } else {
                        setMsg("your exit is successfully updated")
                        console.log("disable exit")
                        setDisableBtn({
                            entry: true,
                            exit: true
                        })
                        console.log("disable btn", disablebtn)
                    }
                }).catch((error) => {
                    console.error('Error updating data in Firestore:', error);
                });
            } else {
                await setDoc(doc(db, "attendance", userData.uid), docExitData).then(() => {
                    console.log('Data successfully updated in Firestore!');
                    getAttendanceData(userData.uid)
                    if (type == "entry") {

                        setMsg("Welcome to office")
                        setDisableBtn({
                            entry: true,
                            exit: false
                        })
                    } else {
                        setMsg("your exit is successfully updated")
                        console.log("disable exit")
                        setDisableBtn({
                            entry: true,
                            exit: true
                        })
                        console.log("disable btn", disablebtn)
                    }
                }).catch((error) => {
                    console.error('Error setting data in Firestore:', error);
                });

            }
        } catch (err) {
            console.error("Error adding document: ", err);
            setErr("Some error occured try again")
        }

    }
    return (
        <div className="markattendance">
            <div className="maincontainer">
                <div className="markattendance-wrapper">
                   
                    <div className="markattendance-buttons flex flex-col">
                        {
                            !showattendancebtn && distance == 9999 && !error && (
                                <div className="flex items-center gap-2">
                                    <img src="/locationredimg.png" alt="" className='w-[20px]' />
                                    <p className='text-red-700 font-bold'>Not able to determine your location</p>
                                </div>
                            )
                        }
                        {
                            error && (
                                <div className="flex flex-col gap-2">
                                    <div className=" flex gap-2 flex-wrap">
                                        <img src="/locationredimg.png" alt="" className='w-[20px]' />
                                        <p className='text-red-700 font-bold'>Error:{error}</p>

                                    </div>
                                    <div className="flex gap-2 my-1">
                                        <img src="/clickicon.png" alt="" className='w-[30px]' />
                                        <p>check if your location is on</p>
                                    </div>
                                </div>
                            )
                        }
                        {
                            !isUserInsideGeofence && (
                                <div className="text-cyan-900 font-semibold">
                                    {distance == 9999 || error ? (
                                        ''
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2 items-center my-2">
                                                <img src="/twocoordinates.png" alt="" className='w-[40px]' />
                                                <p>You are at <span className='font-bold'>{distance}</span> meters from office</p>
                                            </div>
                                            <div className="flex gap-2 my-2">
                                                <img src="/walkicon.png" alt="" className='w-[40px]' />
                                                <p>Head to office to mark attendance</p>
                                            </div>
                                        </div>
                                    )
                                    }


                                    <div className="">
                                        <div className="my-5">
                                            <button
                                                onClick={reverifyLocation}
                                                className='bg-cyan-700 px-5 py-2 text-white  rounded-md shadow-md'
                                            >Reverify</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            err && (
                                <p className="text-red-500">{err}</p>
                            )
                        }
                        {
                            msg && (
                                <p className="text-green-700 font-bold">{msg}</p>
                            )
                        }
                        <div className="flex flex-row gap-4">
                            {
                                !disablebtn.entry && (
                                    <button
                                        onClick={(e) => markAttendance(e, "entry")}
                                        className='markattendance-btn'
                                    >Entry</button>
                                )
                            }
                            {
                                !disablebtn.exit && (
                                    <button
                                        onClick={(e) => markAttendance(e, "exit")}
                                        className='markattendance-btn'
                                    >Exit</button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MarkAttendance