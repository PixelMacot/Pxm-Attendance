import React, { useContext, useEffect, useState } from 'react'
import { CalendarContext } from '../context/CalendarContext'
import Box from '@mui/material/Box';
import { DataGrid,GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

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

  const { getAttendanceData, markdate, attendance, markdatefunction } = useContext(CalendarContext)
  let attn = JSON.parse(attendance)
  console.log("attn", JSON.parse(attendance))
  let rows = []
  // attn.forEach((item) => {
  //   rows.push({
  //     date: item.date,
  //     workinghours: calculateWorkingTime(attn[item].entry, attn[item].exit)
  //   })
  // })
  Object.keys(attn).forEach(function (key, index) {
    rows.push({
      id: index,
      date: attn[key].markdate,
      workinghours: calculateWorkingTime(attn[key].entry, attn[key].exit)
    })
    console.log()
  });
  console.log(rows)
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
    const minute = departureDateParts[1] > arrivalDateParts[1] ? departureDateParts[1] - arrivalDateParts[1] : arrivalDateParts[1] - departureDateParts[1]
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