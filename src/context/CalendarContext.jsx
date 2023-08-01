import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import moment from 'moment';
export const CalendarContext = createContext();

export const CalendarContextProvider = ({ children }) => {
  const [currentMonth, setCurrentMonth] = useState(moment(new Date()).format("DD-MM-YYYY"))
  const [attendance, setAttendance] = useState(false)
  const [markdate, setMarkDate] = useState()
  const [datesLoader,setDatesLoader] = useState(true)
  const [currentMonthPresentDays, setCurrentMonthPresentDays] = useState()
  
  // getting Attendance data from cloud firestore 
  const getAttendanceData = async (useruid) => {
    // console.log("getattendance data function called", user.uid)
    getDoc(doc(db, "attendance", useruid)).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setAttendance(docSnap.data())
        convertDataToJSON(docSnap.data())
        setDatesLoader(false)
      } else {
        console.log("No such document!");
        setDatesLoader(false)
      }
    })
  }
  let presentDatesArray=[]
  const convertDataToJSON = (attendance) => {

    Object.keys(attendance).forEach(function (key, index) {
      console.log(attendance[key])
      presentDatesArray.push(attendance[key].markdate)
    });
    setMarkDate(presentDatesArray)
    setDatesLoader(false)
  };

  return (
    <CalendarContext.Provider value={
      {
        currentMonth,
        setCurrentMonth,
        getAttendanceData,
        attendance,
        datesLoader,
        markdate
      }}>
      {children}
    </CalendarContext.Provider>
  );
};