import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'
import moment from 'moment';
import  PresentDates  from '../presentdates/PresentDates';

const CalendarApp = ({ arr}) => {

  const [value, onChange] = useState(new Date());
  const [presentdays, setPresentDays] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(moment(new Date()).format("DD-MM-YYYY"))
  const [filtereddays, setFilteredDays] = useState(0)
  console.log("from calendarapp", arr)
  let currentDate = currentMonth.slice(3, 10)
  
  useEffect(() => {
    countDays()
    console.log("current month",)
  }, [currentMonth, arr])


  const countDays = () => {
    let pday = arr.filter((date) => {
      console.log(date.slice(3, 10), currentDate)
      return date.slice(3, 10) == currentDate
    })
    console.log(pday.length)
    
    setFilteredDays([...new Set(pday)].sort())
    setPresentDays(filtereddays.length)
  }

  const onActiveStartDateChangeHandler = ({ activeStartDate, value, view }) => {
    console.log("vv:", activeStartDate, value, view);
    setCurrentMonth(moment(activeStartDate).format("DD-MM-YYYY"))
  };


  return (
    <>
      <div className='flex flex-wrap  md:flex-row justify-evenly w-full'>
      <div className="w-[500px]">
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
      </div>
        <div className="">
          {/* //total present days  */}
          <div className="my-5 py-2">
            Present days: {presentdays}
            {/* Absent days: {totalabsent} */}
          </div>
          {/* //list of  present days  */}
          <div className="my-10 py-2 border border-transparent border-t-gray-500">
          </div>
        </div>

      </div>


    </>
  )
}

export default CalendarApp