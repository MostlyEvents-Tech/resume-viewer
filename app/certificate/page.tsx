'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

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
	const [certificateImage, setCertificateImage] = useState<string | null>(null);
	const [generating, setGenerating] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const uuid = searchParams.get('uuid');
	const user = searchParams.get('user');

	// const [uuid, setUuid] = useState('122e9e9b-05c4-47e3-9829-8571f3ff3695');
	// const [user, setUser] = useState('7b55279a-8c58-4204-85d2-529c379ad678');

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

				// const data: ApiResponse = {
				// 	success: true,
				// 	message: 'testing',
				// 	data: {
				// 		course_title: 'Long course title here.',
				// 		course_instructor: 'Han zemmer',
				// 		user_name: 'Abhijeet D.',
				// 		completed_at: '2024-12-15',
				// 	},
				// };

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

	const generateCertificateImage = async () => {
		if (!certificateData || !canvasRef.current) return;

		setGenerating(true);
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size to match the certificate proportions
		canvas.width = 1400;
		canvas.height = 990;

		// Create the exact gradient background
		const gradient = ctx.createLinearGradient(
			0,
			0,
			canvas.width,
			canvas.height
		);
		gradient.addColorStop(0, '#f3e8ff'); // purple-100
		gradient.addColorStop(0.5, '#fdf2f8'); // pink-50
		gradient.addColorStop(1, '#fff7ed'); // orange-100
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Add shadow effect for the certificate card
		ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
		ctx.shadowBlur = 20;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 10;

		// Draw rounded rectangle for certificate background
		const certMargin = 40;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
		ctx.beginPath();
		ctx.roundRect(
			certMargin,
			certMargin,
			canvas.width - certMargin * 2,
			canvas.height - certMargin * 2,
			16
		);
		ctx.fill();

		// Reset shadow
		ctx.shadowColor = 'transparent';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;

		// Apply gradient overlay on the card
		const cardGradient = ctx.createLinearGradient(
			certMargin,
			certMargin,
			canvas.width - certMargin,
			canvas.height - certMargin
		);
		cardGradient.addColorStop(0, 'rgba(243, 232, 255, 0.5)'); // purple-100
		cardGradient.addColorStop(0.5, 'rgba(253, 242, 248, 0.5)'); // pink-50
		cardGradient.addColorStop(1, 'rgba(255, 247, 237, 0.5)'); // orange-100
		ctx.fillStyle = cardGradient;
		ctx.beginPath();
		ctx.roundRect(
			certMargin,
			certMargin,
			canvas.width - certMargin * 2,
			canvas.height - certMargin * 2,
			16
		);
		ctx.fill();

		// Add decorative circles with blur effect
		ctx.save();

		// Circle 1 - top right (pink)
		ctx.globalAlpha = 0.3;
		ctx.filter = 'blur(30px)';
		ctx.fillStyle = '#fbcfe8';
		ctx.beginPath();
		ctx.arc(canvas.width - 200, 200, 128, 0, 2 * Math.PI);
		ctx.fill();

		// Circle 2 - bottom right (orange)
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = '#fed7aa';
		ctx.beginPath();
		ctx.arc(canvas.width - 150, canvas.height - 150, 96, 0, 2 * Math.PI);
		ctx.fill();

		// Circle 3 - bottom left (purple)
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = '#e9d5ff';
		ctx.beginPath();
		ctx.arc(150, canvas.height - 200, 64, 0, 2 * Math.PI);
		ctx.fill();

		// Circle 4 - top left (pink light)
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = '#fce7f3';
		ctx.beginPath();
		ctx.arc(200, 150, 80, 0, 2 * Math.PI);
		ctx.fill();

		ctx.restore();

		// Content padding
		const contentPadding = 120;
		const contentX = contentPadding;
		let contentY = contentPadding;

		// Load and draw images
		const loadImage = (src: string): Promise<HTMLImageElement> => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = reject;
				img.src = src;
			});
		};

		try {
			// Try to load images
			const [meIcon, mostlyEventsLogo] = await Promise.all([
				loadImage('/images/me_icon.png').catch(() => null),
				loadImage('/images/mostly-events.png').catch(() => null),
			]);

			// Header section with logos
			if (meIcon) {
				ctx.drawImage(meIcon, contentX, contentY, 40, 40);
			}

			if (mostlyEventsLogo) {
				ctx.drawImage(mostlyEventsLogo, contentX + 50, contentY + 7, 150, 22);
			} else {
				// Fallback text if logo doesn't load
				ctx.fillStyle = '#374151';
				ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
				ctx.textAlign = 'left';
				ctx.fillText('MOSTLY EVENTS', contentX + 50, contentY + 25);
			}
		} catch (err) {
			// Fallback text if images don't load
			ctx.fillStyle = '#374151';
			ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
			ctx.textAlign = 'left';
			ctx.fillText('MOSTLY EVENTS', contentX, contentY + 25);
		}

		// Certificate ID (right side)
		ctx.textAlign = 'right';
		ctx.fillStyle = '#6b7280';
		ctx.font = '14px system-ui, -apple-system, sans-serif';
		ctx.fillText('Certificate ID', canvas.width - contentPadding, contentY);
		ctx.font = '14px monospace';
		ctx.fillStyle = '#4b5563';

		// Handle long UUID
		const uuidText = uuid || '';
		const maxUuidWidth = 300;
		if (ctx.measureText(uuidText).width > maxUuidWidth) {
			const midPoint = Math.ceil(uuidText.length / 2);
			ctx.fillText(
				uuidText.substring(0, midPoint),
				canvas.width - contentPadding,
				contentY + 20
			);
			ctx.fillText(
				uuidText.substring(midPoint),
				canvas.width - contentPadding,
				contentY + 40
			);
		} else {
			ctx.fillText(uuidText, canvas.width - contentPadding, contentY + 20);
		}

		// Certificate content
		contentY += 150;

		// "Certificate of completion" text
		ctx.fillStyle = '#6b7280';
		ctx.font = '24px system-ui, -apple-system, sans-serif';
		ctx.textAlign = 'left';
		ctx.fillText('Certificate of completion', contentX, contentY);
		contentY += 80;

		// Course title (very large)
		ctx.fillStyle = '#000000';
		ctx.font = 'bold 72px system-ui, -apple-system, sans-serif';

		const courseTitle = certificateData.course_title;
		const maxTitleWidth = canvas.width - contentPadding * 2;
		const words = courseTitle.split(' ');
		let line = '';

		for (let i = 0; i < words.length; i++) {
			const testLine = line + words[i] + ' ';
			const metrics = ctx.measureText(testLine);
			if (metrics.width > maxTitleWidth && i > 0) {
				ctx.fillText(line.trim(), contentX, contentY);
				line = words[i] + ' ';
				contentY += 85;
			} else {
				line = testLine;
			}
		}
		ctx.fillText(line.trim(), contentX, contentY);
		contentY += 60;

		// Instructor text
		ctx.fillStyle = '#6b7280';
		ctx.font = '24px system-ui, -apple-system, sans-serif';
		ctx.fillText(
			`Instructor ${certificateData.course_instructor}`,
			contentX,
			contentY
		);
		contentY += 100;

		// User name (large, bold)
		ctx.fillStyle = '#000000';
		ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
		ctx.fillText(certificateData.user_name, contentX, contentY);
		contentY += 50;

		// Completion date with calendar icon
		ctx.fillStyle = '#6b7280';
		ctx.font = '20px system-ui, -apple-system, sans-serif';

		// Draw calendar emoji or icon
		ctx.font = '20px system-ui, -apple-system, sans-serif';
		ctx.fillText('📅', contentX, contentY);
		ctx.fillText(
			`Completed on ${formatDate(certificateData.completed_at)}`,
			contentX + 30,
			contentY
		);

		// Verified certificate badge (bottom right)
		const badgeX = canvas.width - 280;
		const badgeY = canvas.height - 120;
		const badgeWidth = 200;
		const badgeHeight = 50;

		// Badge background (rounded pill)
		ctx.fillStyle = '#4f46e5';
		ctx.beginPath();
		ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 25);
		ctx.fill();

		// Badge content
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
		ctx.textAlign = 'center';

		// Trophy emoji and text
		ctx.fillText(
			'🏆 Verified Certificate',
			badgeX + badgeWidth / 2,
			badgeY + 32
		);

		// Convert canvas to image
		const imageDataUrl = canvas.toDataURL('image/png', 1.0);
		setCertificateImage(imageDataUrl);
		setGenerating(false);
	};

	const downloadCertificate = () => {
		if (!certificateImage) return;

		try {
			// Create a new jsPDF instance with landscape orientation
			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'px',
				format: [990, 700], // Adjusted to match certificate aspect ratio
			});

			// Add the certificate image to the PDF
			pdf.addImage(certificateImage, 'PNG', 0, 0, 990, 700);

			// Download the PDF
			pdf.save(
				`certificate-${certificateData?.user_name?.replace(/\s+/g, '-')}.pdf`
			);
		} catch (error) {
			console.error('Error generating PDF:', error);
			// Fallback to PNG download if PDF generation fails
			const link = document.createElement('a');
			link.download = `certificate-${certificateData?.user_name?.replace(
				/\s+/g,
				'-'
			)}.png`;
			link.href = certificateImage;
			link.click();
		}
	};

	// Generate certificate image when data is loaded
	useEffect(() => {
		if (certificateData && !certificateImage) {
			// Small delay to ensure fonts are loaded
			setTimeout(() => {
				generateCertificateImage();
			}, 100);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [certificateData]);

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
		<div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 items-center justify-center p-1 sm:p-4">
			<div className="w-full max-w-6xl">
				{/* Hidden canvas for generating the certificate */}
				<canvas ref={canvasRef} className="hidden" />

				{/* Certificate display */}
				<div className="text-center">
					{generating ? (
						<Card className="w-full">
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
								<p className="text-gray-600">Generating certificate...</p>
							</CardContent>
						</Card>
					) : certificateImage ? (
						<div>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={certificateImage}
								alt="Certificate"
								className="w-full h-auto rounded-lg shadow-lg mx-auto max-w-4xl"
							/>
							<div className="flex justify-center mt-8">
								<button
									onClick={downloadCertificate}
									className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
								>
									<Download className="h-4 w-4" />
									Download Certificate (PDF)
								</button>
							</div>
						</div>
					) : (
						<Card className="w-full">
							<CardContent className="flex flex-col items-center justify-center py-12">
								<p className="text-gray-600 mb-4">
									Certificate could not be generated
								</p>
								<Button
									onClick={generateCertificateImage}
									className="bg-purple-600 hover:bg-purple-700"
								>
									Try Again
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
