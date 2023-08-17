import React, { useEffect, useState, useContext } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.scss'
import moment from 'moment';
import { CalendarContext } from '../../context/CalendarContext'
import { HolidaysContext } from '../../context/HolidaysContext'




const CalendarComponent = () => {
  const { attendance, setCurrentMonth, markdate, } = useContext(CalendarContext)
  const { holidaysData } = useContext(HolidaysContext)

  console.log("from calendar", holidaysData)
  console.log("from calendar", attendance)

  const onActiveStartDateChangeHandler = ({ activeStartDate, value, view }) => {
    // console.log("vv:", activeStartDate, value, view);
    setCurrentMonth(moment(activeStartDate).format("DD-MM-YYYY"))
  };

  const convertToNumber = (value) => {
    if (typeof value === 'string') {
      return Number(value);
    }
    return value; // If it's not a string, return the original value
  };

  //calculte working hours
  const calculateWorkingHours = (timePoint1 = "10-10-10", timePoint2 = "10-10-10") => {
    if (timePoint1 !== "10-10-10" && timePoint2 === "10-10-10") {
      timePoint2 = timePoint1
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

    return `${hours}:${minutes} hrs`;
  };






  const tileContent = ({ date }) => {
    const formattedDate = moment(date).format("DD-MM-YYYY")

    // Check if the date is present or a holiday
    const isPresent = markdate.includes(formattedDate);
    // const isPresent = attendance.some((att) => att.markdate === formattedDate);
    const isHoliday = holidaysData.some((holiday) => holiday.date === formattedDate);

    const currentDate = new Date();
    const isPastDate = date < currentDate;

    const isSunday = date.getDay() === 0; // 0 is Sunday
    // Define the content for different date types
    const isAbsent = !isPresent && !isHoliday && !isSunday && date < currentDate;
    // Check if the date is a Sunday

    // Define the content for different date types
    // if (isPresent) {
    //   return <div className="present-day" data-tip={getOccasion(formattedDate)}
    //   >{date.getDate()}</div>
    if (isPresent) {
      return <div className="present-day" data-tip={getOccasion(formattedDate)}
        data-tooltip-id="my-tooltip" data-tooltip-content={getPresentTooltip(formattedDate)}
      >{date.getDate()}</div>

    } else if (isHoliday) {

      return <div className="holiday" data-tip={getOccasion(formattedDate)}
        data-tooltip-id="my-tooltip" data-tooltip-content={getOccasion(formattedDate)}
      >{date.getDate()}</div>

    } else if (isAbsent) {
      return <div className="absent-day" data-tip={getOccasion(formattedDate)}
      >{date.getDate()}</div>
    } else if (isSunday) {
      return <div className='sunday'>
        {date.getDate()}
      </div>
    }

    else {
      return null; // For future dates with no special marking
    }
  };

  const isHoliday = (date) => {
    return holidaysData.some((holiday) => holiday.date === date);
  };

  const getOccasion = (date) => {
    const holiday = holidaysData.find((holiday) => holiday.date === date);
    return holiday ? holiday.name : '';
  };
  const getPresentTooltip = (date) => {
    const att = attendance[date];
    console.log("from calendar app", att)
    return att ? `${att.entry && `${att.entry.slice(0, 2)}:${att.entry.slice(3,5)}`}
     to ${att.exit ? `${att.exit.slice(0, 2)}:${att.exit.slice(3,5)}` : "not-marked"}
     (${calculateWorkingHours(att.entry, att.exit)})`
      : '';
  };

  // console.log(markdate, holidaysData)

  return (

    <div className="calendar">
      <div className="calendar-container">
        <div className="calendar-wrapper">
          {/* <UpcomingHolidays /> */}
          {
            markdate && (
              <Calendar
                value={new Date()}
                view={"month"}
                onActiveStartDateChange={onActiveStartDateChangeHandler}
                tileContent={tileContent}
              />

            )
          }
          <ReactTooltip effect="solid" id="my-tooltip" />
        </div>
      </div>
    </div>


  )
}

export default CalendarComponent