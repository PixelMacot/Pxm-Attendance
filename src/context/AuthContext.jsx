import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [userverified, setUserVerified] = useState(false)
  const [userData, setUserData] = useState({
    "username": "user",
    "position": "Web Developer",
    "skills": "Html Css ,Javascript,Webflow",
    "profileimg": "/boyavatar.png",
    "backgroundimg": "/profilebg.jpg",
    "dummyData": true
  })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        getUserProfileData(user)
        if (user.emailVerified) {
          setUserVerified(true)
        }
        console.log(user);
      }else{
        console.log("user is not signed in")
      }
    });

    return () => {
      unsub();
    };
  }, []);

  //function to post profile data into cloud firestore
  const getUserProfileData = async (user) => {
    // console.log("getattendance data function called", user.uid)
    getDoc(doc(db, "users", user.uid)).then(docSnap => {

      if (docSnap.exists()) {
        console.log("Document data:", JSON.stringify(docSnap.data()));
        setUserData(docSnap.data())

      } else {
        console.log("can't get data of profile update profile to fetch latest data");
      }
    })

  }

  const handleSendEmailVerification = () => {
    const user = auth.currentUser;

    if (user) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          console.error('email verification sent');
        })
        .catch((error) => {
          console.error('Error sending email verification link:', error);
        });
    } else {
      console.error('No user is currently signed in.');
    }


  };



  return (
    <AuthContext.Provider value={{ currentUser, userData, getUserProfileData, handleSendEmailVerification, userverified }}>
      {children}
    </AuthContext.Provider>
  );
};