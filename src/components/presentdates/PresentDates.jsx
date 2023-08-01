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

  if (!attendance) {
    return <div>Not Attendance Data Found</div>
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
    } else {
      rows.push({
        id: index,
        date: attn[key].markdate,
        workinghours: calculateWorkingHours(attn[key].entry, attn[key].exit)
      })
    }

    // console.log()
  });
  // console.log()


  const arrivalDateStr = "10-34-47";
  const departureDateStr = "11-20-47";
  const totalWorkingTime = calculateWorkingHours(arrivalDateStr, departureDateStr);
  console.log(`Total  time: ${totalWorkingTime} `);

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