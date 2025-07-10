'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Award, Calendar, Download, AlertCircle } from 'lucide-react';
import { useReactToPrint } from "react-to-print";

import Image from 'next/image';

interface CertificateData {
	user_name: string;
	course_title: string;
	completed_at: string;
	course_instructor: string | 'Mostly Events';
}

interface ApiResponse {
	success: boolean;
	message: string;
	data?: CertificateData;
	errors?: string;
}

export default function CertificatePage() {
	const searchParams = useSearchParams();
	const [certificateData, setCertificateData] =
		useState<CertificateData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<'warning' | 'error'>('error');

	// For download functionality
	const certificateRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({
		contentRef: certificateRef
	});

	const uuid = searchParams.get('uuid');
	const user = searchParams.get('user');

	useEffect(() => {
		const fetchCertificate = async () => {
			if (!uuid || !user) {
				setError(
					'Missing required parameters. Please provide both UUID and user parameters.'
				);
				setErrorType('warning');
				setLoading(false);
				return;
			}

			try {
				// Replace {{baseurl}} with actual base URL - you can modify this as needed
				const baseUrl =
					'https://api-backend.mostlyevent.com/api/v1';
				const response = await fetch(
					`${baseUrl}/lms/certificate/?uuid=${uuid}&user=${user}`,
					{
						headers: {
							'Content-Type': 'application/json',
							'ngrok-skip-browser-warning': 'true'
						},
					}
				);

				if (!response.ok) {
					const errorData: ApiResponse = await response.json();

					// Handle different error types
					if (response.status === 400) {
						setError(
							errorData.errors || 'Bad request - missing required parameters'
						);
						setErrorType('warning');
					} else if (response.status === 404) {
						setError(errorData.errors || 'Certificate not found');
						setErrorType('error');
					} else if (response.status === 403) {
						setError(
							errorData.errors ||
								'Certificate not available - course must be completed first'
						);
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
				console.log(err);
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
			day: 'numeric',
		});
	};

	const handleDownload = () => {};

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
							<h1 className="text-2xl font-bold text-gray-900 mb-4">
								Certificate Error
							</h1>
							<Alert
								className={`mb-6 ${
									errorType === 'warning'
										? 'border-yellow-200 bg-yellow-50'
										: 'border-red-200 bg-red-50'
								}`}
							>
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
		<div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 items-center justify-center">
			<div className="max-w-6xl mx-auto">
				{/* Certificate Card */}
				<div
					ref={certificateRef}
					className="relative overflow-hidden shadow-lg bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-lg certificate-bg"
				>
					{/* Decorative circles */}
					<div className="absolute top-32 right-32 w-64 h-64 bg-pink-200/30 rounded-full blur-sm circle-1"></div>
					<div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-200/40 rounded-full blur-sm circle-2"></div>
					<div className="absolute bottom-32 left-20 w-32 h-32 bg-purple-200/30 rounded-full blur-sm circle-3"></div>
					<div className="absolute top-20 left-32 w-40 h-40 bg-pink-300/20 rounded-full blur-sm circle-4"></div>

					<div className="relative p-12 md:p-16">
						{/* Header with logo and certificate ID */}
						<div className="flex justify-between items-start mb-16">
							<div className="flex items-center gap-3">
								<Image
									width={40}
									height={40}
									alt={''}
									src={'images/me_icon.png'}
								/>
								<Image
									width={150}
									height={80}
									alt={''}
									src={'images/mostly-events.png'}
								/>
							</div>
							<div className="text-right">
								<p className="text-gray-500 text-sm">Certificate ID</p>
								<p className="text-gray-600 text-sm font-mono break-all">
									{uuid}
								</p>
							</div>
						</div>

						{/* Certificate content */}
						<div className="mb-16">
							<p className="text-gray-600 text-lg mb-8">
								Certificate of completion
							</p>

							<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-4 leading-tight">
								{certificateData.course_title}
							</h1>

							<p className="text-gray-600 text-lg mb-8">
								Instructor {certificateData.course_instructor}
							</p>

							<div className="mb-8">
								<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-2">
									{certificateData.user_name}
								</h2>
								<div className="flex items-center gap-2 text-gray-600">
									<Calendar className="h-4 w-4" />
									<span>
										Completed on {formatDate(certificateData.completed_at)}
									</span>
								</div>
							</div>
						</div>

						{/* Verified certificate badge */}
						<div className="flex justify-end">
							<div className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-sm font-medium rounded-full flex items-center gap-2">
								<Award className="h-4 w-4" />
								Verified Certificate
							</div>
						</div>
					</div>
				</div>

				{/* Download button */}
				<div className="flex justify-center mt-8">
					<button
						onClick={reactToPrintFn}
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-medium"
					>
						<Download className="h-4 w-4" />
						Download Certificate
					</button>
				</div>
			</div>
		</div>
	);
}
