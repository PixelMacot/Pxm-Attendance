import React, { useState, useEffect } from 'react'
import moment from 'moment';
import { doc, setDoc, getDocs, collection, deleteDoc, query, orderBy, } from "firebase/firestore";
import { db } from '../../firebase';
import './createannouncement.scss'

const CreateAnnouncement = () => {

    //All useStates
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

    //all useEffects
    useEffect(() => {
        fetchAnnouncement()
    }, [])

    //All functions
    //announcement input read
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setAnnouncement({ ...announcement, [name]: value });
        console.log(announcement)
    };
    //no of notification allowed form input change
    const handleDatesAllowedInput = (e) => {
        const { name, value } = e.target;
        setDatesAllowed({ ...datesallowed, [name]: value });
        console.log(datesallowed)
    };
    //add announcement to Database
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
    //add No of notifications allowed in firebase
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
    //fuction to create slug so that we can name firebase document with slug
    function createSlug(text) {
        return text
            .toString()                         // Convert to string
            .toLowerCase()                      // Convert to lowercase
            .trim()                             // Trim spaces from the beginning and end
            .replace(/\s+/g, '-')               // Replace spaces with dashes
            .replace(/[^\w\-]+/g, '')           // Remove non-word characters
            .replace(/\-\-+/g, '-');            // Replace multiple dashes with a single dash
    }
    //function to fetch all announcement
    const fetchAnnouncement = async () => {
        try {
            // const collectionRef = collection(db, "announcement")
            // const snapshot = await getDocs(collectionRef);
            // const fetched_data = snapshot.docs.map((doc) => doc.data());
         
            const announcementsRef = collection(db, "announcement");
            const q = query(announcementsRef, orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            const fetched_data = querySnapshot.docs.map((doc) => doc.data());
            // console.log("qs",qs)

            setAllAnnouncement(fetched_data);
            //below function convert data into json
            console.log(fetched_data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    //function to delete announcement by slug
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
            <div className="announcements-wrapper">


                {
                    msg.error && (
                        <p className="">{msg.error}</p>
                    )
                }
                {
                    msg.successtxt && (
                        <p className="" >{msg.successtxt}</p>
                    )
                }
                <div className="create-and-show-announcements-wrapper">
                    <div className="create">
                        <h1 className=''>CreateAnnouncement</h1>

                        <form className=''
                            onSubmit={uploadToFirestore}
                        >

                            <label>Date</label>
                            <input
                                type="date"
                                name='date'
                                required
                                onChange={handleChangeInput}
                                className=''
                            />
                            <label>Announcement</label>
                            <input
                                type="text"
                                name='msg'
                                required
                                maxLength='100'
                                onChange={handleChangeInput}
                                className=''
                            />
                            <label>Link</label>
                            <input
                                type="text"
                                name='link'
                                onChange={handleChangeInput}
                                className=''
                            />
                            <button className='primary-button'>create</button>
                        </form>
                    </div>
                    <div className="">
                        <h2>Show Number of announcements</h2>
                        <form className=''
                            onSubmit={updateDatesAllowed}
                        >
                            <label>Nextdays</label>
                            <input
                                type="number"
                                name='nextdays'
                                required
                                onChange={handleDatesAllowedInput}
                                className=''
                            />
                            <label>Previousdays</label>
                            <input
                                type="number"
                                name='previousdays'
                                required
                                onChange={handleDatesAllowedInput}
                                className=''
                            />
                            <button className='primary-button'>update</button>
                        </form>
                    </div>
                </div>
                <div className="all-announcement-container">
                    <h2 className=''>All Announcements</h2>
                    <div className="all-announcements">

                        {
                            allannouncement && allannouncement.map((item) => {
                                return (
                                    <div className="announcement-wrapper" key={item.id}>
                                        <div className="date">
                                            <span>📅</span>
                                            {item.date}
                                        </div>
                                        <div className="announcement">
                                            <span>📋</span>
                                            {item.msg}
                                        </div>
                                        <div className="delete-btn"
                                            id={item.slug}
                                            onClick={DeleteAnnouncement}
                                        >
                                            ⛔ Delete
                                        </div>
                                    </div>

                                )
                            })
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAnnouncement