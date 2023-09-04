import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'
import './notverified.scss'

const NotVerified = () => {
  const { emailSent, handleSendEmailVerification } = useContext(AuthContext)
  return (
    <section className='verify-mail-section'>
      <div className="verify-mail-container">

        <div className="verify-mail-wrapper">


          <div className="mail-img-wrapper">
            <img src="/verifymail.jpg" />
          </div>
          <div className="verifymail-heading-btn">
            <div>
              Verify Your Email proceed further
            </div>
            <div>
              {
                !emailSent ? (
                  <button onClick={handleSendEmailVerification}
                    className='my-5 bg-cyan-700 border px-5 py-2 text-white shadow-md rounded-md'
                  >Send Link</button>
                ) : (
                  <div className="text-green-900 font-bold">A Link has been sent to verify your email</div>
                )
              }
              
            </div>
          </div>


        </div>

      </div>
    </section>
  )
}

export default NotVerified