// app/[uuid]/Profile.tsx
'use client'

import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Award,
  Trophy,
  Star,
  Medal
} from 'lucide-react'

interface Props {
  uuid: string
}

interface UserData {
  email: string
  first_name: string
  last_name: string
  role: string
  phone_number: string
  date_of_birth: string
  profile_picture: string
  banner_picture: string | null
  work_title: string | null
  resume: string
  city: string
  skills: string[]
  bio: string
  description: string
  educations: Array<{
    id: number
    institute: string
    degree: string
    field_of_study: string
    start_date: string
    end_date: string | null
    currently_studying: boolean
    mode_of_education: string | null
  }>
  work_experience: string
  experiences: Array<{
    id: number
    company: string
    job_type: string
    title: string
    description: string
    start_date: string
    end_date: string | null
    location: string
    currently_working: boolean
  }>
  job_preference: {
    id: number
    industry: string[]
    employment_type: string[]
    prefered_city: string
  }
  languages: Array<{
    id: number
    language: string
    proficiency: string
  }>
  badge: number
}

export default function Profile({ uuid }: Props) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(
          `https://api-backend.mostlyevent.com/api/v1/profile/user/public-profile/${uuid}`
        )
        if (!res.ok) throw new Error('Failed to fetch user data')
        const json = await res.json()
        setUser(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [uuid])

  const getMedals = (badge: number) => {
    const medals: { icon: any; label: string; color: string }[] = []
    if (badge >= 3) medals.push({ icon: Trophy, label: 'Top Performer', color: 'text-yellow-500' })
    if (badge >= 2) medals.push({ icon: Star, label: 'Rising Star', color: 'text-blue-500' })
    if (badge >= 1) medals.push({ icon: Medal, label: 'Promising Talent', color: 'text-green-500' })
    return medals
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !user) {
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
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* === Header Section === */}
        <Card className="relative overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-primary/60" />
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-background -mt-12">
              <img
                src={user.profile_picture}
                alt={`${user.first_name} ${user.last_name}`}
              />
            </Avatar>
            <div className="flex-grow space-y-2">
              <h1 className="text-2xl font-bold">
                {user.first_name} {user.last_name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>{user.work_title || 'Not specified'}</span>
                <span className="mx-2">•</span>
                <MapPin className="w-4 h-4" />
                <span>{user.city}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {getMedals(user.badge).map((medal, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <medal.icon className={`w-6 h-6 ${medal.color}`} />
                  <span className="text-sm font-medium">{medal.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* === About Me === */}
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{user.bio}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{user.phone_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{user.date_of_birth}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span>{user.work_experience}</span>
              </div>
            </div>

            <h3 className="font-semibold mt-6 mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang) => (
                <Badge key={lang.id} variant="outline">
                  {lang.language} - {lang.proficiency}
                </Badge>
              ))}
            </div>

            <h3 className="font-semibold mt-6 mb-2">Job Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Industries</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.job_preference.industry.map((i) => (
                    <Badge key={i} variant="secondary">
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employment Types</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.job_preference.employment_type.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm flex items-center">
              <MapPin className="w-4 h-4 inline mr-1" />
              Preferred Location: {user.job_preference.prefered_city}
            </p>
          </CardContent>
        </Card>

        {/* === Experience === */}
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user.experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary pl-4 pb-4">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.company} • {exp.job_type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {exp.start_date} –{' '}
                  {exp.currently_working ? 'Present' : exp.end_date}
                </p>
                <p className="mt-2">{exp.description}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{exp.location}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* === Education === */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user.educations.map((edu) => (
              <div key={edu.id} className="border-l-2 border-primary pl-4 pb-4">
                <h3 className="font-semibold">
                  {edu.degree} in {edu.field_of_study}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {edu.institute}
                </p>
                <p className="text-sm text-muted-foreground">
                  {edu.start_date} –{' '}
                  {edu.currently_studying ? 'Present' : edu.end_date}
                </p>
                {edu.mode_of_education && (
                  <Badge variant="outline" className="mt-2">
                    {edu.mode_of_education}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}