import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { doc, setDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { Link } from 'react-router-dom';


const columns = [
  {
    field: 'id',
    headerName: 'Id',
  },
  {
    field: 'name',
    headerName: 'Name',
  },
  {
    field: 'category',
    headerName: 'Category',
  },
  {
    field: 'date',
    headerName: 'Date',

  },
  {
    field: 'message',
    headerName: 'Message',
    width: 200,
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
  const [filter, setFilter] = useState()
  const [messages, setMessages] = useState({})
  let rows = []

  useEffect(() => {
    fetchMessages()
    // if (messages) {
    //   insertInRows()
    // }
  }, [])


  const fetchMessages = async () => {
    try {
      const collectionRef = collection(db, "messages");
      const snapshot = await getDocs(collectionRef);
      const fetched_data = snapshot.docs.map((doc, index) => {
        console.log(index)
        return (
          {
            id:index,
            name:doc.data().name,
            category:doc.data().category,
            date:doc.data().date,
            message:doc.data().message,
          }
        )
      });
      setMessages(fetched_data);
      //below function convert data into json
      console.log(fetched_data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const insertInRows = () => {
    Object.keys(messages).forEach(function (key, index) {
      console.log(messages[key])
      rows.push({
        id: index,
        name: messages[key].name,
        message: messages[key].message
      })
    });
  }

  return (
    <div className='message-container'>
      <div className="message-wrapper w-fit mx-auto">
        <DataGrid
          rows={messages}
          columns={columns}

          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
            // sorting: {
            //   sortModel: [{ field: 'date', sort: 'desc' }],
            // },
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                category: false,
                date: false,
              },
            },
          }}
          pageSizeOptions={[5]}
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
