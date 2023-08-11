import React, { useState, useEffect } from 'react'
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import moment from 'moment';

const CreateAnnouncement = () => {
    const [announcement, setAnnouncement] = useState({
        msg: 'notprovided',
        link: 'notprovided',
        date: 'notprovided'
    })
    const [datesallowed, setDatesAllowed] = useState({
        nextdays: '',
        previousdays: '',
    })
    const [allannouncement, setAllAnnouncement] = useState()

    const [msg, setMsg] = useState({
        successtxt: '',
        error: ''
    })

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setAnnouncement({ ...announcement, [name]: value });
        console.log(announcement)
    };
    const handleDatesAllowedInput = (e) => {
        const { name, value } = e.target;
        setDatesAllowed({ ...datesallowed, [name]: value });
        console.log(datesallowed)
    };


    useEffect(() => {
        fetchAnnouncement()
    }, [])

    const uploadToFirestore = async (e) => {
        e.preventDefault()
        let slug = createSlug(announcement.msg)
        console.log(slug)
        await setDoc(doc(db, "announcement", slug), {
            msg: announcement.msg ? announcement.msg : 'notprovided',
            date: announcement.date ? moment(announcement.date).format("DD-MM-YYYY") : 'notprovided',
            link: announcement.link ? announcement.link : 'notprovided',
            slug: slug
        }).then(() => {
            setMsg(
                {
                    ...msg,
                    successtxt: 'successfully created announcement'
                }
            )
            fetchAnnouncement()
        }).catch((err) => {
            setMsg(
                {
                    ...msg,
                    error: err
                }
            )
        })
    };
    const updateDatesAllowed = async (e) => {
        e.preventDefault()
        await setDoc(doc(db, "datesallowed", "datesallowed"), {
            nextdays: datesallowed.nextdays,
            previousdays: datesallowed.previousdays
        }).then(() => {
            setMsg(
                {
                    ...msg,
                    successtxt: 'successfully updated'
                }
            )
            fetchAnnouncement()
        }).catch((err) => {
            setMsg(
                {
                    ...msg,
                    error: err
                }
            )
        })
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

    const DeleteAnnouncement = async (e) => {
        e.preventDefault()
        let id = e.target.id
        await deleteDoc(doc(db, "announcement", id)).then(() => {
            setMsg(
                {
                    ...msg,
                    successtxt: 'successfully deleted announcement'
                }
            )
            fetchAnnouncement()
        }).catch((err) => {
            setMsg(
                {
                    ...msg,
                    error: err
                }
            )
        })
    }

    return (
        <div>
            <div className="py-10 px-2 w-fit mx-auto border shadow-md">
                <h1 className='text-xl font-bold text-center '>CreateAnnouncement</h1>
                <form className='flex flex-col gap-2 py-5 w-fit mx-auto  p-5'
                    onSubmit={uploadToFirestore}
                >

                    {
                        msg.error && (
                            <p className="text-red-500 font-bold ">{msg.error}</p>
                        )
                    }
                    {
                        msg.successtxt && (
                            <p className="text-green-700 font-bold " >{msg.successtxt}</p>
                        )
                    }
                    <label>Date</label>
                    <input
                        type="date"
                        name='date'
                        required
                        onChange={handleChangeInput}
                        className='border rounded-md p-2 w-fit '
                    />
                    <label>Announcement</label>
                    <input
                        type="text"
                        name='msg'
                        required
                        maxLength='100'
                        onChange={handleChangeInput}
                        className='border rounded-md p-2 w-fit '
                    />
                    <label>Link</label>
                    <input
                        type="text"
                        name='link'
                        onChange={handleChangeInput}
                        className='border rounded-md p-2 w-fit '
                    />
                    <button className='primary-button'>create</button>
                </form>
                <div className="text-xl font-bold text-center my-5 px-5">Show Number of notifications</div>
                <form className='flex flex-col gap-2 py-5 w-fit mx-auto  p-5'
                    onSubmit={updateDatesAllowed}
                >
                    <label>Nextdays</label>
                    <textarea
                        type="number"
                        name='nextdays'
                        required
                        onChange={handleDatesAllowedInput}
                        className='border rounded-md p-2 w-fit '
                    />
                    <label>Previousdays</label>
                    <input
                        type="number"
                        name='previousdays'
                        required
                        onChange={handleDatesAllowedInput}
                        className='border rounded-md p-2 w-fit '
                    />
                    <button className='primary-button'>update</button>
                </form>
                <h2 className='text-lg font-bold text-center'>Curent Announcements</h2>
                <div className="flex flex-col gap-5">

                    {
                        allannouncement && allannouncement.map((item) => {
                            return (
                                <div className="border border-red-500" key={item.id}>
                                    <div className="mgg">
                                        {item.msg}
                                    </div>
                                    <div className="deletebtn cursor-pointer"
                                        id={item.slug}
                                        onClick={DeleteAnnouncement}
                                    >
                                        Delete
                                    </div>
                                </div>

                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default CreateAnnouncement