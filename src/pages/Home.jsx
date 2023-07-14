import React, { useState, useEffect } from 'react';
import { Link, json, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import CalendarApp from '../components/CalendarApp';
import { query, where, getDocs } from "firebase/firestore";

const Home = () => {
  const [logged, SetLogged] = useState(false)
  const [userData, setUserData] = useState({})
  const [status, setStatus] = useState('present')
  const [attendance, setAttendance] = useState("dummy")
  const [markdate, setMarkDate] = useState()
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        SetLogged(true)
        setUserData(user.toJSON())
        getAttendanceData(user)
       
      } else {
        navigate("/login")
      }
    });

  }, [])


  const validTime = () => {
    var startTime = '06:10:10';
    var endTime = '18:10:00';

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


  // getting data from cloud firestore 
  const getAttendanceData = async (user) => {
    console.log("getattendance data function called", user.uid)
    const querys = query(doc(db, "attendance", user.uid))
    const snapshot = await getDoc(querys)
    console.log("snapshot", snapshot)
    getDoc(doc(db, "attendance", user.uid)).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", JSON.stringify(docSnap.data()));
        let arrdate = []
        // snapshot.forEach((doc) => {
        //   arrdate.push(doc.data())
        // })
        console.log("arrdate", arrdate)
        setAttendance(JSON.stringify(docSnap.data()))
        markdatefunction()
      } else {
        console.log("No such document!");
      }
    })

  }

  let dateMarkArr = []
  // console.log(JSON.parse(attendance))
  console.log(attendance.length)
  const markdatefunction = () => {
    if (attendance.length > 6) {

      let jsonp = JSON.parse(attendance)
      console.log("attendance", jsonp)
      Object.keys(jsonp).map((item) => {
        // console.log(jsonp[item]) ->it will print single object 
        dateMarkArr.push(item)

      })
      console.log(dateMarkArr)
      setMarkDate(dateMarkArr)
    }
    //push into array dates
    const markdates = () => {
      console.log(markdates.length)
    }
  }


  const markAttendance = async (e) => {
    e.preventDefault()

    if (validTime()) {
      console.log("valid time")
      let currentDate = new Date()

      let separator = '-'
      let newDate = new Date()
      let date = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      let day = newDate.getDay();
      // let arrivalDate = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
      let arrivalDate = "06-07-2023"
      console.log(arrivalDate)
      try {

        const docData = {

          [arrivalDate]: {
            name: userData.displayName,
            date: date,
            month: month,
            year: year,
            markdate: arrivalDate,
            arrivalDate: Timestamp.fromDate(new Date()),
          }

        };
        console.log("datatobeinserted", docData)
        const docRef = doc(db, "attendance", userData.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());

          await updateDoc(doc(db, "attendance", userData.uid), docData);
          console.log("Document written with ID: ", userData.uid);
          getAttendanceData(userData)
        } else {
          await setDoc(doc(db, "attendance", userData.uid), docData);
          console.log("Document written with ID: ", userData.uid);
          getAttendanceData(userData)
        }

      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      alert("time for attendance is ended")
      console.log("invalid time")
    }
  }

  //add dates to array to highlight the calender


  return (
    <section>
      {
        logged && (
          <div className="px-2 flex flex-col md:flex-row gap-10 items-center lg:items-stretch justify-evenly">

            {/* //user-info */}
            <div className="user-info w-[95%] md:w-[40vw]">
              <div className='w-[95%] mx-auto md:mx-0 md:w-[40vw]'>

                {/* //user-details */}

                <div className="w-full flex flex-col gap-10 justify-start items-center py-5">

                  <div className="rounded-md w-full shadow-md p-1 flex flex-col items-center gap-10">
                    <img src={userData.photoURL} className='rounded-full w-[200px] h-[200px]' />
                    <div className="flex flex-col gap-5 py-5">
                      <div className="text-center text-2xl font-bold w-fit">
                        <h2>{userData.displayName}</h2>
                      </div>
                      <div className="text-center text-2xl font-bold w-fit">
                        <h2>Web Developer</h2>
                      </div>
                    </div>
                  </div>


                </div>

                {/* //attendance mark */}

                <div className="mark w-full">
                  <form className='w-full text-center font-bold text-xl shadow-md p-5  bg-orange-400 rounded-md text-white'>
                    <button onClick={markAttendance}>mark attendance</button>
                  </form>
                </div>

              </div>
            </div>

            {/* //user-attendance-info */}
            <div className="user-attendance w-[40vw]  shadow-md flex items-center justify-center">
              {
                markdate && (
                  <CalendarApp arr={markdate} />
                )
              }
            </div>




            //user present info
            <div>
              {/* {
              attendance.map((date)=>{
                return(
                  <li>{date}</li>
                )
              })
            } */}
            </div>

          </div>


        )

      }
    </section>
  )
}

export default Home