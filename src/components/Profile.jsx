import React, { useState, useEffect } from 'react';
import './profile.css'
import Avatar from '@mui/material/Avatar';
// import {IoBagSharp} from 'react-icons/io'
import { FaSuitcase } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai'
import moment from 'moment';

const Profile = ({ userData, markAttendance, show, datearr }) => {
    const [currentDate, setCurrentDate] = useState(moment(new Date()).format("DD-MM-YYYY"))
    const [showattendancebtn,setShowAttendancebtn] = useState(true)
    useEffect(()=>{
        // setShowAttendancebtn(show)
       if(datearr){
        checkCurrentDayPresent(show)
       }else{
        setShowAttendancebtn(show)
       }
    },[datearr])
   
    const checkCurrentDayPresent = (show) => {
        let today = datearr.filter((date) => {
            console.log(date, currentDate)
            return date == currentDate
        })
        console.log(today.length)
        if(today.length>0){
            setShowAttendancebtn(false)
        }else{
            setShowAttendancebtn(true)
        }
    }
    
    console.log("profile page btn", show)
    
    return (
        <>
            <div className="w-[90%] mx-auto rounded-md shadow-md flex flex-col gap-10  py-5">

                <div
                    style={{ backgroundImage: userData.backgroundimg ? `url('${userData.backgroundimg}')` : `url('/profilebg.jpg')` }}
                    className={`bg-[url('${userData.backgroundimg}')] h-[100px] md:h-[200px] w-full bg-cover rounded-t-md`}>
                </div>

                <div className="p-5">

                    <div className="flex flex-col  gap-10">
                        <div className="avatar border-[3px] border-white w-[120px] h-[130px] md:w-[170px] md:h-[180px] rounded-full  -mt-36 lg:-mt-44">
                            <Avatar
                                alt={userData.username}
                                src={userData.profileimg ? userData.profileimg : "/boyavatar.png"}
                                sx={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="text-center text-xl md:text-2xl font-bold w-fit">
                                <span>{userData.username ? userData.username : "Username"}</span>
                            </div>
                            <div className="flex flex-row items-center gap-2 text-center text-sm md:text-lg text-gray-600 w-fit">
                                <FaSuitcase />
                                <span>{userData.position ? userData.position : "Web Developer"}</span>
                            </div>
                            <div className="flex flex-row items-center gap-2 text-center text-sm md:text-lg text-gray-600 break-words w-fit">
                                <AiFillSetting />
                                <span>{userData.skills ? userData.skills : "Html Css"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mark w-full my-5">
                        <form className='flex gap-2'>
                            {
                                userData.dummyData ? (
                                    " update profile to Mark attendance"
                                ) : (
                                    <button
                                        onClick={markAttendance}
                                        className='w-fit text-center  text-sm md:text-lg shadow-md p-2 bg-cyan-800 rounded-md text-white'
                                        style={{ display: showattendancebtn ? 'flex' : 'none' }}
                                    >Mark Attendance</button>)
                            }
                            {/* <button
                                onClick={markAttendance}
                                className='w-fit text-center font-bold text-xl shadow-md px-5 py-2 border-2 border-cyan-400 rounded-md text-black'
                            >Apply for Leave</button> */}
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Profile