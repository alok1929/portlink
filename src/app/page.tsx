"use client";
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useData } from "./DataContext";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


interface ExtractedInfo {
  Name: string;
  Email: string;
  GitHub: string;
  LinkedIn: string;
  Education: string[];
  "Professional Experience": Array<{
    role: string;
    description: string;
    duration: string;
  }>;
  Projects: Array<{
    project_name: string;
    description: string;
    technologies: string[];
  }>;
  "Questions and Answers": Array<{
    question: string;
    answer: string;
  }>;
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);

  const { setData } = useData();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadSuccess(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!username) {
      setError("Please enter a username");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    setLoading(true);
    setError(null);
    setUploadSuccess(false);
    setExtractedInfo(null);

    try {
      const uploadResponse = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.status === 200) {
        setUploadSuccess(true);

        const fetchResponse = await axios.get(`http://localhost:5000/resume/${username}`);

        const extractedData: ExtractedInfo = fetchResponse.data.extracted_info;
        setExtractedInfo(extractedData);
        setData(extractedData);

        console.log("Extracted Data:", extractedData);

        // Redirect to portfolio page after a short delay

      } else {
        throw new Error("Error occurred during file upload");
      }
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
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
            className="mb-4"
          />

          <Input
            id="resume"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="mb-4"
          />

          <Button
            onClick={handleUpload}
            disabled={loading || !file || !username}
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
            <AlertDescription>
              Resume uploaded successfully! Redirecting to portfolio...
            </AlertDescription>
          </Alert>
        )}

        {extractedInfo && (
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Extracted Resume Information</h2>
            <div className="mb-4">
              <h3 className="font-bold">Name:</h3>
              <p>{extractedInfo.Name}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Email:</h3>
              <p>{extractedInfo.Email}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Email:</h3>
              <p>{extractedInfo.GitHub}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Email:</h3>
              <p>{extractedInfo.LinkedIn}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Professional Experience:</h3>
              <ul>
                {extractedInfo["Professional Experience"].map((exp, index) => (
                  <li key={index}>{exp.Role} - {exp.Duration}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Projects:</h3>
              <ul>
                {extractedInfo['Projects'].map((project, index) => (
                  <div key={index}>
                    <h4>{project['Project Name']}</h4>

                    <p>{project['Description']}</p>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}


        <div className="mt-8">
          <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>
    <h2 className="text-xl font-semibold">Instructions</h2>
    </AccordionTrigger>
    <AccordionContent>
    <ol className="list-decimal pl-5">
      <li className="mb-2">Enter your desired username.</li>
      <li className="mb-2">Prepare your resume in PDF format.</li>
      <li className="mb-2">Click the 'Choose File' button and select your resume PDF.</li>
      <li className="mb-2">Click the 'Upload Resume' button to process your resume.</li>
      <li className="mb-2">Wait for the upload to complete. This may take a few moments.</li>
      <li>Once successful, you'll be redirected to your portfolio page.</li>
    </ol>
    </AccordionContent>
  </AccordionItem>
</Accordion>

        </div>
      </div>
    </div>
  );
}