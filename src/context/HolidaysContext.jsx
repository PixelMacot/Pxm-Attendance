import { createContext, useEffect, useState } from "react";
import { doc, setDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import Papa from 'papaparse';
import moment from 'moment'
export const HolidaysContext = createContext();

export const HolidaysContextProvider = ({ children }) => {
  const [fetchedData, setFetchedData] = useState([]);
  const [holidaysDataLoading, setHolidaysDataLoading] = useState(true);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [holidaysData, setHolidaysData] = useState(
    [
      { "date": "05-07-2023", "name": "Independence Day" },
      { "date": "15-07-2023", "name": "Second Saturday" }
    ]
  )
  useEffect(() => {
    fetchHolidays().then(() => {
      filterHolidays()
    })
  }, [])

  const filterHolidays = () => {
    const currentDate = moment(new Date()).format("DD-MM-YYYY")
    const filteredHolidays = holidaysData.filter((holiday) => holiday.date === currentDate);
    setFilteredHolidays(filteredHolidays);
  }
  const handleImportData = () => {
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

  const handleCsvData = () => {
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
    json_data.forEach(async (data) => {
      const docRef = await addDoc(collection(db, "holidays"), {
        data
      });
      console.log("Document written with ID: ", docRef.id);
    });
  };

  const fetchHolidays = async () => {
    try {
      const collectionRef = collection(db, "holidays");
      const snapshot = await getDocs(collectionRef);
      const fetched_data = snapshot.docs.map((doc) => doc.data());
      setFetchedData(fetched_data);
      //below function convert data into json
      console.log(fetched_data)
      const jsonData = fetched_data.map((item) => {
        // Check if date and name properties exist in the object
        console.log(item.slug)
        const date = item.date || (item && item.Date.replace(/["']/g, "")) || null;
        const name = item.name || (item && item.Name) || null;
        const slug = item.slug || (item && item.slug) || null;
        return { date, name, slug };
      });
      console.log(jsonData)
      setHolidaysData(jsonData)
      setHolidaysDataLoading(false)
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

  // const convertDataToJSON = () => {
  //   const jsonData = fetchedData.map((item) => {
  //     // Check if date and name properties exist in the object
  //     console.log(item.slug)
  //     const date = item.date || (item && item.Date.replace(/["']/g, "")) || null;
  //     const name = item.name || (item && item.Name) || null;
  //      const slug = item.slug || (item && item.slug) || null;
  //     return { date, name,slug };
  //   });
  //   console.log(jsonData)
  //   setHolidaysData(jsonData)
  // };
  
  return (
    <HolidaysContext.Provider value={{
      holidaysDataLoading,
      setHolidaysDataLoading,
      holidaysData,
      setHolidaysData,
      handleImportData,
      handleCsvData,
      fetchHolidays,
      flattenData,
      convertDataToCSV,
      filteredHolidays
    }}>
      {children}
    </HolidaysContext.Provider>
  );
};