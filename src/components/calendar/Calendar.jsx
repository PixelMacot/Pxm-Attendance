import React, { useEffect, useState, useContext } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.scss'
import moment from 'moment';
import { CalendarContext } from '../../context/CalendarContext'
import { HolidaysContext } from '../../context/HolidaysContext'

 


const CalendarComponent = () => {
  const { currentMonth, setCurrentMonth, markdate,} = useContext(CalendarContext)
  const {holidaysData} = useContext(HolidaysContext)

  const onActiveStartDateChangeHandler = ({ activeStartDate, value, view }) => {
    // console.log("vv:", activeStartDate, value, view);
    setCurrentMonth(moment(activeStartDate).format("DD-MM-YYYY"))
  };
  const tileContent = ({ date }) => {
    const formattedDate = moment(date).format("DD-MM-YYYY")

    // Check if the date is present or a holiday
    const isPresent = markdate.includes(formattedDate);
    const isHoliday = holidaysData.some((holiday) => holiday.date === formattedDate);

    const currentDate = new Date();
    const isPastDate = date < currentDate;

    const isSunday = date.getDay() === 0; // 0 is Sunday
    // Define the content for different date types
    const isAbsent = !isPresent && !isHoliday && !isSunday && date < currentDate;
    // Check if the date is a Sunday

    // Define the content for different date types
    if (isPresent) {
      return <div className="present-day" data-tip={getOccasion(formattedDate)}
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

    // if (isHoliday(formattedDate)) {
    //   // console.log("holiday date", formattedDate)
    //   return <div className="holiday-mark yellow-date" data-tip={getOccasion(formattedDate)}
    //     data-tooltip-id="my-tooltip" data-tooltip-content={getOccasion(formattedDate)}
    //   ></div>;
    // }

    return null;
  };

  const isHoliday = (date) => {
    return holidaysData.some((holiday) => holiday.date === date);
  };

  const getOccasion = (date) => {
    const holiday = holidaysData.find((holiday) => holiday.date === date);
    return holiday ? holiday.name : '';
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