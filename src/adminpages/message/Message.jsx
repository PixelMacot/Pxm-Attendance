import React, { useState, useEffect,useContext } from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { doc, setDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { MessagesContext } from '../../context/MessageContext'

// components Features
// (1) show list of messages


const columns = [
  {
    field: 'id',
    headerName: 'Id',
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'category',
    headerName: 'Category',
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,

  },
  {
    field: 'message',
    headerName: 'Message',
    width: 50,
    renderCell: (params) => {
      return <Link to={`/admin/message/${params.row.id}`}>View</Link>;
    },
  },
];
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const Message = () => {
  const {messages,fetchMessages} = useContext(MessagesContext)

  let rows = []

  // useEffect(() => {
  //   fetchMessages()
  //   // if (messages) {
  //   //   insertInRows()
  //   // }
  // }, [])


  // const fetchMessages = async () => {
  //   try {
  //     const collectionRef = collection(db, "messages");
  //     const snapshot = await getDocs(collectionRef);
  //     const fetched_data = snapshot.docs.map((doc, index) => {
  //       console.log(index)
  //       return (
  //         {
  //           id:index,
  //           name:doc.data().name,
  //           date:doc.data().date,
  //           message:doc.data().message,
  //           uid:doc.data().uid
  //         }
  //       )
  //     });
  //     setMessages(fetched_data);
  //     //below function convert data into json
  //     console.log(fetched_data)
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

console.log(messages)
  return (
    <div className='message-container mt-5 lg:mt-20 '>
      <button
      onClick={fetchMessages}
      className='px-5 py-2 bg-cyan-700 text-white rounded-md m-2'
      >Refresh Messages</button>
      <div className="message-wrapper w-[97%] mx-auto ">
        <DataGrid
          rows={messages}
          columns={columns}

          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
            sorting: {
              sortModel: [{ field: 'date', sort: 'desc' }],
            },
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                category: false,
                date: true,
                id:false
              },
            },
          }}
          pageSizeOptions={[5,10,20]}
          // checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
    </div>
  )
}

export default Message
