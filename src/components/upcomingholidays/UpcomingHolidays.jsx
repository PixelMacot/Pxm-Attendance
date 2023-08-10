import React, { useContext } from 'react';
import { HolidaysContext } from '../../context/HolidaysContext'
import moment from 'moment'

const UpcomingHolidays = ({ holidays }) => {

    const { holidaysDataLoading, holidaysData, setHolidaysData, handleCsvData, fetchHolidays, flattenData, convertDataToCSV, convertDataToJSON } = useContext(HolidaysContext)

    const today = moment();
    const currentMonth = today.format('MM'); // Get current month in MM format
    const currentYear = today.format('YYYY'); // Get current year in YYYY format

    const upcomingHolidays = holidaysData.filter(holiday => {
        if (!holiday.date) return false; // Exclude null dates
        const holidayDate = moment(holiday.date, 'DD-MM-YYYY');
        const daysUntilHoliday = holidayDate.diff(today, 'days');
        return daysUntilHoliday >= 0 && daysUntilHoliday <= 7;
    });

    upcomingHolidays.sort((a, b) => moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY')));

    const next4Holidays = upcomingHolidays.slice(0, 4);
    console.log(upcomingHolidays)
    return (
        <div>
            <h2>Upcoming Holidays</h2>
            <ul>
                {next4Holidays.map((holiday, index) => (
                    <li key={index}>
                        {holiday.date} - {holiday.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default UpcomingHolidays;
