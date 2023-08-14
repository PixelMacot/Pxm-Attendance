import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './login.scss'

const Login = () => {

    // navigate to redirect pages
    const navigate = useNavigate();

    //all states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState()

    //login user to account
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/")
                console.log(user);

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(error)
                console.log(error)
            });
    }

    return (
        <>
            <section className='login login-section section-wrapper'>
                <div className='login-container'>
                    <div className="logo-heading">
                        <img src='/logo.png' className='' />
                        <h1>Hi,Welcome Back!</h1>
                    </div>
                    <form className='login-form login-form-wrapper' onSubmit={onLogin}>
                        {
                            error && (
                                <div className="error">Error: {error.code}</div>
                            )

                        }
                        <div className='input-container'>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                pattern="[^@\s]{2,}@[^@\s]{2,}\.[^@\s]{2,}"
                                required
                                minLength="5"
                                autoComplete="off"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                                className=''
                            />
                        </div>

                        <div className='input-container'>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength="5"
                                autoComplete="off"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className=''
                            />
                        </div>
                        <div className="forgot-password">
                           <NavLink to="/forgotpassword">
                           <p className='signup-link-text cursor-pointer'>Forgot Password?</p>
                           </NavLink>
                        </div>
                        <div className='login-btn-wrapper'>
                            <button
                               
                                className='login-btn'
                            >
                                Login
                            </button>
                           
                        </div>
                    </form>
                    <button className='gbtn flex gap-2 -mt-4 py-2 mb-4 pborder items-center  w-full justify-center text-black  border border-solid-[#EBEBEB] bg-white hover:bg-[#F1F4FF] px-4 text-sm font-medium'> <img src='/glogo.png' alt="-" className='mx' /> Sign in with google</button>

                    <p className="account-text">
                        Don't have an account yet?{' '}
                        <Link to="/signup">
                            <span className='signup-link-text'>Sign up</span>
                        </Link>
                    </p>
                </div>
                <div className="auth-background-img">

                </div>
            </section>

        </>
    )
}

export default Login