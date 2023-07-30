import React, { useState, useContext } from 'react';
import Papa from 'papaparse';
import { HolidaysContext } from '../../context/HolidaysContext'
import { doc, setDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';


const HolidayCalendar = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const {
    holidaysDataLoading,
    setHolidaysDataLoading,
    holidaysData,
    setHolidaysData,
    handleImportData,
    handleCsvData,
    fetchHolidays,
    flattenData,
    convertDataToCSV,
    convertDataToJSON
  } = useContext(HolidaysContext)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };


  return (
    <div className='py-10 flex flex-col justify-center items-center gap-10'>
      <label htmlFor='holidaycsvfile'>Upload</label>
      <input type="file" 
      onChange={handleFileChange} 
      id="holidaycsvfile"
      className='hidden'
      />
      <button onClick={handleImportData}>Import Data to Firestore</button>
      <button onClick={fetchHolidays}>Fetch Data from Firestore</button>
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
