import React, { useState, useContext, useRef } from 'react'
import { doc, setDoc, getDocs, updateDoc, collection, addDoc,Timestamp  } from "firebase/firestore";
import { db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext'
import moment from 'moment';
import axios from 'axios';
import emailjs from '@emailjs/browser';


const Contact = () => {
    const { currentUser, userData } = useContext(AuthContext)
    console.log(currentUser)
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
        sendAdminEmail(e)
        const docRef = await addDoc(collection(db, "messages"), {
            id: currentUser.uid,
            name: userData.username,
            subject: formData.subject,
            message: formData.message,
            date: moment(new Date()).format("DD-MM-YYYY"),
            createdat: Timestamp.fromDate(new Date()),
        });
        console.log("Document written with ID: ", docRef.id);
    };

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
            }, (error) => {
                console.log(error.text);
            });
    };

    //sending email to admin
    return (
        <div className="py-20 flex flex-col gap-10 justify-center items-center">
            <h1 className='text-xl'>Send Message</h1>
            <form
                onSubmit={uploadToFirestore}
                className='flex flex-col gap-10 justify-center items-center'
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
                <button className="primary-button">
                    Send
                </button>
            </form>
        </div>
    )
}

export default Contact