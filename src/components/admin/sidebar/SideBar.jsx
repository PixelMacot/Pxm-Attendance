import React from 'react'
import './sidebar.scss'
import { menu } from '../../../data'
import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
    <div className="menu min-h-[70vh]">

      {
        menu.map((item) => (
          <div className="item" key={item.id}>
            <span className="d-none hidden">{item.title}</span>

            {item.listItems.map((listItem) => (
              <Link className='listItem' to={listItem.url} key={listItem.id}>
                <img src={listItem.icon} alt="" />
                <span className="hidden md:flex">{listItem.title}</span>
              </Link>
            ))}


          </div>
        ))
      }

    </div>
  )
}

export default Sidebar