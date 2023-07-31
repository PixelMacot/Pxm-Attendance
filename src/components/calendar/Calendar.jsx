import React, { useEffect, useState, useContext } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.scss'
import moment from 'moment';
import { CalendarContext } from '../../context/CalendarContext'
import { HolidaysContext } from '../../context/HolidaysContext'



const CalendarComponent = () => {
  const { currentMonth, setCurrentMonth, markdate, setCurrentMonthPresentDays } = useContext(CalendarContext)
  const { holidaysDataLoading, holidaysData, setHolidaysData, handleCsvData, fetchHolidays, flattenData, convertDataToCSV, convertDataToJSON } = useContext(HolidaysContext)
  const [presentdays, setPresentDays] = useState(0)
  // const [currentMonth, setCurrentMonth] = useState(moment(new Date()).format("DD-MM-YYYY"))
  const [filtereddays, setFilteredDays] = useState(0)
  let currentDate = currentMonth.slice(3, 10)

  const countDays = () => {
    let pday = markdate.filter((date) => {
      // console.log(date.slice(3, 10), currentDate)
      return date.slice(3, 10) == currentDate
    })
    // console.log(pday.length)

    setFilteredDays([...new Set(pday)].sort())
    setCurrentMonthPresentDays([...new Set(pday)].sort())
    setPresentDays(filtereddays.length)
  }

  const onActiveStartDateChangeHandler = ({ activeStartDate, value, view }) => {
    // console.log("vv:", activeStartDate, value, view);
    setCurrentMonth(moment(activeStartDate).format("DD-MM-YYYY"))
  };


  const tileContent = ({ date }) => {
    const formattedDate = moment(date).format("DD-MM-YYYY")
    // console.log("holidaysData", isHoliday(formattedDate))
    if (isHoliday(formattedDate)) {
      // console.log("holiday date", formattedDate)
      return <div className="holiday-mark yellow-date" data-tip={getOccasion(formattedDate)}
        data-tooltip-id="my-tooltip" data-tooltip-content={getOccasion(formattedDate)}
      ></div>;
    }

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
          {
            markdate && (
              <Calendar
                value={new Date()}
                view={"month"}
                onActiveStartDateChange={onActiveStartDateChangeHandler}
                tileContent={tileContent}
                tileClassName={({ date, view }) => {
                  if (markdate.find(x => x === moment(date).format("DD-MM-YYYY"))) {
                    return 'greencolor'
                  } else {
                    if (holidaysData.find(x => x.date === moment(date).format("DD-MM-YYYY"))) {
                      return 'yellowDate'
                    }
                  }
                }}
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