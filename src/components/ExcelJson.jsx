import React, { useState,useContext } from 'react';
import * as XLSX from 'xlsx';
import { HolidaysContext } from '../context/HolidaysContext'


const ExcelJson = () => {
  const [data, setData] = useState([]);
  const {holidaysData,setHolidaysData} = useContext(HolidaysContext)

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the first sheet is the data
      const sheetName = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setData(jsonData)
      setHolidaysData(jsonData)
      console.log(jsonData)
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".xlsx" />
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value.replace(/['"]+/g, '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelJson;
