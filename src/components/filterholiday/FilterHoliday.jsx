import React,{useState,useContext} from 'react'
import { HolidaysContext } from '../../context/HolidaysContext'
import moment from 'moment'


const FilterHolidays = () => {
    const { holidaysData } = useContext(HolidaysContext)
    const currentDate = moment(new Date()).format("DD-MM")
    console.log(currentDate)
    const filteredHolidays = holidaysData.filter((holiday) => holiday.Date === currentDate);
    console.log(filteredHolidays)


  return (
    <div>FilterHoliday</div>
  )
}

export default FilterHolidays