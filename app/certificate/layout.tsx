import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Certificate Viewer',
  description: 'View and download your course completion certificate',
};

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}