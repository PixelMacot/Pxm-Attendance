import React from 'react'

const Pages = () => {
  return (
   <div className="min-h-[70vh]">
    <div className="">
        <div className="addholidays p-10 flex flex-col gap-10 justify-center items-center">
            <h2>Add Holidays</h2>
            <form className='flex flex-col gap-4'>
                <div className="flex flex-col gap-2 ">
                <label>choose Date</label>
                <input type="date"
                className="border rounded-md p-2"
                />
                </div>
                <div className="flex flex-col gap-2 ">
                <label>comment</label>
                <input type="text"
                className="border rounded-md p-2"
                placeholder='Dusshera'
                />
                </div>
                <button className='border rounded-md w-fit px-10 py-2 mx-auto bg-cyan-800 text-white'>Add</button>
            </form>
        </div>
    </div>
   </div>
  )
}

export default Pages