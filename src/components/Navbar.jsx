import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { getAuth, signOut } from "firebase/auth";
import { BiMenuAltRight, BiCopyAlt, BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs'
import { HiX } from 'react-icons/hi';
import { AiFillHome, AiOutlineUnorderedList, AiFillContacts } from 'react-icons/ai'
import { AiOutlineFileProtect} from 'react-icons/ai'
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
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      alert("you have signed out succesfully")
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <>
      <div className='p-2 fixed z-40  flex justify-between text-center items-center bg-white border-b-4 shadow-sm w-full'>
        <div>
          <Link to='/'>
            <div className=''>
              <img
                src='/logo.png'
                width='150'
                height='100'
                alt="PixelMascot"
              />
            </div>
          </Link>
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
                {logged ? userData.displayName : (
                  <Link to="/login">Login</Link>
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
                  "title": "Dashboard",
                  "link": "/dashboard",
                  "icon": AiFillContacts
                },
                {
                  "title": "Admin",
                  "link": "/admin",
                  "icon": AiOutlineFileProtect
                }


              ].map((item) => (
                <li key={item.title} className='p-2 text-white hover:text-pink-500  font-semibold list-none'>

                  <Link to={`${item.link}`} onClick={() => setToggle(false)}
                    className='flex gap-2 items-center'
                    style={{ listStyle: 'none' }}
                  >
                    {<item.icon />}
                    {item.title}
                  </Link>
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
      <div className='h-[60px]'> </div>

    </>
  )
}

export default Navbar
