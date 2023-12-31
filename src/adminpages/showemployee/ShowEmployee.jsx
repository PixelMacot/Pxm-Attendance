import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../../firebase';
import Profile from '../../components/profile/Profile';
import moment from 'moment';
import './showemployee.scss'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom';
import CalendarComponent from '../../components/calendar/Calendar';
import PresentDates from '../../components/presentdates/PresentDates';
import { CalendarContext } from '../../context/CalendarContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// components Features
// (1) show emp profile
// (2) change emp status 
// (3) change emp prevelege
// (4) update emp attendance
// (5) showing emp attendance


const ShowEmployee = () => {
  const { userData } = useContext(AuthContext)
  const { id } = useParams();

  const [isadmin, setIsAdmin] = useState(false)
  const [attendance, setAttendance] = useState()
  const [empData, setEmpData] = useState({})
  const [err, setErr] = useState()
  const [msg, setMsg] = useState()
  const [adminmsg, setAdminMsg] = useState()
  const [userStatus, setUserStatus] = useState(false)
  const [rows, setRows] = useState([])
  const [presentDatesArray, setPresentDatesArray] = useState([])
  const { currentMonth } = useContext(CalendarContext)
  const [userattendance, setUserAttendance] = useState({
    date: '',
    entry: '',
    exit: ''
  })
  const [empnav, setEmpNav] = useState({
    profile: false,
    attendance: false,
    status: false,
    calendar: false,
    atndata: false
  })

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserAttendance({ ...userattendance, [name]: value });
    console.log(userattendance)
  };


  useEffect(() => {
    getUserProfileData(id)
    console.log(empData.prevelege)
  }, [])



  const getUserProfileData = async (id) => {
    getDoc(doc(db, "users", id)).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", JSON.stringify(docSnap.data()));
        setEmpData(docSnap.data())
        console.log(docSnap.data().prevelege)
        setUserStatus(docSnap.data().status)
        if (docSnap.data().prevelege === "admin") {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } else {
        console.log("Please update profile");
      }
    })

  }

  const getAttendanceData = async (useruid) => {    // console.log("getattendance data function called", user.uid)
    let presentDatesArray = []
    getDoc(doc(db, "attendance", useruid)).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setAttendance(docSnap.data())
        let attn = docSnap.data()
        Object.keys(attn).forEach(function (key, index) {
          console.log(attn[key])
          let currdata = attn[key]
          presentDatesArray.push(currdata.markdate)
        });
        setPresentDatesArray(presentDatesArray)
      } else {
        console.log("No such document!");
      }
    })

  }

  const reloadCalendar = () => {
    getAttendanceData(id)
  }

  const convertTo24HourFormat = (time12) => {
    // Check if the time is already in the 24-hour format (e.g., "18:10")
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time12)) {
      return time12;
    }

    const [time, meridian] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hours24 = parseInt(hours, 10);

    if (meridian === 'PM' && hours24 !== 12) {
      hours24 += 12;
    } else if (meridian === 'AM' && hours24 === 12) {
      hours24 = 0;
    }

    const time24 = `${hours24.toString().padStart(2, '0')}-${minutes}-00`;
    return time24;
  };
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    let timechange = `${hours}:${minutes}:00`
    let correctformat = convertTo24HourFormat(timechange)
    return correctformat
  };

  //function to post attendance data into cloud firestore
  const markAttendance = async (e) => {
    e.preventDefault()
    console.log(empData)
    console.log(userattendance.date)
    let objname = moment(userattendance.date).format("DD-MM-YYYY")
    try {
      let docData = {
        [objname]: {
          name: empData.username,
          markdate: objname,
          arrivalDate: Timestamp.fromDate(new Date()),
          entry: formatTime(userattendance.entry),
          exit: formatTime(userattendance.exit),
        }
      }
      console.log("datatobeinserted", docData)
      const docRef = doc(db, "attendance", empData.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        updateDoc(doc(db, "attendance", empData.uid), docData).then(() => {
          console.log('Data successfully updated in Firestore!');
          // setMsg("Data successfully updated")
          toast.success("Data successfully updated")
        }).catch((error) => {
          console.error('Error updating data in Firestore:', error);
        });
      } else {
        await setDoc(doc(db, "attendance", empData.uid), docData);
        // setMsg("Data successfully updated")
        toast.success("Data successfully updated")
      }
    } catch (err) {
      console.error("Error adding document: ", err);
      setErr("Some error occured try again")
    }

  }

  //checking admin
  const handleAdminCheckboxChange = (event) => {
    const { checked } = event.target;
    // Update the data based on checkbox status
    if (checked) {
      updateDoc(doc(db, "users", empData.uid), { prevelege: "admin" }).then(() => {
        console.log('admin prevelege successfully updated in Firestore!');
        // setAdminMsg("admin prevelege successfully added")
        toast.success("admin prevelege successfully added")
      }).catch((error) => {
        console.error('Error updating data in Firestore:', error);
      });
    } else {
      updateDoc(doc(db, "users", empData.uid), { prevelege: "employee" }).then(() => {
        console.log('admin prevelege successfully updated in Firestore!');
        // setAdminMsg("admin prevelege successfully removed")
        toast.success("admin prevelege successfully removed")
      }).catch((error) => {
        console.error('Error updating admin prevelege in Firestore:', error);
      });
    }
  };
  const handleUserStatusCheckboxChange = (event) => {
    const { checked } = event.target;
    // Update the data based on checkbox status
    if (checked) {
      updateDoc(doc(db, "users", empData.uid), { status: true }).then(() => {
        console.log('User Status successfully updated in Firestore!');
        // setAdminMsg("User Status successfully updated")
        toast.success("User Status successfully updated")
      }).catch((error) => {
        console.error('Error updating data in Firestore:', error);
      });
    } else {
      updateDoc(doc(db, "users", empData.uid), { status: false }).then(() => {
        console.log('User Status successfully updated in Firestore!');
        // setAdminMsg("User Status successfully removed")
        toast.success("User Status successfully removed")
      }).catch((error) => {
        console.error('Error updating admin prevelege in Firestore:', error);
      });
    }
  };

  return (
    <div className="">
      <ToastContainer />
      <div className="show-employee-container">
        <div className="emppagenav">
          <button className="primary-button"
            onClick={() => setEmpNav({ ...empnav, profile: !empnav.profile })}
          >
            profile
          </button>
          <button className="primary-button"
            onClick={() => setEmpNav({ ...empnav, attendance: !empnav.attendance })}
          >
            attendance
          </button>
          <button className="primary-button"
            onClick={() => setEmpNav({ ...empnav, status: !empnav.status })}
          >
            status
          </button>
          <div className="icon-button">
            <Link to={`/admin/update/employee/${id}`}>
              <button
                onClick={reloadCalendar}
                className='primary-button'
              >Update User Profile ⮞</button>
            </Link>
          </div>
        </div>
        {
          empData && empnav.profile && (
            <div className="">
              <div className="profile open">
                <Profile userData={empData} />
              </div>
              <div className="profilebtn open"></div>
            </div>
          )
        }
        <div className="">
          <div className="attendance-prevelege">

            {
              empnav.attendance && (
                <div className="attendance-update-wrapper">
                  <h2>Update User Attendance</h2>

                  <div className="input-label">
                    <label>Date</label>
                    <input type="date"
                      name='date'
                      className=''
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-label">
                    <label>Entry Time</label>
                    <input type="time"
                      name='entry'
                      step="3600"
                      className=''
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input-label">
                    <label>Exit Time</label>
                    <input type="time"
                      name='exit'
                      step="3600"
                      className=''
                      onChange={handleChangeInput}
                    />
                  </div>
                  <button
                    onClick={markAttendance}
                    className='secondary-button'
                  > Update </button>
                </div>
              )
            }
            {
              empnav.status && (
                <div className="switch">
                  <h2>Update User Prevelege</h2>
                  {
                    empData.prevelege && userData.prevelege === "superadmin" && (
                      <div className="switchbutton">
                        <div className="container">
                          admin
                          <div className="toggle-switch">
                            <input type="checkbox" className="checkbox"
                              name="admin" id="admin"
                              value={"admin"}
                              defaultChecked={isadmin ? true : false}
                              onChange={handleAdminCheckboxChange}
                            />
                            {console.log("from input", isadmin)}
                            <label className="label" htmlFor={"admin"}>
                              <span className="inner" />
                              <span className="switch" />
                            </label>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  {
                    empData.prevelege && userData.prevelege === "superadmin" && (
                      <div className="switchbutton">
                        <div className="container">
                          status
                          <div className="toggle-switch">
                            <input type="checkbox" className="userstatus-checkbox"
                              name="userstatus" id="userstatus"
                              value={true}
                              defaultChecked={userStatus}
                              onChange={handleUserStatusCheckboxChange}
                            />
                            {console.log("from status", userStatus)}
                            <label className="label" htmlFor={"userstatus"}>
                              <span className="inner" />
                              <span className="switch" />
                            </label>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>

          {/* //switch  */}


          <div className="">

            <div className="secondary-button">
              <button
                onClick={reloadCalendar}
                className=''
              >Load attendance Data ⭯</button>
            </div>

          </div>

          <div className="">

            {
              presentDatesArray.length > 0 && (
                <CalendarComponent attendance={attendance} markdate={presentDatesArray} />
              )
            }

          </div>
          <div className=''>
            <PresentDates currentMonth={currentMonth} attendance={attendance} />

          </div>

        </div>

      </div>
    </div>

  )
}

export default ShowEmployee