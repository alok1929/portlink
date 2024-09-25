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
import { Briefcase, Lightbulb, Github, Linkedin, Mail } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ExtractedInfo {
  Name: string;
  Email: string;
  GitHub: string;
  LinkedIn: string;
  Education: string[];
  "Professional Experience": Array<{
    Role: string;
    Description: string;
    Duration: string;
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
  "Skills": string[];
}

export default function ResumeUploadPortfolio() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!username) {
      setError('Please enter a username.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    try {
      const uploadResponse = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.status === 200) {
        const fetchResponse = await axios.get(`http://localhost:5000/resume/${username}`);
        const extractedData: ExtractedInfo = fetchResponse.data.extracted_info;
        console.log(extractedData);
        setExtractedInfo(extractedData);
      } else {
        throw new Error("Error occurred during file upload");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred while processing your resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="mx-auto py-3 sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-gray-900">PortLink</h1>
          </div>
        </header>
        <main className="p-4 overflow-auto">
          {!extractedInfo ? (
            <div className="max-w-md mx-auto">
              <Card className="bg-white shadow">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">Upload Your Resume</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        className="mt-1"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="resume" className="text-sm font-medium text-gray-700">
                        Upload your resume (PDF)
                      </Label>
                      <div className="mt-1 flex items-center">
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <Label
                          htmlFor="resume"
                          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Choose file
                        </Label>
                        <span className="ml-3 text-sm text-gray-500">
                          {file ? file.name : 'No file chosen'}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isUploading || !file || !username}
                      className="w-full bg-purple-600 text-white hover:bg-purple-700"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Resume'}
                    </Button>
                  </form>
                  {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-auto">
              {/* Profile Card */}
              <Card className="md:col-span-1 row-span-2">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <h1 className="text-3xl font-bold mb-2">{extractedInfo.Name}</h1>
                  <div className="flex space-x-4">
                    <a href={`https://github.com/${extractedInfo.GitHub}`} className="text-gray-600 hover:text-gray-900">
                      <Github className="w-6 h-6" />
                    </a>
                    <a href={`https://www.linkedin.com/in/${extractedInfo.LinkedIn}`} className="text-gray-600 hover:text-gray-900">
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a href={`mailto:${extractedInfo.Email}`} className="text-gray-600 hover:text-gray-900">
                      <Mail className="w-6 h-6" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Experience Card */}
              <Card className="md:col-span-2 row-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="h-[400px]">
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {extractedInfo["Professional Experience"].map((exp, idx) => (
                        <Card key={idx} className="p-4">
                          <h3 className="font-bold text-lg">{exp.Role}</h3>
                          <p className="text-sm text-muted-foreground">{exp.Description}</p>
                          <Badge variant="outline" className="mt-2 text-sm font-semibold text-black border-2 border-black">
                            {exp.Duration}
                          </Badge>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>

              {/* Skills Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {extractedInfo.Skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="px-4 py-2 text-sm font-semibold text-black border-2 border-black">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Projects Card */}
              <Card className="md:col-span-2 row-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Github className="w-5 h-5 mr-2" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="h-[100px]">
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {extractedInfo.Projects.map((project, idx) => (
                        <AccordionItem key={idx} value={`project-${idx}`}>
                          <AccordionTrigger>{project.project_name}</AccordionTrigger>
                          <AccordionContent>
                            <p>{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.technologies.map((tech, idx) => (
                                <Badge key={idx} variant="outline" className="px-2 py-1 text-sm">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </ScrollArea>
              </Card>

              <div className="flex gap-2">
                {/* Questions and Answers Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Questions & Answers</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="education">
                      <AccordionTrigger>Questions</AccordionTrigger>
                      <AccordionContent>
                        {extractedInfo["Questions and Answers"].map((question, idx) => (
                          <div key={idx} className="mb-4">
                            <h3 className="font-semibold text-md">{question.question}</h3>
                            <p className="text-sm">{question.answer}</p>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              <div className="bg-blue-500 w-full h-full rounded-md flex justify-center items-center">
                <Button>
                <Badge variant="default" className="text-white p-2 py-2 px-2">
                    Publish
                </Badge>
                </Button>
              </div>
              </div>
              
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}
