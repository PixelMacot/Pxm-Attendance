import React, { useContext, useEffect, useState } from 'react'
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext'
import moment from 'moment';
import { CalendarContext } from '../context/CalendarContext'

const Test = () => {
  const [currentDate, setCurrentDate] = useState(moment(new Date()).format("DD-MM-YYYY"))
  const [showattendancebtn, setShowAttendancebtn] = useState(true)
  const [showexit, setShowExit] = useState(true)
  const { currentUser, userData } = useContext(AuthContext)
  const { getAttendanceData, markdate, attendance, markdatefunction } = useContext(CalendarContext)
  useEffect(() => {
    // setShowAttendancebtn(show)  
    return () => {
      if (markdate) {
        checkCurrentDayPresent()
      }
    };
  }, [markdate])

  useEffect(() => {
    markdatefunction()
    return () => {

    };
  }, [attendance]);

  const checkCurrentDayPresent = () => {
    console.log(attendance)
    let ata = JSON.parse(attendance)
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
      }
    } else {
      setShowAttendancebtn(true)
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
        }else{
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
    <div className="min-h-[70vh]">
      {
        showattendancebtn && (
          <button
            onClick={(e) => markAttendance(e, "entry")}
            className='w-fit text-center  text-sm md:text-lg shadow-md p-2 bg-cyan-800 rounded-md text-white'
          >Entry</button>
        )
      }
      {
        showexit && (
          <button
            onClick={(e) => markAttendance(e, "entry")}
            className='w-fit text-center  text-sm md:text-lg shadow-md p-2 bg-cyan-800 rounded-md text-white'
          >Exit</button>
        )
      }

    </div>
  )
}

export default Test