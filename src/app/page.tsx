"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosProgressEvent } from 'axios';

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
  const [error, setError] = useState<string | null>(null);
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError(null);
    setResumeInfo(null);
    setUploadProgress(0);

    if (!file || !filename || !username) {
      setError("Please fill in all fields and select a file!");
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
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
        timeout: 60000,
      });

      setMessage(response.data.message || 'Upload successful');

      if (response.data.resume_info) {
        setResumeInfo(response.data.resume_info);
      } else {
        setError('No resume information received from server');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
          error.response?.statusText ||
          error.message ||
          'An error occurred during upload'
        );
      } else {
        setError('An unexpected error occurred during upload');
      }
    } finally {
      setUploadProgress(0);
    }
  };

  const handlePublish = async () => {
    if (!username) {
      setError("Please enter a username before publishing.");
      return;
    }

    setIsPublishing(true);
    setError(null);
    setMessage('Creating your resume website...');

    try {
      const response = await axios.post(
        'https://portlinkpy.vercel.app/api/create-vercel-project',
        { username },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 120000,
        }
      );

      if (response.data.deploymentUrl) {
        // Use the URL as-is without modification
        setPublishedUrl(response.data.deploymentUrl);
        setMessage(
          `Success! Your resume website is being created at: ${response.data.deploymentUrl}\n\n` +
          'Please note it may take a few minutes for your site to be fully deployed.'
        );
      } else {
        throw new Error('No deployment URL received from server');
      }
    } catch (error) {
      console.error('Error publishing resume:', error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
          error.response?.statusText ||
          error.message ||
          'Failed to publish resume'
        );
      } else {
        setError('An unexpected error occurred while publishing');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload a Resume</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Upload
        </button>
      </form>

      {uploadProgress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{uploadProgress}% Uploaded</p>
        </div>
      )}

      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
          {message}
        </div>
      )}

      {resumeInfo && (
        <>
          <div className="border p-4 rounded mb-4">
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

          <div className="mt-4">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`${isPublishing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
                } text-white px-4 py-2 rounded transition-colors`}
            >
              {isPublishing ? 'Publishing...' : 'Publish Resume Website'}
            </button>
          </div>
        </>
      )}

      {publishedUrl && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-green-800">Your resume is live!</h3>
          <p className="mt-2">
            View your resume at:{' '}
            <a
              href={`https://${publishedUrl}`}
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