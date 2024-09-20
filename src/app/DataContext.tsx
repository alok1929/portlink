"use client"
import React, { createContext, useState, useContext } from "react";

// Define the shape of the data
interface ExtractedInfo {
  [key: string]: string[];
}

// Create a context
const DataContext = createContext<{
  data: ExtractedInfo | null;
  setData: React.Dispatch<React.SetStateAction<ExtractedInfo | null>>;
}>({
  data: null,
  setData: () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ExtractedInfo | null>(null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook for accessing the context
export const useData = () => useContext(DataContext);
