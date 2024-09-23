"use client";
import React, { createContext, useState, useContext, useCallback } from "react";

// Define the shape of the data
interface ExtractedInfo {
  [key: string]: string[];
}

// Define the context shape including the fetchData function
interface DataContextType {
  data: ExtractedInfo | null;
  setData: React.Dispatch<React.SetStateAction<ExtractedInfo | null>>;
  fetchData: (username: string) => Promise<void>;
}

// Create a context with the default value
const DataContext = createContext<DataContextType>({
  data: null,
  setData: () => {},
  fetchData: async () => {}, // Default empty async function
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ExtractedInfo | null>(null);

  const fetchData = useCallback(async (username: string) => {
    try {
      // Adjust fetch URL to point to the Flask backend
      const response = await fetch(`http://localhost:5000/api/user-data/${username}`);
      if (response.ok) {
        const userData = await response.json();
        setData(userData);
      } else {
        console.error('Failed to fetch user data');
        setData(null);
      }
    } catch (error) {
      console.error('An error occurred while fetching user data:', error);
      setData(null);
    }
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook for accessing the context
export const useData = () => useContext(DataContext);