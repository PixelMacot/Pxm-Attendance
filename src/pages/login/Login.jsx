import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom'
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
            <section className='login section-wrapper'>
                <div className='login-container'>
                    <div className="login-avatar">
                        <img src='/avatar.png' className='' />
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
                                autoComplete="off"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className=''
                            />
                        </div>

                        <div className='login-btn-wrapper'>
                            <button
                                onClick={onLogin}
                                className='primary-button'
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="">
                        No account yet? {' '}
                        <Link to="/signup">
                            <span className='text-darkblue'>Sign up</span>
                        </Link>
                    </p>
                </div>
            </section>

        </>
    )
}

export default Login