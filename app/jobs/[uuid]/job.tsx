'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';

interface Props {
  uuid: string
}

interface Company {
  id: number;
  name: string;
  website: string;
  description: string;
  location: string;
  rating: string;
  logo_url: string;
  banner_url: string;
}

interface JobPosting {
  id: string;
  title: string;
  company: Company;
  tags: string[];
  posted_at: string;
  location: string;
  job_description: string;
  salary_min: string;
  salary_max: string;
  currency: string;
  experience_required: string;
  perks_and_benefits: string;
}

export default function Profile({ uuid }: Props) {
  const [jobData, setjobData] = useState<JobPosting | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatSalary = (min: string, max: string) => {
    return `$${parseInt(min).toLocaleString()} - $${parseInt(max).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(
          `https://api-backend.mostlyevent.com/api/v1/jobs/job/share/${uuid}`
        )
        if (!res.ok) throw new Error('Failed to fetch user data')
        const json = await res.json()
        setjobData(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [uuid])



  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !jobData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-500">Error</h2>
            <p className="mt-2">{error || 'User not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{jobData.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground flex-wrap">
                  <Building2 className="w-4 h-4" />
                  <span>{jobData.company.name}</span>
                  <MapPin className="w-4 h-4 ml-2" />
                  <span>{jobData.location}</span>
                </div>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="text-lg font-semibold">
                  {formatSalary(jobData.salary_min, jobData.salary_max)}{" "}
                  <span className="text-sm text-muted-foreground">
                    {jobData.currency}/year
                  </span>
                </div>
                <div className="mt-4">
                  <a
                    href={`mostlyevents://mostlyevents.app/?id=${uuid}&type=JOB_ID&page=JOB_DETAILS`}
                    className="block sm:inline-block w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto">
                      Apply with Mostly Events
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {jobData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="job" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="job">Job Details</TabsTrigger>
                <TabsTrigger value="company">Company Details</TabsTrigger>
              </TabsList>
              <TabsContent value="job" className="mt-6 space-y-6">
                <div className="prose prose-gray max-w-none">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Posted</p>
                      <p className="font-medium">{formatDate(jobData.posted_at)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Experience Required</p>
                      <p className="font-medium">{jobData.experience_required}</p>
                    </div>
                  </div>
                  <ReactMarkdown >
                    {jobData.job_description}
                  </ReactMarkdown>
                  <div className="job-section">
                    <h1 className="text-2xl font-bold">Perks and Benefits</h1>
                    <ul>
                      {jobData.perks_and_benefits.split(', ').map((benefit) => (
                        <li key={benefit}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="company" className="mt-6">
                <div className="space-y-6">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src={jobData.company.banner_url}
                      alt={`${jobData.company.name} banner`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={jobData.company.logo_url}
                        alt={`${jobData.company.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{jobData.company.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-4 h-4" />
                        <a href={jobData.company.website} className="text-primary hover:underline">
                          Visit Website
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p>{jobData.company.description}</p>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{jobData.company.location}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}