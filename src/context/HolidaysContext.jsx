import { createContext, useEffect, useState } from "react";

export const HolidaysContext = createContext();

export const HolidaysContextProvider = ({ children }) => {
  const [holidaysData, setHolidaysData] = useState(
    [
      { "date": "2023-07-04", "name": "Independence Day" },
      { "date": "2023-07-08", "name": "Second Saturday" }
    ]
    )
  return (
    <HolidaysContext.Provider value={{ holidaysData, setHolidaysData }}>
      {children}
    </HolidaysContext.Provider>
  );
};