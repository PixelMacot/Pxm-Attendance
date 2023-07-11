import React, { useState } from 'react'
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const Dashboard = () => {
    const [file, setFile] = useState("");
    // progress
    const [percent, setPercent] = useState(0);
    // Handles input change event and updates state
    const [photoUrl, setPhotoUrl] = useState("")
    const [name,setName] = useState("")

    function handleImageChange(event) {
        setFile(event.target.files[0]);
    }
    const handleImageUpload = (e) => {
        e.preventDefault()
        if (!file) {
            alert("Please upload an image first!");
        }

        const storageRef = ref(storage, `/files/${file.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setPhotoUrl(url)
                });
            }
        );
    };

    return (
        <>
            <div className="">
                <div className="">
                    Complete your profile
                </div>
                <form>
                    <input type="file" onChange={handleImageChange} accept="/image/*" />
                    <button onClick={handleImageUpload}>Upload to Firebase</button>
                    <p>{percent} "% done"</p>
                   
                </form>
            </div>
        </>
    )
}

export default Dashboard