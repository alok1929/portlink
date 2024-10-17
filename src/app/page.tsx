"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portlinkpy.vercel.app';

interface ExtractedInfo {
  Name: string;
  Email: string;
  LinkedIn: string;
  GitHub: string;
  "Professional Experience": Array<{
    Role: string;
    Duration: string;
    Description: string;
  }>;
  Projects: Array<{
    Name: string;
    Description: string;
  }>;
  Skills: string[];
}

export default function ResumeUploadPortfolio() {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    
    if (!username) {
      toast.error("Please enter a username.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    try {
      // Direct API call to Flask backend
      const uploadResponse = await axios.post(
        `${API_BASE_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          }
        }
      );

      if (uploadResponse.data.success) {
        setExtractedInfo(uploadResponse.data.extracted_info);
        toast.success("Resume uploaded and processed successfully!");

        // Create Vercel project after successful upload
        try {
          const vercelResponse = await axios.post(
            `${API_BASE_URL}/api/create-vercel-project`,
            {
              username,
              extracted_info: uploadResponse.data.extracted_info
            },
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );

          if (vercelResponse.data.url) {
            toast.success(`Portfolio created at: ${vercelResponse.data.url}`);
          }
        } catch (vercelError: any) {
          console.error('Error creating portfolio:', vercelError);
          toast.error('Portfolio created but deployment failed. Please try again later.');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error uploading file";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username"
              />
            </div>
            <div>
              <Label htmlFor="file">Resume (PDF only)</Label>
              <Input
                type="file"
                id="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upload Resume"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
      {extractedInfo && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(extractedInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}