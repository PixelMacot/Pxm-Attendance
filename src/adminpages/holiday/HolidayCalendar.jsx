import React, { useState, useContext, useEffect } from 'react';
import Papa from 'papaparse';
import { HolidaysContext } from '../../context/HolidaysContext'
import { doc, setDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';
import Loader from '../../components/loader/Loader';


const HolidayCalendar = () => {
  const [loader, setLoader] = useState(false)
  const [csvFile, setCsvFile] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const {
    holidaysData,
    fetchHolidays,
    convertDataToJSON
  } = useContext(HolidaysContext)

  useEffect(() => {
    fetchHolidays()
  }, [])


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setLoader(true)
    setCsvFile(file);
    handleImportData(file)
    convertDataToJSON(file)
  };

  const handleImportData = (csvFile) => {
    if (csvFile) {
      Papa.parse(csvFile, {
        header: true,
        complete: (results) => {
          const json_data = results.data;
          console.log(json_data)
          uploadToFirestore(json_data);
        },
      });
    }
  };

  const uploadToFirestore = (json_data) => {
    json_data.forEach(async (data) => {
      const docRef = await addDoc(collection(db, "holidays"), {
        data
      });
      console.log("Document written with ID: ", docRef.id);
      setLoader(false)
    });
  };

  return (
    <div className='py-10 flex flex-col justify-center items-center gap-10'>
      <label htmlFor='holidaycsvfile'>
        <img src='/uploadfile.png'
          className='w-[60%] mx-auto'
        />
      </label>
      <input type="file"
        onChange={handleFileChange}
        id="holidaycsvfile"
        className='hidden'
      />
      {/* <button onClick={handleImportData}>Import Data to Firestore</button>
      <button onClick={fetchHolidays}>Fetch Data from Firestore</button>
      <button onClick={convertDataToCSV}>Download CSV</button>
      <button onClick={convertDataToJSON}>Convert to JSON</button> */}
      {
        loader && (
          <Loader />
        )
      }
      <div>
        <h2>Fetched Data:</h2>
        <ul>
          {
            holidaysData.map((item) => {
              console.log(item)
              return (
                <li>{item.date}:{item.name}</li>
              )
            })
          }
        </ul>
      </div>
    </div>
  );
};

export default HolidayCalendar;
