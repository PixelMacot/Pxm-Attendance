import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'
import moment from 'moment';

const CalendarApp = ({ arr }) => {
  const [value, onChange] = useState(new Date());
  const [presentdays, setPresentDays] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(moment(new Date()).format("DD-MM-YYYY"))

  console.log("from calendarapp", arr)
  let currentDate = currentMonth.slice(3, 10)
  let countdays = 0

  useEffect(() => {
    countDays()
  }, [currentMonth,arr])

  const countDays = () => {
    let pday = arr.filter((date) => {
      console.log(date.slice(3, 10), currentDate)
      return date.slice(3, 10) == currentDate
    })
    console.log(pday.length)
    setPresentDays(pday.length)

  }

  const onActiveStartDateChangeHandler = ({ activeStartDate, value, view }) => {
    console.log("vv:", activeStartDate, value, view);
    setCurrentMonth(moment(activeStartDate).format("DD-MM-YYYY"))
  };

  return (
    <div>
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
      Present days: {presentdays}
    </div>
  )
}

export default CalendarApp