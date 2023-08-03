import React from 'react'
import './notallowed.scss'

const NotAllowed = () => {
    return (
        <div className='notallowed-container'>
            <div className="not-allowed-wrapper">
                <div className="warning-img-wrapper">
                    <img src="/warning.png" />               
                </div>
                <div className="not-allowed-content">
                    <p>You are not allowed in App </p>
                    <p>Ask admin to allow you in app</p>
                </div>
            </div>
        </div>
    )
}
export default NotAllowed