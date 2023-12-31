import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import './signup.scss'
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../../firebase';
const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState()
    const [loader, setLoader] = useState(false)

    const [formData, setFormData] = useState(
        {
            username: '',
            profileimg: 'notprovided',
            position: 'your position',
            skills: 'your skills',
            backgroundimg: '/profilebg.jpg',
            address: 'Noida',
            phoneno: '',
            gender: 'male'
        }
    );
    //handle change input when an field changes
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData)
    };

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)
            updateProfileDetails(user)
            console.log(`User ${user.uid} created`)
            navigate("/notallowed")
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage)
            console.log(errorCode, errorMessage)
        }
    }

    async function updateProfileDetails(user) {
        console.log(formData)
        console.log(user.uid)
        setLoader(true)
        let docData = {
            uid: user.uid,
            username: formData.username,
            profileimg: formData.profileimg,
            position: formData.position,
            skills: formData.skills,
            address: formData.address,
            phoneno: formData.phoneno,
            backgroundimg: formData.backgroundimg,
            gender: formData.gender,
            prevelege: "employee",
            status: false,
            updatedat: Timestamp.fromDate(new Date()),
        }
        console.log(docData)
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(doc(db, "users", user.uid), docData);
            } else {
                await setDoc(doc(db, "users", user.uid), docData);
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <section className='signup section-wrapper'>
            <div className='signup-container'>
                <div className='signup-wrapper'>
                    <div className="logo-heading">
                        <img src='/logo.png' className='' />
                        <h1>Let's get Started</h1>
                    </div>
                    <form className='form-signup' onSubmit={onSubmit}>
                        {
                            error && (
                                <div className="">Error: {error}</div>
                            )

                        }

                        {/* //user details functionality */}
                        <div className='input-div'>
                            <label htmlFor="email-address">
                                email
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
                                className=''
                            />
                            <label htmlFor="password">
                                password
                            </label>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Password"
                                className=''
                            />
                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                name="username"
                                onChange={handleChangeInput}
                                placeholder='username'
                                type='text'
                                className=''
                                required
                                minLength="2"
                                maxLength="32"
                                value={formData.username}
                                autoComplete="off"
                            />
                            <label htmlFor="phoneno">
                                Phone No
                            </label>
                            <input
                                name="phoneno"
                                onChange={handleChangeInput}
                                placeholder='phoneno'
                                className=''
                                type='number'
                                required
                                minLength="2"
                                maxLength="32"
                                value={formData.phoneno}
                                autoComplete="off"
                            />
                            <label htmlFor="gender">
                                Gender
                            </label>
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

                            <button
                                type="submit"
                                className='signup-btn'
                            >
                                Sign up
                            </button>

                            <p className='account-text'>
                                Already have an account?{' '}
                                <Link to="/login" className='login-link-text' >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>

                </div>

            </div>
            <div className="auth-background-img">

            </div>
        </section>
    )
}

export default Signup