import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [userverified, setUserVerified] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [userData, setUserData] = useState({
    "username": "user",
    "position": "Web Developer",
    "skills": "Html Css ,Javascript,Webflow",
    "profileimg": "/avatar.png",
    "backgroundimg": "/profilebg.jpg",
    "prevelege": "employee",
    "dummyData": true,
    "status": false
  })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        getUserProfileData(user).then(() => {
          setUserDataLoading(false)
        }).catch((err) => {
          console.log("cant get user data")
        })

        if (user.emailVerified) {
          setUserDataLoading(false)
          setUserVerified(true)
          return <Navigate to="/" />
        }
        console.log(user);

      } else {
        console.log("user is not signed in")
        setUserDataLoading(false)
        return <Navigate to="/login" />

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

// Function to send email verification
  const handleSendEmailVerification = () => {
    const user = auth.currentUser;

    if (user) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          console.error('email verification sent');
          setEmailSent(true)
        })
        .catch((error) => {
          console.error('Error sending email verification link:', error);
        });
    } else {
      console.error('No user is currently signed in.');
    }


  };

//  This is for getting the device token for sending the notification 
  async function updateFcmToken(userData,Fcmtoken) {

    let docData = {
      uid: userData.uid,
      username: userData.username,
      token: Fcmtoken
    }
    console.log(docData)
    try {
      const docRef = doc(db, "notification", userData.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(doc(db, "notification", userData.uid), docData);
      } else {
        await setDoc(doc(db, "notification", userData.uid), docData);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


  return (
    <AuthContext.Provider value={{
      emailSent,
      userDataLoading,
      currentUser,
      userData,
      getUserProfileData,
      handleSendEmailVerification,
      userverified,
      updateFcmToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};