"use client";
import React, { useEffect, useState } from "react";
import { useData } from "../../DataContext"; // Adjust the import path if necessary
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Github, Linkedin, Mail, Briefcase, GraduationCap, Lightbulb } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PublishButton from "../publish"; // Adjust the import path if necessary
import Head from 'next/head';

const extractJobTitleAndEmployer = (fullTitle: string) => {
  const atIndex = fullTitle.lastIndexOf(" at ");
  if (atIndex !== -1) {
    return {
      jobTitle: fullTitle.substring(0, atIndex).trim(),
      employer: fullTitle.substring(atIndex + 4).trim(),
    };
  }
  return { jobTitle: fullTitle, employer: "" };
};

interface PortfolioProps {
  params: {
    username: string;
  };
}

export default function Portfolio({ params }: PortfolioProps) {
  const { username } = params;
  const { data, fetchData } = useData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchData(username);
      setIsLoading(false);
    };
    loadData();
  }, [username, fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">No data available. Please upload a resume first.</p>
      </div>
    );
  }else{
    console.log("Data set in context:", data);
  }

  const jobEntries = data['Professional Experience'] ? Object.entries(data['Professional Experience']) : [];
  const education = data['Education'] || [];
  const projects = data['Projects'] || [];
  const questions = data['Questions'] ? Object.entries(data['Questions']) : [];

  const shouldScroll = jobEntries.length > 3 || education.length > 3 || projects.length > 3 || questions.length > 3;

  return (
    <>
      <Head>
        <title>{data.Name?.[0] || "Portfolio"} | Resume</title>
        <meta name="description" content={`Professional portfolio of ${data.Name?.[0] || "a professional"}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Profile Card */}
            <Card className="md:col-span-2 row-span-2 bg-gradient-to-br from-purple-400 via-red-500 to-yellow-200">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={data.Name?.[0] || "Profile Photo"} />
                  <AvatarFallback>{data.Name?.[0]?.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold mb-2 text-white">{data.Name?.[0] || "Name Not Provided"}</h1>
                <div className="flex space-x-4">
                  {data?.GitHub?.[0] && data.GitHub[0] !== "Not provided" && (
                    <a href={data.GitHub[0]} className="text-white hover:text-gray-200" target="_blank" rel="noopener noreferrer">
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {data?.LinkedIn?.[0] && data.LinkedIn[0] !== "Not provided" && (
                    <a href={data.LinkedIn[0]} className="text-white hover:text-gray-200" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {data?.Email?.[0] && (
                    <a href={`mailto:${data.Email[0]}`} className="text-white hover:text-gray-200">
                      <Mail className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Experience Card */}
            <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className={shouldScroll ? 'h-[500px]' : ''}>
                <div className="space-y-4">
                  {jobEntries.map(([fullTitle, details], index) => {
                    const { jobTitle, employer } = extractJobTitleAndEmployer(fullTitle);
                    return (
                      <div key={index} className="mb-4 space-y-2">
                        <h2 className="text-lg font-bold mb-1">{jobTitle}</h2>
                        {employer && <h3 className="text-md font-semibold mb-2 text-gray-600">{employer}</h3>}
                        {Array.isArray(details) && details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="mb-2 space-y-2">
                            <Badge typeof="outline">{detail.duration}</Badge>

                            <p className="text-gray-700">{detail.description}</p>
                          </div>
                        ))}
                        {index < jobEntries.length - 1 && <Separator className="my-4" />}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

            {/* Education Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className={shouldScroll ? 'h-[300px]' : ''}>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="mb-4">
                       {edu}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Projects Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className={shouldScroll ? 'h-[300px]' : ''}>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <h2 className="text-lg font-bold mb-1">{project.project_name}</h2>
                        <p className="text-gray-700">{project.description}</p>
                        {project.technologies && (
                          <p className="text-sm text-gray-500 mt-1">Technologies: {project.technologies}</p>
                        )}
                        {index < projects.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Questions Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="">
                  {questions.map(([question, answer], index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="font-bold">{question}</AccordionTrigger>
                      <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Publish Button Component */}
            <PublishButton username={username} />
          </div>
        </div>
      </div>
    </>
  );
}