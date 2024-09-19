"use client"
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ExtractedInfo {
  [key: string]: string[];
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ExtractedInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData(response.data.extracted_info);
    } catch (error: any) {
      console.error("Error uploading file", error);
      setError(error.response?.data?.error || "An error occurred while uploading the file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl text-black font-bold mb-4">Upload Your Resume</h1>
        <div className="flex items-center mb-4">
          <Input
            id="resume"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="flex-grow"
          />
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="ml-4"
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Extracted Information</h2>
            {Object.entries(data).map(([category, items], index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">{category}</h3>
                <ul className="list-disc pl-5">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}