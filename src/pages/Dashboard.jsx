import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

//react icons
import { CiTextAlignCenter } from 'react-icons/ci';
import { AiOutlineMail } from 'react-icons/ai';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({})
    const [file, setFile] = useState("");
    // Handles input change event and updates state
    const [photourl, setPhotoUrl] = useState("/boyavatar.png")
    const [percent, setPercent] = useState(0);
    //send user to login page when user not logged in
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                const uid = user.uid;
                setUserData(user.toJSON())
                console.log("user successfully signed in")
                
            }else{
                console.log("user is logged out")
            }
        });

    }, [])

    //image upload
    function handleImageChange(event) {
        setFile(event.target.files[0]);
        handleImageUpload(event)
    }
    const updateUserProfile = (url) => {
        updateProfile(auth.currentUser, {
            photoURL: url
        }).then(() => {
            alert("profile Updated sucessfully")
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleImageUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please upload an image first!");
            return
        }

        const storageRef = ref(storage, `/files/${file.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percent);


            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setPhotoUrl(url)

                    updateUserProfile(url)

                });
            }
        );


    };
    return (
        <main >
            <section>
                <div>
                    <div className='w-[90%] md:w-[60%] lg:w-[40%] mx-auto shadow-lg rounded-sm p-5 my-5'>
                        <form className='flex flex-col items-center'>

                            {/* //image upload functionality */}
                            <div className=''>
                                <label for="profileimage" className='hover:cursor-pointer'>
                                    {<img src={userData.photoURL ? userData.photoURL : photourl} className='rounded-full w-[200px] h-[200px] border' />}
                                </label>
                                <input type="file"
                                    onChange={handleImageChange}
                                    accept="/image/*"
                                    title="Choose a video please"
                                    id='profileimage'
                                    className='hidden'
                                />
                                {/* //show percentage of image upload  */}
                                {/* <p>{percent} "% done"</p> */}
                            </div>

                            {/* //user details functionality */}
                            <div className='flex flex-col items-start p-5 gap-4 '>
                                <div className="flex flex-row items-center gap-2  rounded-md">
                                    <div><CiTextAlignCenter /></div>
                                    <div className=' px-2 w-full'>{userData.displayName}</div>
                                </div>
                                <div className="flex flex-row items-center gap-2  rounded-md">
                                    <div><AiOutlineMail /></div>
                                    <div className=' px-2 w-full'>{userData.email}</div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Dashboard