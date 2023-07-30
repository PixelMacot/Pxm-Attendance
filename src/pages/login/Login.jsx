import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../../features/users/userSlice'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState()
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/")
                console.log(user);
                dispatch(login(user))
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage)
                console.log(errorCode, errorMessage)
            });
        
    }

    return (
        <>
            <main >
                <section className='min-h-[80vh]'>
                    <div className='w-[90%] md:w-[60%] lg:w-[40%] mx-auto shadow-lg rounded-sm p-5 my-8'>
                        {/* <h1 className='text-center text-2xl font-bold'>Login</h1> */}

                        <form className='flex flex-col gap-2 items-center mt-5' onSubmit={onLogin}>
                            <img src='/login.png' className='w-[120px] md:w-[200px] my-5' />
                            {
                                error && (
                                    <div className="w-full mb-4 text-red-500">Error: {error}</div>
                                )

                            }
                            <div className='flex flex-col gap-1 w-full'>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    pattern="[^@\s]{2,}@[^@\s]{2,}\.[^@\s]{2,}"
                                    required
                                    autoComplete="off"
                                    placeholder="Email address"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='px-2 py-1 border rounded-md w-[100%] focus:outline-cyan-400'
                                />
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="off"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='px-2 py-1 border rounded-md w-[100%] focus:outline-cyan-400'
                                />
                            </div>

                            <div className='my-5 w-full'>
                                <button
                                    onClick={onLogin}
                                    className='bg-[#dd5a69] px-10 py-2 rounded-md text-white font-bold w-full'
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        <p className="text-sm  text-center">
                            No account yet? {' '}
                            <Link to="/signup">
                                <span className='text-cyan-700'>Sign up</span>
                            </Link>
                        </p>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Login