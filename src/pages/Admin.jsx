import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from '../firebase';
import { auth } from '../firebase';
import { storage } from "../firebase";

const Admin = () => {
    //send user to login page when user not logged in
    const [usersData, setUsersData] = useState({})

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user successfully signed in")
                getUsersData()
            } else {
                console.log("user is logged out")
            }
        });
    }, [])
    let obj = []
    //function to post profile data into cloud firestore
    const getUsersData = async () => {
        const colRef = collection(db, "users");
        const docsSnap = await getDocs(colRef);
        
        docsSnap.forEach(doc => {

            // Object.keys(doc.data()).map((item) => {
            //     // console.log(jsonp[item])
            //     Arr.push(item)
            //     console.log(doc.data()[item])
            //   })
            obj.push(doc.data())
        })
        setUsersData(obj)
console.log(obj)
    }
    // console.log(Arr)
    return (
        <div className="min-h-[100vh]">
           ADMIN PANEL
        </div>
    )
}

export default Admin