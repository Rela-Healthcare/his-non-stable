import React, { createContext, useState } from "react";

export const patientDataContext = createContext({});

const PatientDataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  return (
    <div>
      <patientDataContext.Provider value={{ data, setData }}>
        {children}
      </patientDataContext.Provider>
    </div>
  );
};

export default PatientDataProvider;
