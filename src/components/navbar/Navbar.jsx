import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase';
import { getAuth, signOut } from "firebase/auth";
import { BiMenuAltRight, BiCopyAlt, BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs'
import { HiX } from 'react-icons/hi';
import { AiFillHome, AiOutlineUnorderedList, AiFillContacts,AiOutlineMail } from 'react-icons/ai'
import { AiOutlineFileProtect } from 'react-icons/ai'
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext'
import { RiEyeLine } from 'react-icons/ri';

const Navbar = () => {
  const navigate = useNavigate();
  const [logged, SetLogged] = useState(false)
  const [toggle, setToggle] = useState(true);
  const { currentUser, setCurrentUser, userData, getUserProfileData } = useContext(AuthContext)

  useEffect(() => {
    if (currentUser) {
      SetLogged(true)
    }
    return (() => {

    })
  }, [])

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("you have signed out succesfully")
      return navigate('/login')
      setCurrentUser('')
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <>
      <div className='p-2 fixed z-40  flex justify-between text-center items-center bg-[#FF4158]  shadow-sm w-full'>
        <div>
          <NavLink to='/'>
            <div className=''>
              <img
                src='/logo.svg'
                width='40'
                height='40'
                alt="PXM"
              />
            </div>
          </NavLink>
        </div>
        {
          logged && (
            <div className="mobile_navbar-menu  p-2 hover:cursor-pointer  order-2 ">
              <BiMenuAltRight onClick={() => setToggle(true)}
                className='text-2xl'
              />

            </div>
          )
        }
      </div>
      {/* mobile navigation  */}
      {toggle && (
        <motion.div
          transition={{ duration: 0.45, ease: 'easeOut' }}
          initial={{ width: 0 }} animate={{ width: 300 }}
          className='transition ease-in-out delay-150 duration-300 p-5 bg-cyan-900 fixed z-40 w-[70%] md:w-[60%] top-0 right-0 h-full'
        >
          <HiX onClick={() => setToggle(false)} className='text-white float-right text-3xl m-2 hover:cursor-pointer hover:text-red-500' />
          <ul className='my-10 flex flex-col gap-2 justify-evenly'>


            <li className='p-2 cursor-pointer font-semibold list-none'>
              <div onClick={() => setToggle(false)}
                className='flex gap-2 items-center text-white'
                style={{ listStyle: 'none' }}
              >
                <BsPersonFill />
                {logged ? userData.username : (
                  <NavLink to="/login">Login</NavLink>
                )}
              </div>
            </li>


            {
              [
                {
                  "title": "Home",
                  "NavLink": "/",
                  "icon": AiFillHome
                },
                {
                  "title": "Attendance",
                  "NavLink": "/attendancedashboard",
                  "icon": AiOutlineUnorderedList
                },
                {
                  "title": "Profile",
                  "NavLink": "/profile",
                  "icon": AiFillContacts
                },
                {
                  "title": "Team",
                  "NavLink": "/team",
                  "icon": AiOutlineFileProtect
                },
                {
                  "title": "Contact",
                  "NavLink": "/contact",
                  "icon": AiOutlineMail
                },
                {
                  "title": "Inbox",
                  "NavLink": "/inbox",
                  "icon": AiOutlineMail
                },
              ].map((item) => (
                <li key={item.title} className='p-2 text-white hover:text-pink-500  font-semibold list-none'>

                  <NavLink exact activeClassName="active" to={`${item.NavLink}`} onClick={() => setToggle(false)}
                    className='flex gap-2 items-center'
                    style={{ listStyle: 'none' }}
                  >
                    {<item.icon />}
                    {item.title}
                  </NavLink>
                </li>
              ))}
            {
              (userData.prevelege == "admin" ||  userData.prevelege == "superadmin") && (
                <li className='p-2 text-white hover:text-pink-500  font-semibold list-none'>
                  <NavLink to="/admin"
                    className='flex gap-2 items-center'
                  >
                    <AiOutlineFileProtect />
                    Admin
                  </NavLink>
                </li>
              )

            }
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

        </motion.div >

      )}
      <div className='h-[40px]'> </div>

    </>
  )
}

export default Navbar
