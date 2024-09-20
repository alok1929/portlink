"use client";

import React from "react";
import { useData } from "../DataContext"; // Ensure this import is correct
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Briefcase, GraduationCap, Lightbulb, Music } from "lucide-react";
import { AccordionTrigger,AccordionItem,Accordion, AccordionContent } from "@/components/ui/accordion";

export default function Portfolio() {
  const { data } = useData();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">No data available. Please upload a resume first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile Card */}
          <Card className="md:col-span-2 row-span-2">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={data.Name?.[0] || "Profile Photo"} />
                <AvatarFallback>{data.Name?.[0]?.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
              </Avatar>
              <h1 className="text-3xl font-bold mb-2">{data.Name?.[0] || "Name Not Provided"}</h1>
              <div className="flex space-x-4">
                {data?.GitHub?.[0] && (
                  <a href={data.GitHub[0]} className="text-gray-600 hover:text-gray-900">
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {data?.Linkedin?.[0] && (
                  <a href={data.Linkedin[0]} className="text-gray-600 hover:text-gray-900">
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
                {data?.Email?.[0] && (
                  <a href={`mailto:${data.Email[0]}`} className="text-gray-600 hover:text-gray-900">
                    <Mail className="w-6 h-6" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.Education?.map((edu, index) => (
                <div key={index} className="mb-2">
                  <p>{edu}</p>
                </div>
              ))}
            </CardContent>
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
                {data.Skills?.map((skill, index) => (
                  <Badge key={index}>{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          

          {/* Experience Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Recent Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data['Professional Experience']?.map((exp, index) => (
                  <li key={index}>
                    <p>{exp}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Projects Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.Projects?.map((project, index) => (
                <div key={index} className="mb-2">
                  <p>{project}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* questions Card */}
          <Card className="md:col-span-2">
  <CardHeader>
    <CardTitle className="flex items-center">
      <Briefcase className="w-5 h-5 mr-2" />
      Questions
    </CardTitle>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      {data['Questions']?.map((exp, index) => (
        <li key={index}>
          <Accordion type="single" collapsible>
            <AccordionItem value={`item-${index}`} className="w-full">
              <AccordionTrigger>{exp}</AccordionTrigger>
              <AccordionContent>
                <div>answers not provided</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>
      ))}
    </ul>
  </CardContent>
</Card>


         </div>
         </div> 
         </div>
         
  )
              }