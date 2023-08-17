import React, { useState, useEffect } from 'react';
import { getDocs, collection } from "firebase/firestore";
import { db } from '../../firebase';
import DataTable from '../../components/datatable/DataTable'
import './home.scss'

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "uid", headerName: "UID", width: 90 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img != 'notprovided' ? params.row.img : params.row.gender == 'male' ? '/boyavatar.png' : '/girlavatar.png'} />;
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
      return <p className=''>{params.row.status ? 'active' : 'not active'}</p>;
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
  const [users, setUsers] = useState(false)
  useEffect(() => {
    fetchusers()
  }, [])

  const fetchusers = async () => {
    try {
      const collectionRef = collection(db, "users");
      const snapshot = await getDocs(collectionRef);
      let fetchedarr = []
      const fetched_data = snapshot.docs.map((doc, index) => {
        console.log(doc.data())
        return doc.data().prevelege === "superadmin" ?
          (
            console.log("superadmin dont print")
          )
          : (
            fetchedarr.push({
              id: index,
              name: doc.data().username,
              img: doc.data().profileimg,
              position: doc.data().position,
              status: doc.data().status,
              gender: doc.data().gender,
              prevelege: doc.data().prevelege,
              uid: doc.data().uid,

            })


          )

      });
      setUsers(fetchedarr);
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
      </div>
    </section>

  )
}

export default AdminHome



