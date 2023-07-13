import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                console.log(errorCode, errorMessage)
            });

    }

    return (
        <>
            <main >
                <section>
                    <div className='w-[90%] md:w-[60%] lg:w-[40%] mx-auto shadow-lg rounded-sm p-5 my-10'>
                        <h1 className='text-center text-2xl'>Login</h1>
                        <form className='flex flex-col gap-2 ' onSubmit={onLogin}>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    pattern="[^@\s]{2,}@[^@\s]{2,}\.[^@\s]{2,}"
                                    required
                                    placeholder="Email address"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className='my-5'>
                                <button
                                    onClick={onLogin}
                                    className='bg-[#dd5a69] px-5 py-2 rounded-md text-white font-bold w-full'
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        <p className="text-sm text-cyan-700 text-center">
                            No account yet? {' '}
                            <Link to="/signup">
                                Sign up
                            </Link>
                        </p>

                    </div>
                </section>
            </main>
        </>
    )
}

export default Login