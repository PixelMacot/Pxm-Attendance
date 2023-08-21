import React, { useState, useContext, useEffect } from 'react';
import Papa from 'papaparse';
import { HolidaysContext } from '../../context/HolidaysContext'
// import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
// import { db } from '../../firebase';
import { doc, setDoc, getDocs, updateDoc, collection, addDoc, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import Loader from '../../components/loader/Loader';
import './holiday.scss'

const HolidayCalendar = () => {
  const [loader, setLoader] = useState(false)
  const [csvFile, setCsvFile] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const [msg, setMsg] = useState()

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
      // let slug = createSlug(data.date)
      console.log(data.date)
      let slug = data.Date
      if (slug) {
        const docRef = await setDoc(doc(db, "holidays", slug), {
          Date: data.Date ? data.Date : 'notprovided',
          Name: data.name ? data.name : 'notprovided',
          slug: data.Date ? data.Date : 'notprovided'
        });
      }
      // console.log("Document written with ID: ", docRef.id);
      setLoader(false)
    });
  };

  const DeleteHoliday = async (e) => {
    e.preventDefault()
    let id = e.target.id
    console.log(id)
    await deleteDoc(doc(db, "holidays", id)).then(() => {

      setMsg('Holiday deleted Successfully')
      fetchHolidays()
    }).catch((err) => {
      setMsg('A error occured while deleting Holiday')
    })
  }

  return (
    <div className='holidays-container'>
      <div className="upload-holidays-container">
        <h1>Upload holidays Data from csv file</h1>
        <label htmlFor='holidaycsvfile'>
          <img src='/uploadfile.png'
            className='w-[95%] mx-auto'
          />
        </label>
        <input type="file"
          onChange={handleFileChange}
          id="holidaycsvfile"
          className='hidden'
        />
      </div>
      {
        loader && (
          <Loader />
        )
      }
      <div>
        <h2 className='text-xl font-bold my-5'>Total Holidays</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Holiday</th>
            <th>Delete</th>
          </tr>

          {holidaysData.map((item, index) => {
            return (
              <tr key={index} >
                <td >{item.date}</td>
                <td>{item.name}</td>
                <td id={item.slug}
                  onClick={DeleteHoliday}
                  className='delete-btn bg-[url(/delete.png)]'
                >
                  {/* <img src="/delete.png" /> */}
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default HolidayCalendar;
