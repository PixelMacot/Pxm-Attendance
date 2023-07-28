import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './holiday.css';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import moment from 'moment';
import ExcelJson from '../components/ExcelJson';
import { HolidaysContext } from '../context/HolidaysContext'
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';

const Pages = () => {
  const { holidaysData, setHolidaysData } = useContext(HolidaysContext)

  const tileContent = ({ date }) => {
    const formattedDate = moment(date).format("DD-MM-YYYY")
    console.log("holidaysData", holidaysData)
    if (isHoliday(formattedDate)) {
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

  return (
    <div>
      <Calendar
        tileContent={tileContent}
        tileClassName={({ date, view }) => {
          if (holidaysData.find(x => x.date === moment(date).format("DD-MM-YYYY"))) {
            return 'yellowDate'
          }
        }}
      />
      <ReactTooltip effect="solid" id="my-tooltip" />
      <ExcelJson />

    </div>
  );
};

export default Pages;
