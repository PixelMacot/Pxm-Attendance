import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';

const Home = () => {
  const [logged, SetLogged] = useState(false)
  const [userData, setUserData] = useState({})
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        SetLogged(true)
        setUserData(user.toJSON())
        console.log(user.toJSON())
        // ...
        console.log("uid", uid)
      } else {
        navigate("/login")
      }
    });

  }, [])
  const validTime = () => {
    var startTime = '10:10:10';
    var endTime = '11:10:00';

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
      let arrivalDate = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}${separator}${day}`

      console.log(arrivalDate)
      try {

        const docData = {

          [arrivalDate]: {
            name: userData.displayName,
            arrivalDate: Timestamp.fromDate(new Date())
          }

        };

        const docRef = doc(db, "attendance", userData.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          await updateDoc(doc(db, "attendance", userData.uid), docData);
          console.log("Document written with ID: ", userData.uid);
        } else {
          await setDoc(doc(db, "attendance", userData.uid), docData);
          console.log("Document written with ID: ", userData.uid);
        }

      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      alert("time for attendance is ended")
      console.log("invalid time")
    }
  }



  const addTodo = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "attendance", userData.uid), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <section>
      {
        logged ? (
          <div className='w-[80vw] py-20 mx-auto'>

            {/* //user-details */}

            <div className="flex flex-col gap-10 justify-center items-center py-20">

              <div className="rounded-full w-fit shadow-md p-1">
                <img src={userData.photoURL} className='rounded-full w-[250px]' />
              </div>

              <div className="text-center text-2xl font-bold w-fit">
                <h2>{userData.displayName}</h2>
              </div>
              <div className="text-center text-2xl font-bold w-fit">
                <h2>Web Developer</h2>
              </div>

            </div>

            {/* //attendance mark */}

            <div className="mark">
              <form className='mx-auto shadow-md p-5 w-fit'>
                <button onClick={markAttendance}>mark attendance</button>
              </form>
            </div>

          </div>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )

      }
    </section>
  )
}

export default Home