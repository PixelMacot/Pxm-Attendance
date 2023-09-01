import React, { useState, useEffect, useContext } from 'react'
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { HolidaysContext } from '../../context/HolidaysContext'
import moment from 'moment'
import { FaCalendarAlt, FaLocationArrow } from 'react-icons/fa';
import './showannouncement.scss'
import { AuthContext } from '../../context/AuthContext'

const ShowAnnouncement = () => {
    const [announcement, setAnnouncement] = useState()
    const [allannouncement, setAllAnnouncement] = useState()
    const { holidaysData, setHolidaysData, handleCsvData, fetchHolidays, flattenData, convertDataToCSV, convertDataToJSON } = useContext(HolidaysContext)
    const { userData } = useContext(AuthContext)

    const [msg, setMsg] = useState({
        successtxt: '',
        error: ''
    })
    const [datesallowed, setDatesAllowed] = useState({
        nextdays: '',
        prevdays: '',
    })
    console.log(holidaysData)
    useEffect(() => {
        datesAllowed().then(() => {
            fetchAnnouncement()
        })

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
    const datesAllowed = async () => {
        try {
            const collectionRef = collection(db, "datesallowed");
            const snapshot = await getDocs(collectionRef);
            const fetched_data = snapshot.docs.map((doc) => doc.data());
            console.log("datesallowed", fetched_data)
            setDatesAllowed({
                nextdays: fetched_data[0]['nextdays'],
                prevdays: fetched_data[0]['previousdays'],
            })
            console.log("dateallwoed", fetched_data[0]['previousdays'])
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
            if (totaldiff >= datesallowed.prevdays && totaldiff <= datesallowed.nextdays) {
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

    const currentday = moment(new Date()).format('DD-MM-YYYY')

    return (
        <div className=''>
            <div className="bg-cyan-900 rounded-xl">
                <div className="flex items-center text-white  text-2xl p-2 justify-center gap-4  w-full">
                    <FaCalendarAlt />
                    <h1 className=' font-semibold lg:font-bold text-center tracking-wider py-2'>
                        Notifications
                    </h1>
                </div>

                <div className='max-h-[400px] overflow-auto flex flex-col px-3'>

                    {
                        finalAnnouncement && finalAnnouncement.toReversed().map((item) => {
                            console.log(item.date)
                            return (

                                <div className="py-2">
                                    <div className={`bg-white p-2 rounded-md ${currentday == item.date ? 'currentday' : 'nottoday'}`} key={item.id}>
                                        <div className={`flex gap-2 items-center text-xs lg:text-sm  text-cyan-900 ${currentday == item.date ? 'currentday' : 'nottoday'} `}>
                                            <FaCalendarAlt />
                                            {item.date}
                                        </div>
                                        <div className="msg text-sm lg:text-lg text-[#4f4c4c]">
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