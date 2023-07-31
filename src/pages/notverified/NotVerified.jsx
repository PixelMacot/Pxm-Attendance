import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/navbar/Navbar'
import { AuthContext } from '../../context/AuthContext'


const NotVerified = () => {
  const { emailSent,handleSendEmailVerification } = useContext(AuthContext)
  return (
    <div className="">
  
      <div className="min-h-[70vh]">
        {/* <div className="shadow-md p-2 ">
          <img src="/logo.png" alt="" className='w-[40%] md:w-[200px]' />
        </div> */}
        <div className="flex flex-col justify-center items-center my-20">
          <img src="/warning.png" alt="" className='w-[40%] md:w-[200px]' />
          <div>
            Verify Your Email proceed further
          </div>
          <div>
           {
            !emailSent ? (
              <button onClick={handleSendEmailVerification}
              className='my-5 bg-cyan-700 border px-5 py-2 text-white shadow-md rounded-md'
            >Send Link</button>
            ):(
              <div className="text-green-900 font-bold">A Link has been sent to verify your email</div>
            )
           }
          </div>
        </div>

      </div>

    </div>
  )
}

export default NotVerified