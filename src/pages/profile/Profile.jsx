import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../../firebase';
import Loader from '../../components/loader/Loader';
import Avatar from '@mui/material/Avatar';
import { AuthContext } from '../../context/AuthContext'

const options = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
];

const Profile = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState();
    const [loader, setLoader] = useState(false)
    // Handles input change event and updates state
    const [photourl, setPhotoUrl] = useState()
    const [percent, setPercent] = useState(0);
    const [formData, setFormData] = useState(
        {
            username: '',
            profileimg: '/boyavatar.png',
            position: '',
            skills: '',
            backgroundimg: '/profilebg.jpg',
            address: '',
            phoneno: '',
            gender: ''
        }
    );
    const { currentUser, userData, getUserProfileData } = useContext(AuthContext)

    //send user to login page when user not logged in
    useEffect(() => {
        if (userData) {
            setFormData(userData)
        }
    }, [])



    async function updateProfileDetails(e) {
        console.log(formData)
        console.log(currentUser.uid)
        e.preventDefault()
        setLoader(true)
        let docdta = {
            uid: currentUser.uid,
            username: formData.username,
            profileimg: formData.profileimg,
            position: formData.position,
            skills: formData.skills,
            address: formData.address,
            phoneno: formData.phoneno,
            backgroundimg: formData.backgroundimg,
            gender: formData.gender,
            prevelege: "employee"
        }
        console.log(docdta)
        try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await updateDoc(doc(db, "users", currentUser.uid),
                    {
                        uid: currentUser.uid,
                        username: formData.username,
                        profileimg: formData.profileimg,
                        position: formData.position,
                        skills: formData.skills,
                        address: formData.address,
                        phoneno: formData.phoneno,
                        backgroundimg: formData.backgroundimg,
                        gender: formData.gender,
                        prevelege: "employee"
                    }
                );
            } else {
                console.log(docdta)
                await setDoc(doc(db, "users", currentUser.uid),
                    {
                        uid: currentUser.uid,
                        username: formData.username,
                        profileimg: formData.profileimg,
                        position: formData.position,
                        skills: formData.skills,
                        address: formData.address,
                        phoneno: formData.phoneno,
                        backgroundimg: formData.backgroundimg,
                        gender: formData.gender,
                        prevelege: "employee"
                    }
                );
            }

            //call function to get updated data
            getUserProfileData(currentUser)
            setLoader(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    // profile image upload
    function handleProfileImageChange(event) {
        setFile(event.target.files[0])
        let url = handleImageUpload(event.target.files[0], "profileimg");
    }

    //background image upload
    function handlebackgroundImageChange(event) {
        handleImageUpload(event.target.files[0], "backgroundimg");
    }

    const updateUserProfile = (url) => {
        console.log("user profile img update", url)
        updateProfile(auth.currentUser, {
            photoURL: url,
            displayName: formData.username
        }).then(() => {
            setPhotoUrl(url)
            setFormData({ ...formData, profileimg: url });
            setLoader(false)
            alert("profile Updated sucessfully")
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleImageUpload = async (f, changeimg) => {

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
                    if (changeimg == "profileimg") {
                        // setPhotoUrl(url)
                        setFormData({ ...formData, profileimg: url });
                        updateUserProfile(url)
                        console.log(formData)

                    } else {
                        setFormData({ ...formData, backgroundimg: url });
                        setLoader(false)
                        console.log(formData)
                    }
                });

            }
        );


    };

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData.profileimg)
    };
    return (
        <main >
            <section>
                <div>

                    {/* //user profile details  */}
                    <div className='w-[90%]  mx-auto shadow-lg rounded-md mt-2'>

                        {/* //background img  */}
                        <div className="">
                            <label for="backgroundimage" className='hover:cursor-pointer'>
                                <div
                                    style={{ backgroundImage: formData.backgroundimg ? `url('${formData.backgroundimg}')` : `url('/profilebg.jpg')` }}
                                    className={`bg-[url('${formData.backgroundimg}')] h-[100px] md:h-[200px] w-full bg-cover rounded-t-md`}>
                                </div>

                            </label>
                            <input type="file"
                                onChange={handlebackgroundImageChange}
                                accept="/image/*"
                                title="Choose a video please"
                                id='backgroundimage'
                                className='hidden'
                            />
                        </div>
                        <form className='flex flex-col items-center'>

                            {/* //image upload functionality */}
                            <div className='cursor-pointer'>
                                <label for="profileimage" className='hover:cursor-pointer'>
                                    <div className="avatar border-[3px] border-white w-[130px] h-[130px] md:w-[180px] md:h-[180px] rounded-full  -mt-20 md:-mt-24">
                                        <Avatar
                                            alt={userData.displayName}
                                            src={formData.profileimg ? formData.profileimg : '/boyavatar.png'}
                                            sx={{ width: '100%', height: '100%' }}
                                        />
                                    </div>
                                    {/* {<img src={userData.photoURL ? userData.photoURL : photourl} className='rounded-full w-[200px] h-[200px] border cursor-pointer' />} */}
                                </label>
                                <input type="file"
                                    onChange={handleProfileImageChange}
                                    accept="/image/*"
                                    title="Choose a photo please"
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
                                    <div className='px-2 w-full text-2xl'>{formData.username ? formData.username : "username"}</div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* //user  profile  */}

                    <div className="w-[90%] mx-auto shadow-lg p-5 my-8">
                        <form
                            onSubmit={updateProfileDetails}
                            className='flex flex-col gap-4'
                        >
                            <input
                                name="username"
                                onChange={handleChangeInput}
                                placeholder='username'
                                className='border p-2 rounded-md'
                                required
                                minLength="2"
                                maxLength="32"
                                value={formData.username}
                            />
                            <input
                                name="position"
                                onChange={handleChangeInput}
                                placeholder='Your Position'
                                className='border p-2 rounded-md'
                                required
                                minLength="2"
                                maxLength="32"
                                value={formData.position}
                            />
                            <input
                                name="skills"
                                onChange={handleChangeInput}
                                placeholder='Your Skills'
                                className='border p-2 rounded-md'
                                required
                                minLength="2"
                                maxLength="50"
                                value={formData.skills}
                            />
                            <input
                                name="address"
                                onChange={handleChangeInput}
                                placeholder='Address'
                                className='border p-2 rounded-md'
                                required
                                minLength="2"
                                maxLength="50"
                                value={formData.address}
                            />
                            <input
                                name="phoneno"
                                onChange={handleChangeInput}
                                placeholder='phoneno'
                                className='border p-2 rounded-md'
                                required
                                minLength="2"
                                maxLength="32"
                                value={formData.phoneno}
                            />
                            <select id="gender"
                                name="gender"
                                value={formData.gender}
                                required
                                className='border p-2 rounded-md'
                                onChange={handleChangeInput}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>

                            </select>
                            <button
                                // onClick={updateProfileDetails}
                                className='bg-[#ff445a] px-5 py-2 w-fit mx-auto rounded-md text-white'>Update Profile</button>
                        </form>
                    </div>

                    {/* //quotes app  */}

                    {/* {quote.text && (<Quotes quote={quote} />)} */}


                </div>
            </section>

        </main >
    )
}

export default Profile