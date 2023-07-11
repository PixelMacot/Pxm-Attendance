import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

import { BiMenuAltRight, BiCopyAlt, BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs'
import { HiX } from 'react-icons/hi';
import { AiFillHome, AiOutlineUnorderedList, AiFillContacts } from 'react-icons/ai'
import { GiPapers } from 'react-icons/gi'
import { motion } from 'framer-motion';

const Navbar = () => {
  const [logged, SetLogged] = useState(false)
  const [userData, setUserData] = useState({})
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        SetLogged(true)
        setUserData(user.toJSON())
        console.log(user.toJSON())
        // ...
        console.log("uid", uid)
      } else {
        console.log("no user logged in")
      }
    });

  }, [])

  const handleSignOut = () => {

  }
  return (
    <>
      <div className='p-2 fixed z-40  flex justify-between text-center items-center bg-white border-b-4 shadow-sm w-full'>
        <div>
          <NavLink href='/'>
            <div className=''>
              <img
                src='/logo.png'
                width='150'
                height='100'
                alt="PixelMascot"
              />
            </div>
          </NavLink>
        </div>
        <div className="mobile_navbar-menu  p-2 hover:cursor-pointer  order-2 ">
          <BiMenuAltRight onClick={() => setToggle(true)}
            className='text-2xl'
          />

        </div>
      </div>
      {/* mobile navigation  */}
      {toggle && (
        <motion.div
          transition={{ duration: 0.45, ease: 'easeOut' }}
          initial={{ width: 0 }} animate={{ width: 300 }}
          className='transition ease-in-out delay-150 duration-300 p-5 bg-gradient-to-r from-[#dd5a69] to-[#fa0421] fixed z-40 w-[70%] md:w-[60%] top-0 right-0 h-full'
        >
          <HiX onClick={() => setToggle(false)} className='text-white float-right text-3xl m-2 hover:cursor-pointer hover:text-red-500' />
          <ul className='my-10 flex flex-col gap-2 justify-evenly'>



            <li className='p-2 cursor-pointer hover:text-white  font-semibold list-none'>
              <div onClick={() => setToggle(false)}
                className='flex gap-2 items-center text-white'
                style={{ listStyle: 'none' }}
              >
                <BsPersonFill />
                {logged ? userData.displayName : (
                  <NavLink href="/login">Login</NavLink>
                )}
              </div>
            </li>


            {
              [
                {
                  "title": "Home",
                  "link": "/",
                  "icon": AiFillHome
                },
                {
                  "title": "Attendance",
                  "link": "/attendance",
                  "icon": AiOutlineUnorderedList
                },
                {
                  "title": "Profile",
                  "link": "/profile",
                  "icon": AiFillContacts
                }


              ].map((item) => (
                <li key={item.title} className='p-2 text-white hover:text-gray-100  font-semibold list-none'>

                  <NavLink href={`${item.link}`} onClick={() => setToggle(false)}
                    className='flex gap-2 items-center'
                    style={{ listStyle: 'none' }}
                  >
                    {<item.icon />}
                    {item.title}
                  </NavLink>
                </li>
              ))}
            {
              logged &&
              (
                <li className='p-2 cursor-pointer hover:text-cyan-700  font-semibold list-none'
                  onClick={handleSignOut}
                >
                  <div onClick={() => setToggle(false)}
                    className='flex gap-2 items-center text-white'
                    style={{ listStyle: 'none' }}
                  >
                    <BiLogOut />
                    Logout
                  </div>
                </li>
              )
            }
          </ul>

        </motion.div>

      )}
      <div className='h-[20px]'> </div>

    </>
  )
}

export default Navbar
