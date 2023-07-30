import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from '../firebase';
import { auth } from '../firebase';
import Profile from '../components/profile/Profile';
import CalendarApp from '../components/calenda/CalendarApp';
import { useNavigate } from 'react-router-dom';
const Attendance = () => {
  // console.log("Attendance",userData)
  const { id } = useParams();
  
  //send user to login page when user not logged in
  const [attendance, setAttendance] = useState("dummy")
  const [markdate, setMarkDate] = useState()
  const [userData, setUserData] = useState({})
  const [viewattendance, setViewAttendance] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user successfully signed in")
        //  getUserData()
        getUserProfileData(id)
        getAttendanceData(id)
      } else {
        console.log("user is logged out")
        navigate('/login')
      }
    });
  }, [])
  //function to post profile data into cloud firestore
  const getUserProfileData = async (id) => {
    // console.log("getattendance data function called", user.uid)
    getDoc(doc(db, "users", id)).then(docSnap => {

      if (docSnap.exists()) {
        console.log("Document data:", JSON.stringify(docSnap.data()));
        setUserData(docSnap.data())

      } else {
        console.log("Please update profile");
      }
    })

  }

  //attendance data
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
    console.log("markdatefunction() called")
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

const reloadCalendar = ()=>{
  getAttendanceData(id)
  markdatefunction()
}
  return (
    <div className="min-h-[100vh]">
      <div className="">
        {
          userData && (
            <Profile userData={userData} show={false} />
          )
        }
        <div className="user-attendance border w-[90%] mx-auto my-8 p-5 shadow-md flex items-center justify-center">
          {
            markdate ? (
              <CalendarApp arr={markdate} />
            ) :(
              <button 
              onClick={reloadCalendar}
              style={{display:id=="notfound"?'none':'flex'}}
              className="reload-btn bg-cyan-700 px-5 py-2 rounded-md text-white"
              >
                Reload Calendar
              </button>
            )
          }
          {
            id=="notfound" && (
              <div className="shodow-md rounded-md flex flex-col items-center">
                <img src="/warning.png" className='w-[20%]'/>
                <div className="text-red-500 py-5 text-center">Sorry we can't find user please update profile</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Attendance