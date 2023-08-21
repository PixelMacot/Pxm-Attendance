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
import moment from 'moment';
import './profile.scss'

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
            position: '',
            skills: '',
            backgroundimg: '/profilebg.jpg',
            address: '',
            phoneno: '',
            gender: '',
            dob: '',
            bio: '',
            profileimg: 'notprovided',
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
            dob: moment(formData.dob).format("YYYY-MM-DD"),
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
                        dob: moment(formData.dob).format("YYYY-MM-DD"),
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
                        dob: moment(formData.dob).format("YYYY-MM-DD"),
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
                    <div className='profile-page-wrapper'>

                        {/* //background img  */}
                        <div className="bg-image">
                            <label for="backgroundimage">
                                <div
                                    className='backgroundimage'
                                    style={{ backgroundImage: formData.backgroundimg ? `url('${formData.backgroundimg}')` : `url('/profilebg.jpg')` }}
                                >
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
                        <form className=''>

                            {/* //image upload functionality */}
                            <div className='profile-img-wrapper'>
                                <label for="profileimage" className='profileimglabel'>
                                    <div className="profile-image">
                                        <Avatar
                                            alt={userData.displayName}
                                            src={formData.profileimg != 'notprovided' ? formData.profileimg : formData.gender == 'male' ? '/boyavatar.png' : '/girlavatar.png'}
                                            sx={{ width: '100%', height: '100%', position: 'static' }}
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
                                <div className="">

                                    {loader ? (<Loader />) : ""}

                                </div>
                            </div>
                        </form>
                    </div>

                    {/* //user  profile  */}

                    <div className="user-details">
                        <form
                            onSubmit={updateProfileDetails}
                            className=''
                        >
                            <div className="input-label halfwidth">
                                <label for='username'>Username</label>
                                <input
                                    name="username" id='username'
                                    onChange={handleChangeInput}
                                    placeholder='username'
                                    className=''
                                    required
                                    minLength="2"
                                    maxLength="32"
                                    value={formData.username}
                                />
                            </div>
                            <div className="input-label halfwidth">
                                <label for='username'>Position</label>
                                <input
                                    name="position"
                                    onChange={handleChangeInput}
                                    placeholder='Your Position'
                                    className=''
                                    required
                                    minLength="2"
                                    maxLength="32"
                                    value={formData.position}
                                />
                            </div>
                            <div className="input-label">
                                <label for='username'>Skills</label>
                                <input
                                    name="skills"
                                    onChange={handleChangeInput}
                                    placeholder='Your Skills'
                                    className=''
                                    required
                                    minLength="2"
                                    maxLength="50"
                                    value={formData.skills}
                                />
                            </div>

                            <div className="input-label">
                                <label for='username'>Address</label>
                                <input
                                    name="address"
                                    onChange={handleChangeInput}
                                    placeholder='Address'
                                    className=''
                                    required
                                    minLength="2"
                                    maxLength="50"
                                    value={formData.address}
                                />
                            </div>
                            <div className="input-label halfwidth">
                                <label for='username'>Phone no</label>
                                <input
                                    name="phoneno"
                                    onChange={handleChangeInput}
                                    placeholder='phoneno'
                                    className=''
                                    required
                                    minLength="2"
                                    maxLength="32"
                                    value={formData.phoneno}
                                />
                            </div>
                            <div className="input-label halfwidth">
                                <label for='username'>DOB</label>
                                <input
                                    name="dob"
                                    onChange={handleChangeInput}
                                    placeholder='Date of Birth'
                                    className=''
                                    required
                                    type='date'
                                    value={formData.dob}
                                />
                            </div>
                            <div className="input-label halfwidth">
                                <label for='username'>Gender</label>
                                <select id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    required
                                    className=''
                                    onChange={handleChangeInput}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>

                                </select>
                            </div>
                            <div className="input-label halfwidth">
                                <label>Bio</label>
                                <textarea
                                    name="bio"
                                    onChange={handleChangeInput}
                                    placeholder='your bio'
                                    className=''
                                    required
                                    minLength="10"
                                    maxLength="250"
                                    value={formData.bio}
                                />
                            </div>
                            
                            <button
                                // onClick={updateProfileDetails}
                                className='primary-button'>Update Profile</button>
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