import React, { useState, useEffect, useContext } from 'react';
// import './profile.css'
import Avatar from '@mui/material/Avatar';
import { FaSuitcase } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai'
import { Link } from 'react-router-dom';


const Profile = ({ userData }) => {

    return (
        <>
            <div className="flex flex-col gap-10  pb-5">
                <div
                    style={{ backgroundImage: userData.backgroundimg ? `url('${userData.backgroundimg}')` : `url('/profilebg.jpg')` }}
                    className={`bg-[url('${userData.backgroundimg}')] h-[100px] md:h-[200px] w-full bg-cover rounded-t-md`}>
                </div>
                <div className="p-5">
                    <div className="flex flex-col  gap-10">
                        <div className="avatar border-[3px] border-white w-[130px] h-[130px] md:w-[180px] md:h-[180px] rounded-full  -mt-36 lg:-mt-44">
                            <Avatar
                                alt={userData.username}
                                src={userData.profileimg != 'notprovided' ? userData.profileimg:userData.gender=='male'?'/boyavatar.png':'/girlavatar.png'}
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
                            <div className="flex flex-row items-center gap-2  text-sm md:text-lg text-gray-600 break-words w-fit">
                                <AiFillSetting />
                                <span>{userData.skills ? userData.skills : "Html Css"}</span>
                            </div>
                            {
                                userData.dummyData && (
                                    <div className="text-cyan-700 font-bold">
                                        <Link to="/profile"> Update your profile</Link>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Profile