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
  const [markdate, setMarkDate] = useState()
  const [userData, setUserData] = useState({})
  const [viewattendance, setViewAttendance] = useState(false)
  const navigate = useNavigate();
  //function to post profile data into cloud firestore

  useEffect(() => {
    getUserProfileData(id)
  }, [])


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


  //Attendance
  let rows = []
  let currentMonth = "17-07-2023"
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
          workinghours: calculateWorkingTime(attn[key].entry, attn[key].exit)
        })
      }

      // console.log()
    });
  }
  // console.log()
  function calculateWorkingTime(arrivalDateStr = "17-01-47", departureDateStr = "17-01-47") {
    if (arrivalDateStr != "17-01-47" && departureDateStr == "17-01-47") {
      departureDateStr = arrivalDateStr
    }
    // console.log(arrivalDateStr, departureDateStr)
    // Parse the date strings and create Date objects
    const arrivalDateParts = arrivalDateStr.split('-');
    const departureDateParts = departureDateStr.split('-');
    // console.log(arrivalDateParts, departureDateParts)
    const hours = departureDateParts[0] - arrivalDateParts[0]
    const minute = departureDateParts[1] - arrivalDateParts[1]
    const workingHours = `${hours} hours ${minute} minutes`
    let hoursInMinutes = hours * 60
    let totalMinutes = hoursInMinutes + minute
    // const date = moment().add(totalMinutes, 'minutes').format('HH-mm-ss');
    console.log(totalMinutes)
    return workingHours;
  }

  const arrivalDateStr = "17-01-47";
  const departureDateStr = "17-08-47";
  const totalWorkingTime = calculateWorkingTime(arrivalDateStr, departureDateStr);
  console.log(`Total working time: ${totalWorkingTime} `);
  return (
    <div className="min-h-[100vh]">
      <div className="flex flex-col gap-10 md:flex-row justify-center">
        {
          userData && (
            <div className="border shadow-md rounded-md w-[100%] md:w-[45%]">
              <Profile userData={userData} />
            </div>
          )
        }
        <div className="flex flex-col gap-10 w-[100%] md:w-[45%]">
          <div className="load-btn">
            <button
              onClick={reloadCalendar}
              className='bg-cyan-700 px-5 py-2 text-white shadow-md rounded-md my-2'
            >Load Data</button>
          </div>

          <div>
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