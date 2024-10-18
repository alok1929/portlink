"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface ResumeInfo {
  Name: string;
  Email: string;
  GitHub: string;
  LinkedIn: string;
  Education: string[];
  "Professional Experience": Array<{
    Role: string;
    Duration: string;
    Description: string;
  }>;
  Projects: Array<{
    Name: string;
    Description: string;
    Technologies: string[];
  }>;
  Skills: string[];
  "Questions and Answers": Array<{
    Question: string;
    Answer: string;
  }>;
}

const FileUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
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
      setMessage(`${response.data.message}`);
      console.log('Response data:', response.data);
      if (response.data.resume_info) {
        setResumeInfo(response.data.resume_info);
      } else {
        console.error('No resume_info in response data');
      }
    } catch (error) {
      setMessage(`Error uploading file: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Error uploading file:', error);
    }
  };

  const handlePublish = async () => {
    if (!username) {
      setMessage("Please enter a username before publishing.");
      return;
    }

    setMessage('Creating your resume website...');

    try {
      const response = await axios.post('https://portlinkpy.vercel.app/api/create-vercel-project', {
        username
      });

      if (response.data.url) {
        setPublishedUrl(response.data.url);
        setMessage(`Success! Your resume is now live at: ${response.data.url}`);
      } else {
        setMessage('Failed to get the published URL.');
      }
    } catch (error) {
      setMessage(`Error publishing resume: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Error publishing resume:', error);
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
              <li key={index}>
                <strong>{exp.Role}</strong> ({exp.Duration})
                <p>{exp.Description}</p>
              </li>
            ))}
          </ul>

          <h3 className="font-semibold mt-4">Projects</h3>
          <ul className="list-disc pl-5">
            {resumeInfo.Projects.map((project, index) => (
              <li key={index}>
                <strong>{project.Name}</strong>
                <p>{project.Description}</p>
                <p><strong>Technologies:</strong> {project.Technologies.join(', ')}</p>
              </li>
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
              <li key={index}>
                <strong>Q: {qa.Question}</strong>
                <p>A: {qa.Answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}


      {resumeInfo && (
        <div className="mt-4">
          <button
            onClick={handlePublish}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Publish Resume Website
          </button>
        </div>
      )}

      {/* Add this section to display the published URL */}
      {publishedUrl && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-green-800">Your resume is live!</h3>
          <p className="mt-2">
            View your resume at:{' '}
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {publishedUrl}
            </a>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Note: It may take a few minutes for your site to be fully deployed.
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;

function setPublishedUrl(url: any) {
  throw new Error('Function not implemented.');
}
