import './sidenav.scss'
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from "firebase/auth";
import { BiMenuAltRight, BiLogOut, BiSolidGroup } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';
import { AiFillHome, AiOutlineUnorderedList, AiFillContacts, AiOutlineMail, AiOutlineClose } from 'react-icons/ai'
import { BsPersonFillCheck, BsPersonCircle } from 'react-icons/bs'
import { ImHome } from 'react-icons/im'
import { AiOutlineFileProtect } from 'react-icons/ai'
import { AuthContext } from '../../context/AuthContext'
import Avatar from '@mui/material/Avatar';

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

        }).catch((error) => {
            console.log("err signing out", error)
        });
    }

    function scrollTop() {
        window.scrollTo(0, 0)
    }

    return (
        <div className="">
            {
                !toggle && (
                    <div className='mobile-menu '>
                        <div className="menuicon"
                            onClick={() => setToggle(!toggle)}
                        >
                            <img src="/menuicon.svg" />

                        </div>

                        {
                            logged && (
                                <div className="open-mobile-menu"
                                    onClick={scrollTop}
                                >
                                    <BiMenuAltRight onClick={() => setToggle(!toggle)}
                                        className='open-mobile-menu'
                                    />

                                </div>
                            )
                        }

                    </div>

                )
            }
            <div className={`sideNav ${toggle ? 'open' : 'close'}`}>
                {
                    toggle && (
                        <div
                            className="close-mobile-menu"
                            onClick={() => setToggle(!toggle)}
                        ><HiX className='' />
                        </div>
                    )
                }

                <div>
                    <div className="sidenav-wrapper">
                        <div className="logo">
                            <img src='/logo.png' />
                        </div>
                        <div className="all-links-wrapper">
                            {
                                [
                                    {
                                        "title": "Home",
                                        "NavLink": "/",
                                        "icon": ImHome
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
                                        "icon": BiSolidGroup
                                    },
                                    {
                                        "title": "Contact",
                                        "NavLink": "/contact",
                                        "icon": AiOutlineMail
                                    },
                                ].map((item) => (
                                    <li key={item.title} className='navlist'>

                                        <NavLink to={`${item.NavLink}`} onClick={() => setToggle(false)}

                                            className={({ isActive }) => (isActive ? "navlink active" : 'navlink')}
                                            style={{ listStyle: 'none' }}
                                        >

                                            {<item.icon />}
                                            {item.title}

                                        </NavLink>
                                    </li>
                                ))}
                            {
                                (userData.prevelege == "admin" || userData.prevelege == "superadmin") && (
                                    <li className='navlist'>
                                        <NavLink to="/admin"
                                            className='navlink'
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
                                    <li className='navlist'
                                        onClick={handleSignOut}
                                    >
                                        <div onClick={() => setToggle(false)}
                                            className='navlink'
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
            <div className='android-menu '>
                {
                    [
                        {
                            "title": "Home",
                            "NavLink": "/",
                            "icon": ImHome
                        },
                        {
                            "title": "Attd",
                            "NavLink": "/attendancedashboard",
                            "icon": BsPersonFillCheck
                        },
                        {
                            "title": "Profile",
                            "NavLink": "/profile",
                            "icon": BsPersonCircle
                        },
                        {
                            "title": "Team",
                            "NavLink": "/team",
                            "icon": BiSolidGroup
                        },
                        {
                            "title": "Contact",
                            "NavLink": "/contact",
                            "icon": AiOutlineMail
                        },
                    ].map((item) => (
                        <li key={item.title} className='android-navlist'>

                            <NavLink to={`${item.NavLink}`} onClick={() => setToggle(false)}

                                className={({ isActive }) => (isActive ? "android-navlink active" : 'android-navlink')}
                                style={{ listStyle: 'none' }}
                            >

                                <span className="android-nav-icon">
                                    {<item.icon />}
                                </span>
                                <span className="android-nav-name">
                                    {item.title}
                                </span>

                            </NavLink>
                        </li>
                    ))}
            </div>
        </div>

    )
}

export default SideNav