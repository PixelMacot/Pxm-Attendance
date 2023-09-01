// Sidebar.js
import React, { useState } from 'react';
import { FaCalendarAlt, FaLocationArrow } from 'react-icons/fa';
import { AiOutlineMessage, AiOutlineHome } from 'react-icons/ai'
import { Link } from 'react-router-dom';
import { BiSolidUpArrow, BiSolidDownArrow, BiSolidMapPin } from 'react-icons/bi'
import {HiOutlineSpeakerphone} from 'react-icons/hi'


const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative h-[60px]">

      {
        showMenu && (
          <div className=" fixed w-full z-10 px-5 pt-6 pb-2 mb-5 border border-gray-200 bg-cyan-700 text-white text-2xl lg:text-4xl border-r-2 flex items-center justify-between lg:justify-center "
          onClick={() => setShowMenu(!showMenu)}
          >
            <div className="flex gap-8 md:gap-10 lg:gap-20  items-center">
              <div className="">
                <Link to="/admin" className="">
                  <AiOutlineHome />
                </Link>
              </div>
              <div className="">
                <Link to="/admin/calendar" className="">
                  <FaCalendarAlt />
                </Link>
              </div>
              <div className="">
                <Link to="/admin/officelocation" className="">
                  <BiSolidMapPin />
                </Link>
              </div>
              <div className="">
                <Link to="/admin/createannouncement" className="">
                  <HiOutlineSpeakerphone/>
                </Link>
              </div>
              <div className="">
                <Link to="/admin/message" className="">
                  <AiOutlineMessage />
                </Link>
              </div>
            </div>
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="flex lg:absolute lg:right-4 px-2 ">
              <BiSolidUpArrow />
            </div>
          </div>
        )
      }
      {
        !showMenu && (
          <div className="fixed border z-30 text-cyan-700 text-4xl  bg-cyan-700 rounded-md w-full h-[20px] my-2 ">
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="relative top-1 left-1 flex justify-end  ">
              <BiSolidDownArrow />
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Sidebar;
