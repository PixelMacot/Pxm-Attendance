import React from 'react'
import './profile.css'
import Avatar from '@mui/material/Avatar';


const Profile = ({ userData }) => {
    return (
        <>
            <div className=" w-[90%] mx-auto rounded-md shadow-md flex flex-col gap-10  py-5">
                <div className="bg-[#ff445a9e] h-[100px] lg:h-[150px] w-full rounded-md"></div>
                <div className="   p-5 flex flex-col  gap-10">
                    <div className="avatar border-[3px] border-white w-[120px] h-[130px] md:w-[170px] md:h-[180px] rounded-full  -mt-36 lg:-mt-44">
                    <Avatar
                        alt={userData.displayName}
                        src={userData.photoURL}
                        sx={{ width: '100%', height: '100%' }}
                    />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="text-center text-2xl font-bold w-fit">
                            <span>{userData.displayName}</span>
                        </div>
                        <div className="flex flex-row gap-2 text-center text-xl text-gray-600 w-fit">
                            <img src='/developer.png' 
                            className='w-[25px] rounded-full'
                            />
                            <span>Web Developer</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile