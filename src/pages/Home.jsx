import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

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
  const markAttendance =async (e) => {
    e.preventDefault()

    if (validTime()) {
      console.log("valid time")
      try {
        const userProjectsColRef = await collection(db, 'attendance', userData.uid, 'date');
        const newProjectDocRef = await doc(userProjectsColRef);
       await addDoc(collection(newProjectDocRef, 'tasks'), {
         "data":"data is inserted"
        });
        // const docRef = await addDoc(collection(db, "attendance"), {
        //   todo: todo,
        // });
        console.log("Document written with ID: ", userData.uid);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("invalid time")
    }
  }



  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const userProjectsColRef = collection(db, 'attendance', userData.uid, 'date');
      const newProjectDocRef = doc(userProjectsColRef);
      addDoc(collection(newProjectDocRef, 'tasks'), {
       "data":"data is inserted"
      });
      // const docRef = await addDoc(collection(db, "attendance"), {
      //   todo: todo,
      // });
      console.log("Document written with ID: ", userData.uid);
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

              <div className="rounded-full w-[200px] shadow-md p-5">
                <img src={userData.photoURL} />
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