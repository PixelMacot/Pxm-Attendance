import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from '../../firebase';
import { auth } from '../../firebase';
import {useNavigate } from 'react-router-dom';

// import { useNavigate } from 'react-router-dom';
import Profile from '../../components/profile/Profile';

const Team = () => {
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
            console.log(doc.data())
        })
        setUsersData(obj)
        // console.log(usersData)
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
        <div className="min-h-[100vh] py-10">
            <div className="flex flex-row flex-wrap items-center justify-center gap-10 rounded-md">
                {
                    usersData && (
                        (Object.entries(usersData)).map(user => {
                            // console.log("user",user)
                            return (
                               <div className='w-[320px] md:w-[400px] border-b border-l border-r rounded-md'>
                                 <Profile userData = {user[1]} />
                               </div>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}

export default Team