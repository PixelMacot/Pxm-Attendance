import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import CalendarApp from '../components/CalendarApp';
//react icons
import { CiTextAlignCenter } from 'react-icons/ci';
import { AiOutlineMail } from 'react-icons/ai';
import Loader from '../components/Loader';
import Quotes from '../components/Quotes';


const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({})
    const [file, setFile] = useState();
    const [loader, setLoader] = useState(false)
    // Handles input change event and updates state
    const [photourl, setPhotoUrl] = useState("/boyavatar.png")
    const [percent, setPercent] = useState(0);
    const [quote, setQuote] = useState()

    //function quotes
    const fetchQuotes = async () => {
        const url = 'https://quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com/quote?token=ipworld.info';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'fcdda6022amsh08abef535ef806dp1dc73cjsn0a23d1eeca9a',
                'X-RapidAPI-Host': 'quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com'
            }
        };
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            setQuote(result)
        } catch (error) {
            console.error(error);
        }

    }

    //send user to login page when user not logged in
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                const uid = user.uid;
                setUserData(user.toJSON())
                console.log("user successfully signed in")
                fetchQuotes()
            } else {
                console.log("user is logged out")
            }
        });

        //quote api

    }, [])

    //image upload
    function handleImageChange(event) {
        handleImageUpload(event.target.files[0]);
        setFile(event.target.files[0])
    }

    const updateUserProfile = (url) => {
        updateProfile(auth.currentUser, {
            photoURL: url
        }).then(() => {
            alert("profile Updated sucessfully")
            setLoader(false)
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleImageUpload = async (f) => {

        if (!f) {
            alert("Please upload an image first!");
            return
        }
        setLoader(true)
        const storageRef = ref(storage, `/files/${f.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, f);

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

                    {/* //user profile details  */}
                    <div className='w-[90%] md:w-[70%] lg:w-[50%] mx-auto shadow-lg rounded-md p-5 my-5 bg-[#ff445aa8] '>
                        <form className='flex flex-col items-center'>

                            {/* //image upload functionality */}
                            <div className='cursor-pointer'>
                                <label for="profileimage" className='hover:cursor-pointer'>
                                    {<img src={userData.photoURL ? userData.photoURL : photourl} className='rounded-full w-[200px] h-[200px] border cursor-pointer' />}
                                </label>
                                <input type="file"
                                    onChange={handleImageChange}
                                    accept="/image/*"
                                    title="Choose a video please"
                                    id='profileimage'
                                    className='hidden'
                                />
                                {/* //show Loader when profile image is being updated  */}
                                <div className="flex items-center justify-center">

                                    {loader ? (<Loader />) : ""}

                                </div>
                            </div>

                            {/* //user details functionality */}
                            <div className=' flex flex-col items-start p-5 gap-4 '>
                                <div className="flex flex-row items-center gap-2  rounded-md">
                                    <div><CiTextAlignCenter className='text-2xl' /></div>
                                    <div className=' px-2 w-full'>{userData.displayName}</div>
                                </div>
                                <div className="flex flex-row items-center gap-2  rounded-md">
                                    <div><AiOutlineMail className='text-2xl' /></div>
                                    <div className=' px-2 w-full'>{userData.email}</div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* //quotes app  */}
                    <div className="shadow-lg quote-container w-[90%] md:w-[70%] lg:w-[50%] mx-auto  rounded-sm p-10 my-5">
                        {quote && (<Quotes quote={quote} />)}
                    </div>

                </div>
            </section>

        </main>
    )
}

export default Dashboard