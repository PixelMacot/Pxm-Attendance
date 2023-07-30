import React, { useState } from 'react';
import Papa from 'papaparse';
import { HolidaysContext } from '../../context/HolidaysContext'
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../../firebase';
// Replace this with your Firebase configuration


const Month = () => {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };

  const handleImportData = () => {
    if (csvFile) {
      Papa.parse(csvFile, {
        header: true,
        complete: (results) => {
          const json_data = results.data;
          uploadToFirestore(json_data);
        },
      });
    }
  };

  const uploadToFirestore = (json_data) => {
    json_data.forEach((data) => {
      firestore.collection("your_collection_name").add(data);
    });
  };

  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = firestore.collection("your_collection_name");
      const snapshot = await collectionRef.get();
      const fetched_data = snapshot.docs.map((doc) => doc.data());
      console.log(fetched_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleImportData}>Import Data to Firestore</button>
      <button onClick={fetchDataFromFirestore}>Fetch Data from Firestore</button>
    </div>
  );
};

export default Month;
