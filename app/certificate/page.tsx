"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Award, Calendar, User, BookOpen, Download, AlertCircle } from 'lucide-react';

interface CertificateData {
  user_name: string;
  course_title: string;
  completed_at: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: CertificateData;
  errors?: string;
}

export default function CertificatePage() {
  const searchParams = useSearchParams();
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'warning' | 'error'>('error');

  const uuid = searchParams.get('uuid');
  const user = searchParams.get('user');

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!uuid || !user) {
        setError('Missing required parameters. Please provide both UUID and user parameters.');
        setErrorType('warning');
        setLoading(false);
        return;
      }

      try {
        // Replace {{baseurl}} with actual base URL - you can modify this as needed
        const baseUrl ='http://localhost:8000/api/v1';
        const response = await fetch(`${baseUrl}/lms/certificate/?uuid=${uuid}&user=${user}`);
        
        if (!response.ok) {
          const errorData: ApiResponse = await response.json();
          
          // Handle different error types
          if (response.status === 400) {
            setError(errorData.errors || 'Bad request - missing required parameters');
            setErrorType('warning');
          } else if (response.status === 404) {
            setError(errorData.errors || 'Certificate not found');
            setErrorType('error');
          } else if (response.status === 403) {
            setError(errorData.errors || 'Certificate not available - course must be completed first');
            setErrorType('warning');
          } else {
            setError('An unexpected error occurred');
            setErrorType('error');
          }
          return;
        }

        const data: ApiResponse = await response.json();
        
        if (data.success && data.data) {
          setCertificateData(data.data);
        } else {
          setError(data.message || 'Failed to load certificate');
          setErrorType('error');
        }
      } catch (err) {
        setError('Network error - please check your connection and try again');
        setErrorType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [uuid, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = () => {
    // This would typically generate a PDF or image of the certificate
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading certificate...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Certificate Error</h1>
              <Alert className={`mb-6 ${errorType === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
                <AlertDescription className="text-left">
                  {error}
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No certificate data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Viewer</h1>
          <p className="text-gray-600">Congratulations on completing your course!</p>
        </div>

        {/* Certificate */}
        <Card className="relative overflow-hidden shadow-2xl bg-white border-0">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          <CardContent className="relative p-12 md:p-16">
            {/* Certificate Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
                Certificate of Completion
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
            </div>

            {/* Certificate Body */}
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600 mb-8">
                This is to certify that
              </p>
              
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                  {certificateData.user_name}
                </h3>
                <div className="w-32 h-0.5 bg-gray-300 mx-auto"></div>
              </div>

              <p className="text-lg text-gray-600 mb-6">
                has successfully completed the course
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
                <h4 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900">
                  {certificateData.course_title}
                </h4>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Completed on {formatDate(certificateData.completed_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Recipient: {certificateData.user_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Course: {certificateData.course_title}</span>
                </div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600">Certificate ID</p>
                  <p className="font-mono text-xs text-gray-500">{uuid}</p>
                </div>
                
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Verified Certificate
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleDownload} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </Button>
        </div>

        {/* Certificate Details */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Recipient:</span>
                <span className="ml-2 text-gray-600">{certificateData.user_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Course:</span>
                <span className="ml-2 text-gray-600">{certificateData.course_title}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Completion Date:</span>
                <span className="ml-2 text-gray-600">{formatDate(certificateData.completed_at)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Certificate ID:</span>
                <span className="ml-2 text-gray-600 font-mono">{uuid}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}