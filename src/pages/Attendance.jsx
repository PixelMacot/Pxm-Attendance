import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import { auth } from '../firebase';
import Profile from '../components/profile/Profile';
import CalendarApp from '../components/calenda/CalendarApp';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from 'moment';
import './employee.scss'

const columns = [
  {
    field: 'date',
    headerName: 'Date',

  },
  {
    field: 'workinghours',
    headerName: 'Working Hours',
    width: 200
  },
  {
    field: 'entry',
    headerName: 'Entry',
    width: 200
  },
  {
    field: 'exit',
    headerName: 'Exit',
    width: 200
  },
];


function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const Attendance = () => {
  // console.log("Attendance",userData)
  const { id } = useParams();
  console.log(id)
  //send user to login page when user not logged in
  const [isadmin, setIsAdmin] = useState(false)
  const [attendance, setAttendance] = useState()
  const [currentdate, setcurrentDate] = useState(7)
  const [userData, setUserData] = useState({})
  const [err, setErr] = useState()
  const [msg, setMsg] = useState()
  const [adminmsg, setAdminMsg] = useState()
  const [userattendance, setUserAttendance] = useState({
    date: '',
    entry: '',
    exit: ''
  })
  const [viewattendance, setViewAttendance] = useState(false)
  const navigate = useNavigate();
  //function to post profile data into cloud firestore
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserAttendance({ ...userattendance, [name]: value });
    console.log(userattendance)
  };

  useEffect(() => {
    getUserProfileData(id)
    console.log(userData.prevelege)
  }, [])

  const prevmonth = () => {
    setcurrentDate(currentdate - 1)
  }
  const nextmonth = () => {
    setcurrentDate(currentdate + 1)
  }

  const getUserProfileData = async (id) => {
    // console.log("getattendance data function called", user.uid)
    getDoc(doc(db, "users", id)).then(docSnap => {

      if (docSnap.exists()) {
        console.log("Document data:", JSON.stringify(docSnap.data()));
        setUserData(docSnap.data())
        console.log(docSnap.data().prevelege)
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
  console.log("isadmin", isadmin)
  //attendance data
  // getting Attendance data from cloud firestore 
  const getAttendanceData = async (useruid) => {
    // console.log("getattendance data function called", user.uid)
    getDoc(doc(db, "attendance", useruid)).then(docSnap => {

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setAttendance(docSnap.data())
      } else {
        console.log("No such document!");
      }

    })

  }

  const reloadCalendar = () => {
    getAttendanceData(id)
  }
  const convertToNumber = (value) => {
    if (typeof value === 'string') {
      return Number(value);
    }
    return value; // If it's not a string, return the original value
  };
  const calculateWorkingHours = (timePoint1 = "10-10-10", timePoint2 = "10-10-10") => {
    if (timePoint1 !== "10-10-10" && timePoint2 === "10-10-10") {
      timePoint2 = timePoint1
    }

    const [hours1, minutes1, seconds1] = timePoint1.split('-').map(Number);
    const [hours2, minutes2, seconds2] = timePoint2.split('-').map(Number);

    const totalSeconds1 = convertToNumber(hours1) * 3600 + convertToNumber(minutes1) * 60 + convertToNumber(seconds1);
    const totalSeconds2 = convertToNumber(hours2) * 3600 + convertToNumber(minutes2) * 60 + convertToNumber(seconds2);

    let difference = totalSeconds2 - totalSeconds1;

    const hours = Math.floor(difference / 3600);
    difference %= 3600;
    const minutes = Math.floor(difference / 60);
    const seconds = difference % 60;

    return `${hours} hours, ${minutes} minutes`;
  };

  //Attendance
  let months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  let rows = []
  let currentMonth = `17-${months[currentdate]}-2023`
  console.log("currentMont", currentMonth)
  let currentDate = currentMonth.slice(3, 10)
  if (attendance) {
    let attn = attendance
    Object.keys(attn).forEach(function (key, index) {
      console.log(attn[key])
      if (attn[key].markdate.slice(3, 10) != currentDate) {
        //dont push dates of next month in array
      } else {
        rows.push({
          id: index,
          date: attn[key].markdate,
          workinghours: calculateWorkingHours(attn[key].entry, attn[key].exit),
          entry: attn[key].entry,
          exit: attn[key].exit,
        })
      }
      // console.log()
    });
  }
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}-${minutes}-00`;
  };

  //function to post attendance data into cloud firestore
  const markAttendance = async (e) => {
    e.preventDefault()
    console.log(userData)
    console.log(userattendance.date)
    let objname = moment(userattendance.date).format("DD-MM-YYYY")
    try {
      let docData = {
        [objname]: {
          name: userData.username,
          markdate: objname,
          arrivalDate: Timestamp.fromDate(new Date()),
          entry: formatTime(userattendance.entry),
          exit: formatTime(userattendance.exit),
        }
      }
      console.log("datatobeinserted", docData)
      const docRef = doc(db, "attendance", userData.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        updateDoc(doc(db, "attendance", userData.uid), docData).then(() => {
          console.log('Data successfully updated in Firestore!');
          setMsg("Data successfully updated")
        }).catch((error) => {
          console.error('Error updating data in Firestore:', error);
        });
      } else {
        await setDoc(doc(db, "attendance", userData.uid), docData);
        setMsg("Data successfully updated")
      }
    } catch (err) {
      console.error("Error adding document: ", err);
      setErr("Some error occured try again")
    }

  }

  //checking admin
  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    // Update the data based on checkbox status
    if (checked) {
      updateDoc(doc(db, "users", userData.uid),  {prevelege:"admin"}).then(() => {
        console.log('admin prevelege successfully updated in Firestore!');
        setAdminMsg("admin prevelege successfully added")
      }).catch((error) => {
        console.error('Error updating data in Firestore:', error);
      });
    } else {
      updateDoc(doc(db, "users", userData.uid), {prevelege:"employee"}).then(() => {
        console.log('admin prevelege successfully updated in Firestore!');
        setAdminMsg("admin prevelege successfully removed")
      }).catch((error) => {
        console.error('Error updating admin prevelege in Firestore:', error);
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 justify-center items-center ">
      <div className="w-[90vw]">
        {
          userData && (
            <div className="border shadow-md rounded-md min-w-[100%] ">
              <Profile userData={userData} />
            </div>
          )
        }
        <div className="flex flex-col gap-10 ">
          {
            err && (
              <p className="text-red-500">{err}</p>
            )
          }
          {
            msg && (
              <p className="text-green-700 font-bold">{msg}</p>
            )
          }

          <div className="updateData shadow-md p-5 rounded-md my-2">

            <div className="flex gap-2 flex-col">
              <label>Date</label>
              <input type="date"
                name='date'
                className='border p-2 w-[180px]'
                onChange={handleChangeInput}
              />
            </div>
            <div className="flex gap-2 flex-col">
              <label>Entry Time</label>
              <input type="time"
                name='entry'
                step="3600"
                className='border p-2 w-[180px]'
                onChange={handleChangeInput}
              />
            </div>
            <div className="flex gap-2 flex-col">
              <label>Exit Time</label>
              <input type="time"
                name='exit'
                step="3600"
                className='border p-2  w-[180px]'
                onChange={handleChangeInput}
              />
            </div>
            <button
              onClick={markAttendance}
              className='bg-cyan-700 px-5 py-2 text-white shadow-md rounded-md my-2'
            >Update Attendance Data</button>

          </div>
          {
            adminmsg && (
              <p
                className="text-green-700 font-bold"
              >{adminmsg}</p>
            )
          }
          {/* //switch  */}
          {
            userData.prevelege && (
              <div className="switchbutton">
                <div className="container">
                  admin
                  <div className="toggle-switch">
                    <input type="checkbox" className="checkbox"
                      name="admin" id="admin"
                      value={"admin"}
                      defaultChecked={isadmin ? true : false}
                      onChange={handleCheckboxChange}
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

          <div className="flex gap-4">
            <div className="load-btn">
              <button
                onClick={reloadCalendar}
                className='bg-cyan-700 px-5 py-2 text-white shadow-md rounded-md my-2'
              >Load Data</button>
            </div>

          </div>
          <div className="flex gap-5">
            <button
              onClick={prevmonth}
              className="text-cyan-700 border border-cyan-700 px-5 py-2 rounded-md">Prev</button>

            <button
              onClick={nextmonth}
              className="text-cyan-700 border border-cyan-700 px-5 py-2 rounded-md">Next</button>
          </div>
          <div className='max-w-[90vw]'>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
                sorting: {
                  sortModel: [{ field: 'date', sort: 'desc' }],
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{
                toolbar: CustomToolbar,
              }}
            />
          </div>

        </div>

      </div>
    </div>

  )
}

export default Attendance