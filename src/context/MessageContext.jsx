import { createContext, useEffect, useState } from "react";
import { getDocs,collection } from "firebase/firestore";
import { db } from '../firebase';
import moment from 'moment'

export const MessagesContext = createContext();

export const MessagesContextProvider = ({ children }) => {
    const [messages, setMessages] = useState({})

    useEffect(() => {
        fetchMessages()
    }, [])


    const fetchMessages = async () => {
        try {
            const collectionRef = collection(db, "messages");
            const snapshot = await getDocs(collectionRef);
            const fetched_data = snapshot.docs.map((doc, index) => {
                // console.log(moment(doc.data().createdat.seconds).format('HH-ss'))
                return (
                    {
                        id: index,
                        name: doc.data().name,
                        date: doc.data().date,
                        message: doc.data().message,
                        uid: doc.data().uid,
                        slug:doc.data().slug
                    }
                )
            });
            setMessages(fetched_data);
            //below function convert data into json
            console.log(fetched_data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <MessagesContext.Provider value={{
            messages,
            fetchMessages
        }}>
            {children}
        </MessagesContext.Provider>
    );
};