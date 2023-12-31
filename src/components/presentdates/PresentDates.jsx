import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import './presentdates.scss'

// components Features
// (1) create announcement


const columns = [
  {
    field: 'date',
    headerName: 'Date',
    width: 150
  },
  {
    field: 'workinghours',
    headerName: 'Working Hours',
    width: 200
  },
  ,
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
const PresentDates = ({ currentMonth, attendance }) => {

  // const { currentMonth, currentMonthPresentDays, attendance, markdatefunction } = useContext(CalendarContext)
  // console.log(JSON.parse(currentMonthPresentDays))

  if (!attendance || attendance == "newuser") {
    return <div>Not Attendance Data Found</div>
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
    if (timePoint1 !== "10-10-10") {
      const [hours1, minutes1, seconds1] = timePoint1.split('-').map(Number);
      if (hours1 < 10) {
        // If hours1 is less than 10, set it to 10
        timePoint1 = `10-00-00`;
        // console.log("timepoint changed")
      }

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
      // console.log(`${attn[key].entry.slice(0, 2)}:${attn[key].exit.slice(3,5)}`)
      let currdata = attn[key]
      rows.push({
        id: index,
        date: attn[key].markdate,
        workinghours: calculateWorkingHours(attn[key].entry, attn[key].exit),
        entry: currdata.entry && `${currdata.entry.slice(0, 2)}:${currdata.entry.slice(3, 5)}:${currdata.entry.slice(6, 8)}`,
        exit: currdata.exit && `${currdata.exit.slice(0, 2)}:${currdata.exit.slice(3, 5)}:${currdata.exit.slice(6, 8)}`,
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
    <div className='w-full'>

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
        // checkboxSelection
        disableRowSelectionOnClick
        slots={{
          toolbar: CustomToolbar,
        }}
      />

    </div>
  );
};

export default PresentDates