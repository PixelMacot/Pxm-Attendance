import React, { useState, useEffect } from 'react'
import { doc, setDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';

const CreateAnnouncement = () => {
    const [announcement, setAnnouncement] = useState()
    const [allannouncement, setAllAnnouncement] = useState()

    const [msg, setMsg] = useState({
        successtxt: '',
        error: ''
    })

    useEffect(() => {
        fetchAnnouncement()
    }, [])


    const uploadToFirestore = async (e) => {
        e.preventDefault()
        await addDoc(collection(db, "announcement"), {
            msg: announcement
        }).then(() => {
            setMsg(
                {
                    ...msg,
                    successtxt: 'successfully created announcement'
                }
            )
        }).catch((err) => {
            setMsg(
                {
                    ...msg,
                    error: err
                }
            )
        })

    };


    const fetchAnnouncement = async () => {
        try {
            const collectionRef = collection(db, "announcement");
            const snapshot = await getDocs(collectionRef);
            const fetched_data = snapshot.docs.map((doc) => doc.data());
            setAllAnnouncement(fetched_data);
            //below function convert data into json
            console.log(fetched_data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    return (
        <div>
            <div className="py-10 px-2 w-fit mx-auto">
                <h1 className='text-xl font-bold text-center'>CreateAnnouncement</h1>
                <form className='flex flex-col gap-2 py-5'
                    onSubmit={uploadToFirestore}
                >
                    <label>Enter Announcement</label>
                    {
                        msg.error && (
                            <p className="text-green-500 font-bold ">{msg.error}</p>
                        )
                    }
                    {
                        msg.successtxt && (
                            <p className="text-red font-bold " >{msg.successtxt}</p>
                        )
                    }
                    <input
                        type="text"
                        onChange={(e) => setAnnouncement(e.target.value)}
                        className='border rounded-md p-2 w-fit '
                    />
                    <button className='primary-button'>create</button>
                </form>
                <h2 className='text-lg font-bold text-center'>Curent Announcements</h2>
                <div className="">
                    <ul>
                        {
                            allannouncement && allannouncement.map((item) => {
                                return (
                                    <li>{item.msg}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default CreateAnnouncement