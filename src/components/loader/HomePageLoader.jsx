import React from 'react'
import './homeloader.css'
const HomePageLoader = () => {
    return (
        <div className="loader flex flex-col justify-center items-center py-60">
            {/* <img src="/loadericon.svg" alt="" /> */}
            <img src="/logo.png" alt="" className='w-[50%]'/>
            <div className="jumping-dots-loader"> <span></span> <span></span> <span></span> </div>
            <div className="moving-gradient"></div>
        </div>
    )
}

export default HomePageLoader