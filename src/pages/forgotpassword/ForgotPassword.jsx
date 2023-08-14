import React, { useState } from 'react'
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link, NavLink, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [email, setemail] = useState("");
    const [error, setError] = useState()
    const [msg, setMsg] = useState()

    // Function to initiate password reset
    const sendResetEmail = (e) => {
        e.preventDefault()

        sendPasswordResetEmail(auth, email)
            .then(function () {
                // Password reset email sent successfully
                console.log("Password reset email sent");
                setMsg("successfully sent reset link to email")
                setemail('')
            })
            .catch(function (error) {
                // An error occurred while sending the password reset email
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage);

                setError(errorCode)
                setemail('')
            });
    }

    return (
        <div className=' w-[100vw] lg:w-[50vw] mx-auto flex flex-col gap-5 items-center text-center  my-10 py-5'>
            <div className="logo-heading">
                <img src='/logo.png' className='w-[200px]' />
                <h1 className='text-[1.2rem] font-bold text-center my-5'>Reset Password</h1>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center mt-10 mx-auto lg:w-[60%]">
                {
                    error && (
                        <div className="error">Error: {error}</div>
                    )

                }
                {
                    msg && (
                        <div className="success">{msg}</div>
                    )

                }
                <form onSubmit={sendResetEmail} className='mx-0 w-full'>
                    {/* email field */}

                    <div className="mb-7 w-full">
                        <label for="email" className="block text-sm font-medium text-[#131313c9] text-left">Email</label>

                        <input id="email" name="email" placeholder="Enter your email" type="email" required autocomplete="off" minLength={4}
                            value={email}
                            onChange={(e) => setemail(e.target.value)}

                            className="block  appearance-none  pborder border-solid border border-solid-[#EBEBEB] w-full p-2 mt-2 placeholder-[#DBDBDB] shadow-sm sm:text-sm focus:border focus:border-[#007AFF] focus:outline-none focus:ring-[#007AFF]" aria-required="true"

                        />
                    </div>
                    <button type="submit" className="w-full flex justify-center border border-solid bordertransparent cursor-pointer bg-[#007AFF] hover:bg-[#006DE4] py-2 px-4 text-sm  mb-2 font-medium text-white shadow-sm">

                        Reset Password

                    </button>
                </form>
                <p className="account-text">
                    Remeber your password{' '}
                    <Link to="/login">
                        <span className='login-link-text text-[#007aff]'>Login</span>
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword