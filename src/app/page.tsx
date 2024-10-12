"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, Lightbulb, Github, Linkedin, Mail, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!username) {
      setError("Please enter a username.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    try {
      const uploadResponse = await axios.post(
        "/api/proxy/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        const fetchResponse = await axios.get(
          `/api/proxy/resume/${username}`
        );
        const extractedData: ExtractedInfo = fetchResponse.data.extracted_info;
        setExtractedInfo(extractedData);
        toast.success("Resume uploaded and processed successfully!");
      } else {
        throw new Error("Error occurred during file upload");
      }
    } catch (err: any) {
      console.error("Error details:", err);
      let errorMessage = "An error occurred while processing your resume. Please try again.";
      if (err.response) {
        errorMessage = err.response.data.error || err.response.data.message || errorMessage;
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        console.error("No response received:", err.request);
        errorMessage = "No response received from the server. Please check your internet connection.";
      } else {
        console.error("Error setting up the request:", err.message);
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handlePublish = async () => {
    if (!extractedInfo || !username) {
      setError("Missing required information for publishing.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const vercelResponse = await axios.post(
        "/api/proxy/create-vercel-project",
        {
          username: username,
          extracted_info: extractedInfo,
        }
      );

      if (vercelResponse.status === 200) {
        const { url } = vercelResponse.data;
        setPublishedUrl(url);
        toast.success(`Website created! Visit: ${url}`);
      } else {
        throw new Error("Failed to create Vercel project");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "An error occurred while creating the Vercel project.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-lg p-4">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800">Upload Resume</CardTitle>
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
              className="bg-purple-600 text-white"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Resume"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>

      {extractedInfo && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="md:col-span-1 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                <Avatar className="mr-2">
                  <AvatarImage src="/avatar.png" alt="Avatar" />
                  <AvatarFallback>{extractedInfo.Name.charAt(0)}</AvatarFallback>
                </Avatar>
                {extractedInfo.Name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {extractedInfo.Email}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <Linkedin className="w-4 h-4" />{" "}
                <a href={extractedInfo.LinkedIn} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <Github className="w-4 h-4" />{" "}
                <a href={extractedInfo.GitHub} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Professional Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-60">
                {extractedInfo["Professional Experience"].map((exp, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {exp.Role}
                    </h3>
                    <p className="text-gray-600">{exp.Duration}</p>
                    <p className="text-gray-700">{exp.Description}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" /> Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-60">
                {extractedInfo.Projects.map((project, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {project.Name}
                    </h3>
                    <p className="text-gray-700">{project.Description}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {extractedInfo.Skills.map((skill, idx) => (
                  <Badge key={idx} className="text-sm">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {extractedInfo && (
        <div className="mt-8">
          <Button onClick={handlePublish} className="bg-green-600 text-white">
            Publish Portfolio
          </Button>
          {publishedUrl && (
            <div className="mt-4">
              <p className="text-lg">
                Portfolio published! View it at:{" "}
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {publishedUrl}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
