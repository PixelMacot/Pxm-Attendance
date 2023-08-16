import React, { useContext, useState } from 'react'
import { MessagesContext } from '../../context/MessageContext'
import { useParams,Navigate,Link} from 'react-router-dom';
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';

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
      setMsg('successfully deleted message')  
      fetchMessages()    
    }).catch((err) => {
      setMsg('A error occured while deleting message')
    })
    return <Navigate to="/admin/message" />
  }

  return (
    <div>
      <div className="flex flex-col justify-center w-[90%] lg:w-[50%] mx-auto gap-5 shadow-md p-5 mt-10">
        <Link to='/admin/message'>
        <p>Go Back</p>
        </Link>
        {
          msg && (
            <p className='font-semibold text-lg text-cyan-700'>{msg}</p>
          )
        }
        <div className="name flex flex-col">
          <p> Name</p>
          {messages[id]?.name}
        </div>
        {/* <div className="date">
          {messages[id].date}
        </div> */}
        <div className="message flex flex-col">
          <p>Message</p>
          {messages[id]?.message}
        </div>
        slug:{messages[id]?.slug}
        <button
          id={messages[id]?.slug}
          onClick={DeleteMessage}
          className='bg-red-700 text-white px-5 py-2 rounded-md'>Delete</button>

      </div>
    </div>
  )
}

export default SingleMessage