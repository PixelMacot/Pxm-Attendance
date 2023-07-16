import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import CalendarApp from '../components/CalendarApp';
import moment from 'moment';
import Profile from '../components/Profile';

const Home = () => {
  const [logged, SetLogged] = useState(false)
  const [userData, setUserData] = useState({
    "username":"user",
    "position":"Web Developer",
    "skills":"Html Css ,Javascript,Webflow",
    "profileimg":"/boyavatar.png",
    "backgroundimg":"/profilebg.jpg",
    "dummyData":true
  })
  let [useruid,setUserUid]=useState()
  // const [status, setStatus] = useState('present')
  const [attendance, setAttendance] = useState("dummy")
  const [markdate, setMarkDate] = useState()
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        SetLogged(true)
        setUserUid(user.uid)
        getUserProfileData(user)
        getAttendanceData(user.uid)

      } else {
        navigate("/login")
      }
    });

  }, [])

  //update array of present days of user

  useEffect(() => {
    markdatefunction()
  }, [attendance])



  //function to post profile data into cloud firestore
  const getUserProfileData = async (user) => {
    // console.log("getattendance data function called", user.uid)
    getDoc(doc(db, "users", user.uid)).then(docSnap => {

        if (docSnap.exists()) {
            console.log("Document data:", JSON.stringify(docSnap.data()));
            setUserData(docSnap.data())

        } else {
            console.log("Please update profile");
        }
    })

}



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
  const markAttendance = async (e) => {
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
        const docRef = doc(db, "attendance", useruid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());

          await updateDoc(doc(db, "attendance", useruid), docData);
          // console.log("Document written with ID: ", userData.uid);
          getAttendanceData(useruid)
        } else {
          await setDoc(doc(db, "attendance", useruid), docData);
          // console.log("Document written with ID: ", userData.uid);
          getAttendanceData(useruid)
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
    <section className='min-h-[100vh]'>
      {
        logged && (
          <div className="">
            <Profile userData={userData} markAttendance={markAttendance} />
            {/* //attendance mark */}
          
            {/* //user-attendance-info */}
            <div className="user-attendance border w-[90%] mx-auto my-8 p-5 shadow-md flex items-center justify-center">
              {
                markdate && (
                  <CalendarApp arr={markdate} />
                )
              }
            </div>
          </div>

        )
      }
    </section>
  )
}

export default Home