import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import moment from 'moment';
export const CalendarContext = createContext();

export const CalendarContextProvider = ({ children }) => {

  const [attendance, setAttendance] = useState("dummy")
  const [markdate, setMarkDate] = useState()


  useEffect(() => {
    markdatefunction()
    return () => {

    };
  }, [attendance]);

  //check Timing of Attendance
  const validTime = () => {
    let startTime = '01:00:10';
    let endTime = '24:00:00';

    let currentDate = new Date()

    let startDate = new Date(currentDate.getTime());
    startDate.setHours(startTime.split(":")[0]);
    startDate.setMinutes(startTime.split(":")[1]);
    startDate.setSeconds(startTime.split(":")[2]);

    let endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    endDate.setSeconds(endTime.split(":")[2]);

    let valid = startDate < currentDate && endDate > currentDate
    return valid
  }

  // getting Attendance data from cloud firestore 
  const getAttendanceData = async (useruid) => {
    // console.log("getattendance data function called", user.uid)
    getDoc(doc(db, "attendance", useruid)).then(docSnap => {

      if (docSnap.exists()) {
        // console.log("Document data:", JSON.stringify(docSnap.data()));
        setAttendance(JSON.stringify(docSnap.data()))
        markdatefunction()
      } else {
        console.log("No such document!");
      }
    })
  }

  //array of present days of user
  let dateMarkArr = []
  //function to push the present days into mark state
  const markdatefunction = () => {
    // console.log("markdatefunction() called")
    if (attendance.length > 6) {
      let jsonp = JSON.parse(attendance)
      Object.keys(jsonp).map((item) => {
        // console.log(jsonp[item]) ->it will print single object 
        dateMarkArr.push(item)
      })
      // console.log(dateMarkArr)
      setMarkDate(dateMarkArr)
    }
    //push into array dates
    const markdates = () => {
      console.log(markdates.length)
    }
  }

  //function to post attendance data into cloud firestore
  const markAttendance = async (e, userData) => {
    e.preventDefault()
    if (validTime()) {
      let newDate = new Date()
      let arrivalDate = moment(newDate).format("DD-MM-YYYY")
      // let arrivalDate = "14-06-2023"
      console.log(arrivalDate)
      try {
        const docData = {
          [arrivalDate]: {
            name: userData.username,
            markdate: arrivalDate,
            arrivalDate: Timestamp.fromDate(new Date()),
          }
        };
        // console.log("datatobeinserted", docData)
        const docRef = doc(db, "attendance", userData.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());

          await updateDoc(doc(db, "attendance", userData.uid), docData);
          // console.log("Document written with ID: ", userData.uid);
          getAttendanceData(userData.uid)
        } else {
          await setDoc(doc(db, "attendance", userData.uid), docData);
          // console.log("Document written with ID: ", userData.uid);
          getAttendanceData(userData.uid)
        }

      } catch (err) {
        console.error("Error adding document: ", err);
      }
    } else {
      alert("time for attendance is ended")
      console.log("invalid time")
    }
  }


  return (
    <CalendarContext.Provider value={{ getAttendanceData, markAttendance, markdate, attendance, markdatefunction }}>
      {children}
    </CalendarContext.Provider>
  );
};