import React, { useState, useEffect } from 'react';
import { getDocs, collection } from "firebase/firestore";
import { db } from '../../firebase';
import DataTable from '../../components/datatable/DataTable'
import PieChartBox from '../../components/piechartbox/PieChartBox'

import './home.scss'
import CalendarComponent from '../../components/calendar/Calendar';
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "uid", headerName: "UID", width: 90 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "name",
    type: "string",
    headerName: "Name",
    width: 150,
  },
  {
    field: "status",
    type: "string",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      return <p className=''>{params.row.status?'active':'not active'}</p>;
    },
  },
  {
    field: "prevelege",
    type: "string",
    headerName: "Prevelege",
    width: 150,
  },
  {
    field: "position",
    type: "string",
    headerName: "Position",
    width: 150,
    renderCell: (params) => {
      return <p className='hidden md:flex'>{params.row.position}</p>;
    },
  },
  {
    field: "gender",
    type: "string",
    headerName: "Gender",
    width: 150,
  },

];

const AdminHome = () => {
  const [usersData, setUsersData] = useState({})
  const [users, setUsers] = useState(false)
  useEffect(() => {
    fetchusers()
  }, [])

  const fetchusers = async () => {
    try {
      const collectionRef = collection(db, "users");
      const snapshot = await getDocs(collectionRef);
      const fetched_data = snapshot.docs.map((doc, index) => {
        console.log(doc.data())
        return (
          {
            id: index,
            name: doc.data().username,
            img: doc.data().profileimg,
            position: doc.data().position,
            status: doc.data().status,
            gender: doc.data().gender,
            prevelege: doc.data().prevelege,
            uid: doc.data().uid,

          }
        )
      });
      setUsers(fetched_data);
      //below function convert data into json
      console.log(fetched_data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const totalWorkingHoursData = {
    "John": 180,
    "Alice": 200,
    "Bob": 160,
    "Eve": 220,
    // Add more data as needed
  };


  return (
    <section className='admin-home-section'>
      <div className="admin-home-container">
        <div className="admin-users-wrapper">
          {
            users && (
              <div className="users-table">
                <DataTable slug="users" columns={columns} rows={users} />
              </div>
            )
          }
        </div>
        {/* <div className="charts-wrapper">
          <div className="piechart-wrapper">
            <div>
              <h1>Total Working Hours</h1>
              <PieChartBox/>
            </div>
          </div>
        </div>
        <div className="admin-calendar-wrapper">
          <CalendarComponent/>
        </div> */}
      </div>
    </section>

  )
}

export default AdminHome



