import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'
import moment from 'moment';
import { ConvertToExcel } from '../components/ConvertToExcel';

const CalendarApp = ({ arr }) => {
  const [value, onChange] = useState(new Date());
  const [presentdays, setPresentDays] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(moment(new Date()).format("DD-MM-YYYY"))
  const [filtereddays, setFilteredDays] = useState()
  console.log("from calendarapp", arr)
  let currentDate = currentMonth.slice(3, 10)
  let month,year
  useEffect(() => {
    countDays()
    console.log("current month",)
    // month=currentMonth.substring(4,5)
    // year = currentMonth.substring(6,10)
  }, [currentMonth, arr])

  const countDays = () => {
    let pday = arr.filter((date) => {
      console.log(date.slice(3, 10), currentDate)
      return date.slice(3, 10) == currentDate
    })
    console.log(pday.length)
    setPresentDays(pday.length)
    setFilteredDays(pday.sort())
  }

  const onActiveStartDateChangeHandler = ({ activeStartDate, value, view }) => {
    console.log("vv:", activeStartDate, value, view);
    setCurrentMonth(moment(activeStartDate).format("DD-MM-YYYY"))
  };

  function daysInMonth(month, year) {
    console.log(month,year)
    return new Date(year, month, 0).getDate();
  }
  
  return (
    <>
      <div className='flex flex-col md:flex-row justify-evenly w-full'>
        <Calendar
          onChange={onChange}
          value={new Date()}
          view={"month"}
          onActiveStartDateChange={onActiveStartDateChangeHandler}
          tileClassName={({ date, view }) => {
            if (arr.find(x => x === moment(date).format("DD-MM-YYYY"))) {
              return 'highlight'
            }
          }}
        />
        <div className="">
          {/* //total present days  */}
          <div className="my-5 py-2">
            Present days: {presentdays}
            {/* Absent days: {totalabsent} */}
          </div>
          {/* //list of  present days  */}
          {/* <div className="my-10 py-2 border border-transparent border-t-gray-500">
            {
              filtereddays && (
                <ConvertToExcel arr={filtereddays} />
              )

            }
          </div> */}
        </div>

      </div>


    </>
  )
}

export default CalendarApp