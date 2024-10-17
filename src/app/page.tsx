"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface ResumeInfo {
  Name: string;
  Email: string;
  GitHub: string;
  LinkedIn: string;
  Education: string[];
  "Professional Experience": string[];
  Projects: string[];
  Skills: string[];
  "Questions and Answers": string[];
}

const FileUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFilenameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setResumeInfo(null);

    if (!file || !filename || !username) {
      setMessage("Please fill in all fields and select a file!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);
    formData.append('username', username);

    try {
      const response = await axios.post('https://portlinkpy.vercel.app/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`File uploaded successfully: ${response.data.message}`);
      setResumeInfo(response.data.resume_info);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      setMessage(`Error uploading file: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload a Resume</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="username" className="block">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="filename" className="block">Filename:</label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={handleFilenameChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="file" className="block">Select File:</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="mb-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
      </form>
      {message && <p className="mb-4">{message}</p>}
      {resumeInfo && (
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Extracted Resume Information</h2>
          <p><strong>Name:</strong> {resumeInfo.Name}</p>
          <p><strong>Email:</strong> {resumeInfo.Email}</p>
          <p><strong>GitHub:</strong> {resumeInfo.GitHub}</p>
          <p><strong>LinkedIn:</strong> {resumeInfo.LinkedIn}</p>
          
          <h3 className="font-semibold mt-4">Education</h3>
          <ul className="list-disc pl-5">
            {resumeInfo.Education.map((edu, index) => (
              <li key={index}>{edu}</li>
            ))}
          </ul>
          
          <h3 className="font-semibold mt-4">Professional Experience</h3>
          <ul className="list-disc pl-5">
            {resumeInfo["Professional Experience"].map((exp, index) => (
              <li key={index}>{exp}</li>
            ))}
          </ul>
          
          <h3 className="font-semibold mt-4">Projects</h3>
          <ul className="list-disc pl-5">
            {resumeInfo.Projects.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
          
          <h3 className="font-semibold mt-4">Skills</h3>
          <ul className="list-disc pl-5">
            {resumeInfo.Skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          
          <h3 className="font-semibold mt-4">Questions and Answers</h3>
          <ul className="list-disc pl-5">
            {resumeInfo["Questions and Answers"].map((qa, index) => (
              <li key={index}>{qa}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;