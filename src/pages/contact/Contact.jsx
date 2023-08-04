import React, { useState,useContext } from 'react'
import { doc, setDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext'
import moment from 'moment';

const Contact = () => {
    const { currentUser, userData } = useContext(AuthContext)

    const [formData, setFormData] = useState(
        {
           
            category:'query',
            message:''
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
        const docRef = await addDoc(collection(db, "messages"), {
            id:currentUser.uid,
            name:userData.username,
            category: formData.category,
            message: formData.message,
            date:moment(new Date()).format("DD-MM-YYYY")
        });
        console.log("Document written with ID: ", docRef.id);
    };

    return (
        <div className="py-20 flex flex-col gap-10 justify-center items-center">
            <h1 className='text-xl'>Send Message</h1>
            <form
                onSubmit={uploadToFirestore}
                className='flex flex-col gap-10 justify-center items-center'
            >

                <select id="category"
                    name="category"
                    value={formData.category}
                    required
                    className='w-full border px-5 py-2 shadow-md rounded-md'
                    onChange={handleChangeInput}
                >
                    <option value="query">I have a Query</option>
                    <option value="leave">I want leave</option>
                    <option value="blocked">I am blocked</option>
                    <option value="error">App is malfunctioning</option>
                </select>
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