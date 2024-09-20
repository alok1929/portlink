"use client"
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useData } from "./DataContext";
import { useRouter } from 'next/navigation';

interface ExtractedInfo {
  [key: string]: string[];
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const { setData } = useData();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadSuccess(false);
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
    setUploadSuccess(false);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const extractedData: ExtractedInfo = response.data.extracted_info;
      setData(extractedData);
      console.log("Data set in context:", extractedData);
      setUploadSuccess(true);
      setTimeout(() => {
        router.push('/portfolio');
      }, 2000); // Delay navigation to show success message
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
        <div className="flex flex-col mb-4">
          <Input
            id="resume"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="mb-4"
          />
          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full"
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {uploadSuccess && (
          <Alert variant="default" className="mb-4 text-black bg-green-100 border-green-400">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Resume uploaded successfully! Redirecting to portfolio...</AlertDescription>
          </Alert>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal pl-5">
            <li className="mb-2">Prepare your resume in PDF format.</li>
            <li className="mb-2">Click the 'Choose File' button and select your resume PDF.</li>
            <li className="mb-2">Click the 'Upload Resume' button to process your resume.</li>
            <li className="mb-2">Wait for the upload to complete. This may take a few moments.</li>
            <li>Once successful, you'll be redirected to your portfolio page.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}