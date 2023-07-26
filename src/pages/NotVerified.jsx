import React from 'react'

const NotVerified = () => {
  return (
    <div className="">
      <div className="min-h-[70vh]">
        <div className="shadow-md p-2 ">
          <img src="/logo.png" alt="" className='w-[40%] md:w-[200px]' />
        </div>
        <div className="flex flex-col justify-center items-center my-20">
          <img src="/warning.png" alt="" className='w-[40%] md:w-[200px]' />
          <div>
            Verify Your Email proceed further
          </div>
        </div>

      </div>

    </div>
  )
}

export default NotVerified