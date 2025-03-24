import React, { useState } from "react";

export const ResetContext = React.createContext({});

const ResetContextProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <ResetContext.Provider value={{ inputValue, setInputValue }}>
      {children}
    </ResetContext.Provider>
  );
};

export default ResetContextProvider;
