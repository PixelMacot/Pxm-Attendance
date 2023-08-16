import React, { useState, useContext, useRef } from 'react'
import { doc, setDoc, getDocs, updateDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext'
import moment from 'moment';
import axios from 'axios';
import emailjs from '@emailjs/browser';


const Contact = () => {
    const { currentUser, userData } = useContext(AuthContext)
    const [mailsent, setMailSent] = useState(false)
    const [messagesent, setMessageSent] = useState(false)
    const [issubmitted, setIsSubmitted] = useState(false)

    // console.log(currentUser)
    const [formData, setFormData] = useState(
        {
            subject: '',
            message: ''
        }
    );

    //handle change input when an field changes
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData)
    };

    const uploadToFirestore = async (e) => {
        e.preventDefault()
        try {
            sendAdminEmail(e)
        } catch (error) {
            console.log(error)
        }
        let slug = createSlug(formData.message)
        console.log(slug)
        await setDoc(doc(db, "messages", slug), {
            id: currentUser.uid,
            name: userData.username,
            subject: formData.subject,
            message: formData.message,
            date: moment(new Date()).format("DD-MM-YYYY-HH-mm-ss"),
            createdat: Timestamp.fromDate(new Date()),
            slug: slug
        }).then(() => {
            setMessageSent(true)
            setIsSubmitted(true)
            setFormData({
                subject: '',
                message: ''
            })
        }).catch((err) => {
            console.log(err)
        })

        // const docRef = await addDoc(collection(db, "messages"), {
        //     id: currentUser.uid,
        //     name: userData.username,
        //     subject: formData.subject,
        //     message: formData.message,
        //     date: moment(new Date()).format("DD-MM-YYYY"),
        //     createdat: Timestamp.fromDate(new Date()),
        // }).then(() => {

        // }).catch((err) => {
        //     console.log("from contact page", err)
        // })

    };

    function createSlug(text) {
        return text
            .toString()                         // Convert to string
            .toLowerCase()                      // Convert to lowercase
            .trim()                             // Trim spaces from the beginning and end
            .replace(/\s+/g, '-')               // Replace spaces with dashes
            .replace(/[^\w\-]+/g, '')           // Remove non-word characters
            .replace(/\-\-+/g, '-');            // Replace multiple dashes with a single dash
    }

    //sending email to all  users

    const sendEmail = (e) => {
        e.preventDefault();
        console.log(e.target.email)
        emailjs.sendForm('service_2jm8iue', 'template_jcs0gvd', e.target, '7E1QUrPpZ_ri8eIqo')
            .then((result) => {
                console.log(result);
            }, (error) => {
                console.log(error.text);
            });
    };

    //send email to admin

    const sendAdminEmail = (e) => {
        e.preventDefault();
        console.log(e.target.email)
        emailjs.sendForm('service_2jm8iue', 'template_jcs0gvd', e.target, '7E1QUrPpZ_ri8eIqo')
            .then((result) => {
                console.log(result);
                setMailSent(true)
            }, (error) => {
                console.log(error.text);
            });
    };

    //sending email to admin
    return (
        <div className="text-left py-20 flex flex-col gap-10 justify-center items-center">
            <h1 className='text-2xl font-bold text-cyan-900'>Send Message</h1>
            {
                mailsent && (
                    <div className="text-left flex gap-2 items-center">
                        <img src='/mailicon.png' className='w-[32px]' />
                        <p className='text-green-900 font-semibold'>Mail sent successfully</p>
                    </div>
                )
            }
            {
                messagesent && (
                    <div className="flex gap-2 items-center">
                        <img src='/messageicon.png' className='w-[32px]' />
                        <p className='text-green-900 font-semibold'> Message sent successfully</p>
                    </div>
                )
            }
            {
                !issubmitted ? (
                    <form
                        onSubmit={uploadToFirestore}
                        className='flex flex-col gap-10 justify-center items-center w-[90%] lg:w-[50%]'
                    >

                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            placeholder='Enter subject'
                            className='w-full p-2 border shadow-md rounded-md'
                            onChange={handleChangeInput}
                        />
                        <textarea
                            name="message"
                            onChange={handleChangeInput}
                            placeholder='Message'
                            className='w-full min-h-[200px] border px-5 py-2 shadow-md rounded-md'
                            required
                            minLength="20"
                            maxLength="200"
                            value={formData.message}
                        />
                        <button className="primary-button bg-cyan-700 px-10 py-2 text-white rounded-md">
                            Send
                        </button>
                    </form>
                ) : (
                    <div className="">
                        <img src='/okicon.png' className='w-[200px]' />
                    </div>
                )
            }
        </div>
    )
}

export default Contact