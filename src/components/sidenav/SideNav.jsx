
import './sidenav.scss'
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase';
import { getAuth, signOut } from "firebase/auth";
import { BiMenuAltRight, BiCopyAlt, BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs'
import { HiX } from 'react-icons/hi';
import { AiFillHome, AiOutlineUnorderedList, AiFillContacts, AiOutlineMail, AiOutlineClose } from 'react-icons/ai'
import { AiOutlineFileProtect } from 'react-icons/ai'
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext'
import { RiEyeLine } from 'react-icons/ri';

const SideNav = () => {
    const navigate = useNavigate();
    const [logged, SetLogged] = useState(false)
    const [toggle, setToggle] = useState(false);
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

        <div className="sticky bottom-0">
            {
                !toggle && (
                    <div className='mobilemenu lg:hidden flex justify-between fixed p-4 bg-white shadow-md w-full z-60'>
                        <img src='/logo.png'
                            className='w-[200px]'
                        />
                        <p
                            onClick={() => setToggle(!toggle)}
                        >open</p>
                    </div>
                )
            }

            <div className={`sideNav ${toggle ? 'open' : 'close'}`}>
                {
                    toggle && (
                        <div
                            className="hover:text-red-500 lg:hidden cursor-pointer text-2xl solid red absolute right-8 top-4 float-right"
                            onClick={() => setToggle(!toggle)}
                        ><HiX className='float-right' />
                        </div>
                    )
                }
                <div
                    className='flex flex-col gap-2 w-fit text-xl '>
                    <div className="sidenav-wrapper p-4">
                        <div className="logo">
                            <img src='/logo.png'
                                className='w-[200px]'
                            />

                        </div>
                        <div className="all-links-wrapper  flex flex-col  text-xl">
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
                                    <li key={item.title} className='p-2 font-semibold list-none my-4'>

                                        <NavLink to={`${item.NavLink}`} onClick={() => setToggle(false)}

                                            className={({ isActive }) => (isActive ? "flex gap-2 items-center active" : 'flex gap-2 items-center ')}
                                            style={{ listStyle: 'none' }}
                                        >
                                          
                                                {<item.icon />}
                                                {item.title}
                                       
                                        </NavLink>
                                    </li>
                                ))}
                            {
                                (userData.prevelege == "admin" || userData.prevelege == "superadmin") && (
                                    <li className='p-2 font-semibold list-none my-4'>
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
                                    <li className='p-2 my-4 cursor-pointer hover:text-cyan-700  font-semibold list-none'
                                        onClick={handleSignOut}
                                    >
                                        <div onClick={() => setToggle(false)}
                                            className='flex gap-2 items-center '
                                            style={{ listStyle: 'none' }}
                                        >
                                            <BiLogOut />
                                            Logout
                                        </div>
                                    </li>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SideNav