import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'
const CalendarApp = ({dateMarkArr}) => {
    const [value, onChange] = useState(new Date());
  return (
    <div>
      <Calendar 
      onChange={onChange} 
      value={value} 
      tileClassName={({ date, view }) => {
        if(dateMarkArr.find(x=>x===moment(date).format("DD-MM-YYYY"))){
         return  'highlight'
        }
      }}
      />
    </div>
  )
}

export default CalendarApp