import React, { useContext } from 'react'
import { MessagesContext } from '../../context/MessageContext'
import { useParams } from 'react-router';

const SingleMessage = () => {
  const { id } = useParams();
  const { messages, fetchMessages } = useContext(MessagesContext)
  console.log(messages)
  return (
    <div>
      <div className="flex flex-col justify-center w-fit mx-auto gap-5 shadow-md p-5 mt-10">
        <div className="name">
          {messages[id].name}
        </div>
        <div className="date">
          {messages[id].date}
        </div>
        <div className="message">
          {messages[id].message}
        </div>
        <div className="reply">
          <form
            className='border p-2 rounded-md '
          >
            <input
              className='focus:outline-none '
            />
            <button className='px-6 pr-0 bg-cyan7500'>send</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SingleMessage