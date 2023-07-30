import React, { useState,useContext } from 'react';
import Papa from 'papaparse';
import { HolidaysContext } from '../../context/HolidaysContext'
import { doc, setDoc, getDocs, updateDoc,collection,addDoc} from "firebase/firestore";
import { db } from '../../firebase';


const HolidayCalendar = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const { holidaysDataLoading,holidaysData, setHolidaysData } = useContext(HolidaysContext)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };


  return (
    <div className='min-h-[70vh] py-10 flex flex-col justify-center items-center gap-10'>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleImportData}>Import Data to Firestore</button>
      <button onClick={fetchDataFromFirestore}>Fetch Data from Firestore</button>
      <button onClick={convertDataToCSV}>Download CSV</button>
      <button onClick={convertDataToJSON}>Convert to JSON</button>
      <div>
        <h2>Fetched Data:</h2>
        <ul>
          {fetchedData.map((data, index) => (
            <li key={index}>{JSON.stringify(data)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HolidayCalendar;
