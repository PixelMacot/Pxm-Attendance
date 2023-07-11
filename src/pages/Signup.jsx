import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [file, setFile] = useState("");
    // progress
    const [percent, setPercent] = useState(0);
    // Handles input change event and updates state
    const [photourl, setPhotoUrl] = useState("")
    const [name, setName] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()

        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        console.log(`User ${user.uid} created`)
        await updateProfile(user, {
            displayName: name,
            photoURL: photourl
        })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });


    }
    //image upload
    function handleImageChange(event) {
        setFile(event.target.files[0]);
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
            <section>
                <div>
                    <div className='w-[40%] mx-auto shadow-lg rounded-sm p-5 my-5'>
                        <form>
                            <div className='flex flex-col items-start gap-2  p-5'>
                                <label htmlFor="email-address">
                                    profile image
                                </label>
                                <input type="file" onChange={handleImageChange} accept="/image/*" />
                                <button 
                                onClick={handleImageUpload}
                                className='bg-orange-400 p-2 rounded-md text-white font-bold'>Upload to Firebase</button>
                                <p>{percent} "% done"</p>

                            </div>

                            <div className='flex flex-col items-start p-5 gap-1'>
                                <label htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    label="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="your name"
                                    className='px-2 py-1 border rounded-md w-[80%]'
                                />
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    label="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Email address"
                                    className='px-2 py-1 border rounded-md w-[80%]'
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
                                    placeholder="Password"
                                    className='px-2 py-1 border rounded-md w-[80%]'
                                />
                                <button
                                    type="submit"
                                    onClick={onSubmit}
                                    className='bg-orange-400 p-2 rounded-md text-white font-bold'
                                >
                                    Sign up
                                </button>
                                <p>
                                    Already have an account?{' '}
                                    <NavLink to="/login" >
                                        Sign in
                                    </NavLink>
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