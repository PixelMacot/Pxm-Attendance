import React from "react";

export const ConvertToExcel = ({arr}) => {
  const exportToCsv = () => {
   console.log(JSON.stringify(arr))
  };
  return (
    <div>
      <h2>Present Dates</h2>
     {
      arr.map((item)=>{
        return(
          <li 
          key={item}
          className="list-none p-2"
          >{item}</li>
        )
      })
     }
    </div>
  );
};