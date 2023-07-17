import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useFormik } from 'formik';

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [file, setFile] = useState("");
    // progress
    const [percent, setPercent] = useState(0);
    // Handles input change event and updates state
    const [photourl, setPhotoUrl] = useState("/boyavatar.png")
    const [name, setName] = useState("")
    const [error, setError] = useState()

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)
            console.log(`User ${user.uid} created`)
            navigate("/")
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage)
            console.log(errorCode, errorMessage)
        }     
    }
    //image upload
    function handleImageChange(event) {
        setFile(event.target.files[0]);
        handleImageUpload(event)
    }
    const handleImageUpload = (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please upload an image first!");
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
                });
            }
        );
    };
    return (
        <main >
            <section className='min-h-[80vh]'>
                <div>
                    <div className='w-[90%] md:w-[60%] lg:w-[40%] mx-auto shadow-lg rounded-sm p-5 my-5'>
                        <form className='flex flex-col items-center ' onSubmit={onSubmit}>

                            {/* //image upload functionality */}
                            <div className=''>
                                <label for="profileimage" className='hover:cursor-pointer'>
                                    {photourl && (<img src={photourl} className='rounded-full w-[200px] h-[200px] border' />)}
                                </label>
                                {/* <input type="file"
                                    onChange={handleImageChange}
                                    accept="/image/*"
                                    title="Choose a video please"
                                    id='profileimage'
                                    className='hidden'
                                /> */}
                                {/* //show percentage of image upload  */}
                                {/* <p>{percent} "% done"</p> */}
                            </div>
                            {
                                error && (
                                    <div className="px-5 my-4 text-red-500">Error: {error}</div>
                                )

                            }
                            {/* //user details functionality */}
                            <div className='flex flex-col items-start p-5 gap-2 w-full'>
                                {/* <label htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    label="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="off"
                                    placeholder="your name"
                                    className='px-2 py-1 border rounded-md w-[100%] focus:outline-cyan-400'
                                /> */}
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    label="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="off"
                                    placeholder="Email address"
                                    pattern="[^@\s]{2,}@[^@\s]{2,}\.[^@\s]{2,}"
                                    className='px-2 py-1 border rounded-md w-[100%] focus:outline-cyan-400'
                                />
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    label="Create password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="off"
                                    placeholder="Password"
                                    className='px-2 py-1 border rounded-md w-[100%] focus:outline-cyan-400'
                                />
                                <button
                                    type="submit"
                                    className='bg-[#dd5a69] p-2 rounded-md text-white font-bold w-[100%] my-2'
                                >
                                    Sign up
                                </button>
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/login" className='text-cyan-700' >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Signup