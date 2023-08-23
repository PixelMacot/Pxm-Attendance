import React, { useContext, useState } from 'react'
import { MessagesContext } from '../../context/MessageContext'
import { useParams, Navigate, Link } from 'react-router-dom';
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SingleMessage = () => {
  const { id } = useParams();
  const { messages, fetchMessages } = useContext(MessagesContext)
  const [msg, setMsg] = useState()
  console.log(messages)

  const DeleteMessage = async (e) => {
    e.preventDefault()
    let id = e.target.id
    console.log(id)
    await deleteDoc(doc(db, "messages", id)).then(() => {
      // setMsg('successfully deleted message')
      toast.success("successfully deleted message")
      fetchMessages()
    }).catch((err) => {
      // setMsg('A error occured while deleting message')
      toast.error(err)
    })
    return <Navigate to="/admin/message" />
  }

  return (
    <div>
      <ToastContainer/>
      <div className="flex flex-col justify-center w-[90%] lg:w-[50%] mx-auto gap-5 shadow-md p-5 mt-10">
        <Link to='/admin/message'>
          <div className="flex gap-2 items-center font-bold my-2">
            <img src='/goback.png' className='w-[20px]' />
            <p>Go Back</p>
          </div>
        </Link>
        {
          msg && (
            <p className='font-semibold text-lg text-cyan-700'>{msg}</p>
          )
        }
        <div className="name flex flex-col">
          <div className="flex gap-2 items-center">
            <img src='/user.png' alt='Name'/>
            {/* <p> Name</p> */}
          </div>
          <p className='text-cyan-900 font-semibold py-2'>{messages[id]?.name}</p>
        </div>
        <div className="name flex flex-col">
          <div className="flex gap-2 items-center">
            <img src='/messageicon.png' alt='Message'/>
            {/* <p> Name</p> */}
          </div>
          <p className='text-gray-600 leading-8 py-2'>
          {messages[id]?.message}
            </p>
        </div>
        {/* <div className="date">
          {messages[id].date}
        </div> */}

        {/* slug:{messages[id]?.slug} */}
        <button
          id={messages[id]?.slug}
          onClick={DeleteMessage}
          className='bg-red-700 text-white px-5 py-2 rounded-md'>Delete</button>

      </div>
    </div>
  )
}

export default SingleMessage