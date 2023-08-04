import React from 'react'
import './notallowed.scss'
import { Link } from 'react-router-dom'

const NotAllowed = () => {
    return (
        <div className='notallowed-container'>
            <div className="not-allowed-wrapper">
                <div className="mail-img-wrapper">
                    <img src="/notallowed.png" />               
                </div>
                <div className="not-allowed-content">
                    <p>You are not <span className='text-darkblue'>Allowed</span> in App </p>
                    <p><span className='text-darkblue'>Ask admin</span> to allow you in app</p>
                    {/* <Link to="/contact">
                    <button className='primary-button my-8'>Send Message</button>
                    </Link>        */}
                </div>
            </div>
        </div>
    )
}
export default NotAllowed