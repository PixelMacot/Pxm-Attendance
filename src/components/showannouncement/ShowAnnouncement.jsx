import React, { useState, useEffect, useContext } from 'react'
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import UpComingHolidays from '../upcomingholidays/UpcomingHolidays'
import { HolidaysContext } from '../../context/HolidaysContext'
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
        fetchHolidays()
    }, [])
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
   
    return (
        <div>
            <div className="">
                <h1 className='text-2xl font-bold text-center '>Announcement</h1>
                <ul className='flex flex-col gap-2 justify-center w-fit mx-auto my-2 border p-5'>

                    {
                        allannouncement && allannouncement.map((item) => {
                            return (
                                <div className="" key={item.id}>
                                    <div className="mgg">
                                        {item.msg}
                                    </div>

                                </div>

                            )
                        })
                    }
                </ul>
                <UpComingHolidays/>
            </div>
        </div>
    )
}

export default ShowAnnouncement