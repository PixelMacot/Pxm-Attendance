import React, { useState, useEffect, useContext } from 'react'
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import UpComingHolidays from '../upcomingholidays/UpcomingHolidays'
import { HolidaysContext } from '../../context/HolidaysContext'
import moment from 'moment'
import { FaCalendarAlt, FaLocationArrow } from 'react-icons/fa';

const ShowAnnouncement = () => {
    const [announcement, setAnnouncement] = useState()
    const [allannouncement, setAllAnnouncement] = useState()
    const { holidaysData, setHolidaysData, handleCsvData, fetchHolidays, flattenData, convertDataToCSV, convertDataToJSON } = useContext(HolidaysContext)
    const [msg, setMsg] = useState({
        successtxt: '',
        error: ''
    })

    useEffect(() => {
        fetchAnnouncement()
    }, [])

    useEffect(() => {
        if (holidaysData && allannouncement) {
            createFinalAnnouncement()
        }
    }, [allannouncement, holidaysData])

    const fetchAnnouncement = async () => {
        try {
            const collectionRef = collection(db, "announcement");
            const snapshot = await getDocs(collectionRef);
            const fetched_data = snapshot.docs.map((doc) => doc.data());
            setAllAnnouncement(fetched_data);
            //below function convert data into json
            console.log(fetched_data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    //holidays within a week
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
    // -----------------holidays end ----------------------

    //-----------merging holidays with announcements-------------

    const finalAnnouncement = []

    const createFinalAnnouncement = () => {
        const today = moment();

        allannouncement.map((ann) => {
            let anndate = moment(ann.date, 'DD-MM-YYYY')
            let totaldiff = anndate.diff(today, 'days');
            console.log(totaldiff)
            if (totaldiff >= 0) {
                finalAnnouncement.push({
                    date: ann.date,
                    msg: ann.msg,
                    link: ann.msg
                })
            }

        })
        next4Holidays.map((holiday) => {
            finalAnnouncement.push({
                date: holiday.date,
                msg: holiday.name,
                link: 'notprovided'
            })
        })
    }

    console.log('finalannouncemnt', finalAnnouncement)
    if (holidaysData && allannouncement) {
        createFinalAnnouncement()
    }
    finalAnnouncement.sort((a, b) => moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY')));



    return (
        <div className=''>
            <div className="bg-cyan-900 rounded-xl">
                <div className="flex items-center text-white  text-2xl p-2 justify-center gap-4  w-full">
                    <FaCalendarAlt />
                    <h1 className='font-bold text-center '>
                        Notifications
                    </h1>
                </div>

                <div className='max-h-[400px] overflow-auto flex flex-col   p-5 '>
                    
                    {
                        finalAnnouncement && finalAnnouncement.map((item) => {
                            console.log(item.date)
                            return (
                         
                                    <div className="py-2">
                                        <div className="bg-white p-2 rounded-md " key={item.id}>
                                            <div className='flex gap-2 items-center text-sm text-cyan-900'>
                                                <FaCalendarAlt />
                                                {item.date}
                                            </div>
                                            <div className="msg">
                                                {item.msg}
                                            </div>
                                        </div>
                                    </div>
                              
                            )
                        })
                    }
                </div>
                {/* <UpComingHolidays /> */}
            </div>
        </div>
    )
}

export default ShowAnnouncement