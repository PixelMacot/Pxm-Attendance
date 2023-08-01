import React, { useContext, useEffect, useState } from 'react'
import { CalendarContext } from '../../context/CalendarContext'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import './presentdates.scss'
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
const PresentDates = ({ arr }) => {

  const { currentMonth, currentMonthPresentDays, attendance, markdatefunction } = useContext(CalendarContext)
  // console.log(JSON.parse(currentMonthPresentDays))
  
   if(!attendance){
    return <div>Not Attendance Data Found</div>
   }
  
  
  let attn = attendance
  // let sortedattendancedata = attn .
  // console.log("attn", JSON.parse(attendance))
  let rows = []
  // attn.forEach((item) => {
  //   rows.push({
  //     date: item.date,
  //     workinghours: calculateWorkingTime(attn[item].entry, attn[item].exit)
  //   })
  // })
  let currentDate = currentMonth.slice(3, 10)
  Object.keys(attn).forEach(function (key, index) {
    if (attn[key].markdate.slice(3, 10) != currentDate) {
      //dont push dates of next month in array
    }else{
      rows.push({
        id: index,
        date: attn[key].markdate,
        workinghours: calculateWorkingTime(attn[key].entry, attn[key].exit)
      })
    }
    
    // console.log()
  });
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

    return workingHours;
  }

  const arrivalDateStr = "17-01-47";
  const departureDateStr = "17-08-47";
  const totalWorkingTime = calculateWorkingTime(arrivalDateStr, departureDateStr);
  console.log(`Total working time: ${totalWorkingTime} `);

  return (
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
  );
};

export default PresentDates