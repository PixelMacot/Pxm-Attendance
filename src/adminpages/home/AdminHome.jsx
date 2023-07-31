import React, { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from '../../firebase';
import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';

const AdminHome = () => {
  //send user to login page when user not logged in
  const [attendance, setAttendance] = useState("dummy")
  const [markdate, setMarkDate] = useState()
  const [usersData, setUsersData] = useState({})
  const [viewattendance, setViewAttendance] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    getUsersData()
  }, [])

  const viewAttendance = (e) => {
    let userid = e.target.id
    if (userid == "notfound") {
      console.log("update profile to see attendance")
    } else {
      getAttendanceData(userid)
    }
    console.log(userid)
  }

  //user data
  let obj = []
  //function to post profile data into cloud firestore
  const getUsersData = async () => {
    const colRef = collection(db, "users");
    const docsSnap = await getDocs(colRef);

    docsSnap.forEach(doc => {
      obj.push(doc.data())
      // console.log(doc.data())
    })
    setUsersData(obj)
    // console.log(usersData)
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

  return (
    <div className="">
      <div className="">
        Admin Home
      </div>
      <div className="">
        <table>
          <tr>
            <th>Name</th>
            <th className='hidden md:flex'>Position</th>
            <th>attendance</th>
          </tr>

          {
            usersData && (
              (Object.entries(usersData)).map((user, index) => {
                // console.log("user",user)
                return (
                  <tr key={index}>
                    <td>{user[1].username}</td>
                    <td className='hidden md:flex'>{user[1].position}</td>
                    <td><Link to={`/admin/employee/${user[1].uid}`}>View</Link></td>
                  </tr>
                )
              })
            )
          }


        </table>

      </div>
    </div>
  )
}

export default AdminHome