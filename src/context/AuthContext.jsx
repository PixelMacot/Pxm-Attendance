import { createContext, useEffect, useState } from "react";
import { auth ,db} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [userData, setUserData] = useState({})
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      getUserProfileData(user)
      console.log(user);
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
              console.log("Please update profile");
          }
      })
  
  }




  return (
    <AuthContext.Provider value={{ currentUser,userData ,getUserProfileData}}>
      {children}
    </AuthContext.Provider>
  );
};