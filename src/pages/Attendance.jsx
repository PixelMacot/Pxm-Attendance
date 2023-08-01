import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from '../firebase';
import { auth } from '../firebase';
import Profile from '../components/profile/Profile';
import CalendarApp from '../components/calenda/CalendarApp';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from 'moment';

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
  const [attendance, setAttendance] = useState()
  const [currentdate, setcurrentDate] = useState(7)
  const [userData, setUserData] = useState({})
  const [viewattendance, setViewAttendance] = useState(false)
  const navigate = useNavigate();
  //function to post profile data into cloud firestore

  useEffect(() => {
    getUserProfileData(id)
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
        console.log("Document data:", docSnap.data());
        setAttendance(docSnap.data())
        markdatefunction()
      } else {
        console.log("No such document!");
      }

    })

  }

  const reloadCalendar = () => {
    getAttendanceData(id)
  }

  const calculateWorkingHours = (timePoint1 = "10-10-10", timePoint2 = "10-10-10") => {
    if (timePoint1 !== "10-10-10" && timePoint2 === "10-10-10") {
      timePoint2 = timePoint1
    }

    const [hours1, minutes1, seconds1] = timePoint1.split('-').map(Number);
    const [hours2, minutes2, seconds2] = timePoint2.split('-').map(Number);

    const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
    const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;

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


  return (
    <div className="min-h-[100vh]">
      <div className="flex flex-col gap-10 justify-center items-center w-[90vw]">
        {
          userData && (
            <div className="border shadow-md rounded-md min-w-[100%] ">
              <Profile userData={userData} />
            </div>
          )
        }
        <div className="flex flex-col gap-10 ">
          <div className="load-btn">
            <button
              onClick={reloadCalendar}
              className='bg-cyan-700 px-5 py-2 text-white shadow-md rounded-md my-2'
            >Load Data</button>
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