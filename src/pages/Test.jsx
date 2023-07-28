import React, { useState,useContext } from 'react';
import Papa from 'papaparse';
import { HolidaysContext } from '../context/HolidaysContext'
import { doc, setDoc, getDocs, updateDoc,collection,addDoc} from "firebase/firestore";
import { db } from '../firebase';


const Test = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const { holidaysData, setHolidaysData } = useContext(HolidaysContext)
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
    json_data.forEach( async(data) => {
      const docRef = await addDoc(collection(db, "holidays"), {
      data
      });
      console.log("Document written with ID: ", docRef.id);
    });
  };

  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = collection(db,"holidays");
      const snapshot = await getDocs(collectionRef);
      const fetched_data = snapshot.docs.map((doc) => doc.data());
     setFetchedData(fetched_data);
     //below function convert data into json
     convertDataToJSON()
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const flattenData = (data) => {
    const flattenedData = data.map((item) => {
      const flatItem = { ...item };
      Object.keys(flatItem).forEach((key) => {
        if (typeof flatItem[key] === 'object') {
          flatItem[key] = JSON.stringify(flatItem[key]);
        }
      });
      return flatItem;
    });
    return flattenedData;
  };
  
  const convertDataToCSV = () => {
    const flattenedData = flattenData(fetchedData);
    const csv = Papa.unparse(flattenedData, { header: true });
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvURL = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'fetched_data.csv');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };

  const convertDataToJSON = () => {
    const jsonData = fetchedData.map((item) => {
      // Check if date and name properties exist in the object
      console.log(item.data.Date.replace(/["']/g, ""))
      const date = item.date || (item.data && item.data.Date.replace(/["']/g, "")) || null;
      const name = item.name || (item.data && item.data.Holiday) || null;
      
      return { date, name };
    });
  
    setHolidaysData(jsonData)
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

export default Test;
