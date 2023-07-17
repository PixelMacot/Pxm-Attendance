import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from '../firebase';
import { auth } from '../firebase';
import { storage } from "../firebase";
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate } from 'react-router-dom';
//React icons
import { FaSuitcase } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai'
import CalendarApp from '../components/CalendarApp';
// import { useNavigate } from 'react-router-dom';

const Admin = () => {
    //send user to login page when user not logged in
    const [attendance, setAttendance] = useState("dummy")
    const [markdate, setMarkDate] = useState()
    const [usersData, setUsersData] = useState({})
    const [viewattendance, setViewAttendance] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user successfully signed in")
                getUsersData()

            } else {
                console.log("user is logged out")
                navigate('/login')
            }
        });
    }, [])

    const viewAttendance = (e) => {
        let userid = e.target.id
        if (userid == "notfound") {
            console.log("update profile to see attendance")
        } else {
            getAttendanceData(userid)
        }
        console.log(userid)
    }

    //user data
    let obj = []
    //function to post profile data into cloud firestore
    const getUsersData = async () => {
        const colRef = collection(db, "users");
        const docsSnap = await getDocs(colRef);

        docsSnap.forEach(doc => {
            obj.push(doc.data())
        })
        setUsersData(obj)
        console.log(obj)
    }


    //attendance data


    // getting Attendance data from cloud firestore 
    const getAttendanceData = async (useruid) => {
        // console.log("getattendance data function called", user.uid)
        getDoc(doc(db, "attendance", useruid)).then(docSnap => {

            if (docSnap.exists()) {
                // console.log("Document data:", JSON.stringify(docSnap.data()));
                setAttendance(JSON.stringify(docSnap.data()))
                markdatefunction()
            } else {
                console.log("No such document!");
            }

        })

    }

    //array of present days of user
    let dateMarkArr = []
    //function to push the present days into mark state
    const markdatefunction = () => {
        // console.log("markdatefunction() called")
        if (attendance.length > 6) {
            let jsonp = JSON.parse(attendance)
            Object.keys(jsonp).map((item) => {
                // console.log(jsonp[item]) ->it will print single object 
                dateMarkArr.push(item)
            })
            // console.log(dateMarkArr)
            setMarkDate(dateMarkArr)
        }
        //push into array dates
        const markdates = () => {
            console.log(markdates.length)
        }
    }

    return (
        <div className="min-h-[100vh]">
            <div className="flex flex-row flex-wrap items-center justify-center gap-10 rounded-md">
                {


                    usersData.length > 2 && (
                        // console.log(Object.entries(usersData))

                        (Object.entries(usersData)).map(user => {
                            console.log(user[1].username)
                            return (


                                <div className="shadow-md rounded-md w-[350px]">
                                    <div
                                        style={{ backgroundImage: user[1].backgroundimg ? `url('${user[1].backgroundimg}')` : `url('/profilebg.jpg')` }}
                                        className={`bg-[url('${user[1].backgroundimg}')] h-[100px] w-full bg-cover rounded-t-md`}>
                                    </div>


                                    <div className="px-5 pb-5">
                                        <div className="avatar border-[3px] border-white w-[100px] h-[100px]  rounded-full  -mt-8 md:-mt-12">
                                            <Avatar
                                                alt={user[1].username}
                                                src={user[1].profileimg ? user[1].profileimg : '/boyavatar.png'}
                                                sx={{ width: '100%', height: '100%' }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="text-center text-lg font-bold w-fit">
                                                <span>{user[1].username ? user[1].username : "Username"}</span>
                                            </div>
                                            <div className="flex flex-row items-center gap-2 text-center text-sm  text-gray-600 w-fit">
                                                <FaSuitcase />
                                                <span>{user[1].position ? user[1].position : "Web Developer"}</span>
                                            </div>
                                            <div className="flex flex-row items-center gap-2 text-center text-sm  text-gray-600 break-words w-fit">
                                                <AiFillSetting />
                                                <span>{user[1].skills ? user[1].skills : "Html Css"}</span>
                                            </div>
                                            <Link to={`/attendance/${user[1].uid ? user[1].uid : "notfound"}`}>
                                                <button
                                                    id={user[1].uid ? user[1].uid : "notfound"}
                                                    onClick={viewAttendance}
                                                    className='w-fit text-center  text-sm my-2 shadow-md p-2 bg-cyan-800 rounded-md text-white'
                                                >
                                                    View Attendance
                                                </button>
                                            </Link>
                                            
                                        </div>
                                    </div>
                                </div>

                            )

                        })

                    )


                }
            </div>
        </div>
    )
}

export default Admin