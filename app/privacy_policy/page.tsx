"use client";
import ReactMarkdown from 'react-markdown';

import React from 'react'

const page = () => {
    const Policy=`# Mostly Events Privacy Policy

**Last Update - 26th July, 2024**

## Introduction

This Privacy Policy outlines how Mostly Events collects, uses, shares, and protects your personal information. By using our platform, you consent to the practices described in this policy.

Our platform consists of a Mobile App (downloadable from Google Playstore and Apple App Store) and a Website, both of which are used for accessing our talent matchmaking platform.

We encourage you to read this Privacy Policy regarding the collection, use, and disclosure of your information from time to time to keep yourself updated with the changes & updates that we make to this Privacy Policy.

## Information Collection and Use

We collect information directly from you when you interact with our platform. This includes:

### From Companies (or Recruiters):

- Name  
- Email address  
- Phone number  
- Company name  
- Event details (type, size, location, dates)  
- Talent requirements  
- Social media links  

### From Individuals (Talent Information):

For a better experience, while using our Service, you are required to provide us with certain personally identifiable information for your profile, including but not limited to:

- **Identity information**, such as your first name, last name, gender, date of birth, username, and/or similar may be verified by college ID, voter ID card, driving license, or any other photo ID.  
- **Access to the image gallery** is also required to upload your profile image to create a recruitment profile and for KYC verification.  
- **Contact Information**, such as your mobile number, postal address, email address, and telephone number.  
- **Professional information**, such as your education, work experience, skills, salary, photo, city, area, and other relevant details. Professional information helps you to get more from our Services, including helping employers find you. Please do not post or add personal data to your resume that you would not want to be publicly available.  

### Payment Information

We collect payment information (e.g., card details, UPI ID) when you make a payment through our platform. However, we do not store any payment information. All payment processing is securely handled by **Razorpay**, our payment gateway partner.

### We use the collected information for the following purposes:

- **KYC**: We use your selfie image and photo ID to conduct KYC verification via **OnGrid**, a third-party KYC verification service provider, to verify your identity.  
- **Matching Talent**: We use your information to connect event organizers with suitable talent based on their requirements.  
- **Communication**: We facilitate communication between event organizers and talent through our platform.  
- **Payment Processing**: We use payment information to process payments through **Razorpay**.  
- **Platform Improvement**: We may use aggregated, anonymized data to improve our platform's functionality and user experience.  

## Data Sharing and Disclosure (Third Parties Access)

We do not share, sell, or rent your personal information to third parties for marketing purposes. However, we may share your information with the following trusted third parties:

- **Razorpay**: We share payment information with Razorpay, our payment gateway partner, to process payments securely.  
- **Service Providers**: We may share your information with trusted service providers who assist us in operating our platform, such as hosting providers, customer support, and email delivery services. These service providers are bound by confidentiality agreements and are prohibited from using your information for any other purpose.  
- **OnGrid**: We share your PAN card details and/or a photo identification card with OnGrid, a third-party KYC verification service provider, to verify your identity. We also send your personal image (clicked) to the API to match it with the uploaded photo identification card. OnGrid processes this information securely and does not retain it.  
- **Legal Compliance**: We may disclose your information if required by law, regulation, or legal process, or to protect our rights or property.  
- **Talent Matching**: We share relevant candidate information (e.g., name, contact details, resume, skills) with event organizers who have expressed interest in hiring for specific roles. Similarly, we share relevant event organizer information (e.g., company name, event details, role requirements) with candidates who match the criteria. This sharing is essential for facilitating the talent recruitment process.  

## Data Security

We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:

- **Secure Data Storage**: We use Firebase, a secure cloud platform provided by Google, to store user data. Firebase employs industry-standard security practices to protect data from unauthorized access.

## Data Retention

We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. We will delete your personal information when it is no longer needed, or upon your request, subject to applicable legal requirements.

You can also request personal data deletion by visiting the below link:  
[https://mostlyevents.com/account-delete-request/](https://mostlyevents.com/account-delete-request/)

## Your Rights and Choices

You have certain rights regarding your personal information. These rights may include:

- **Access**: You may request access to the personal information we hold about you.  
- **Correction**: You may request the correction of inaccurate or incomplete personal information.  
- **Deletion**: You may request the deletion of your personal information, subject to applicable legal exceptions.  
- **Data Portability**: In certain circumstances, you may request the transfer of your personal information to another organization.  
- **Object**: You may object to the processing of your personal information in certain cases.  
- **Withdraw Consent**: If you have given us consent to process your personal information, you may withdraw your consent at any time.

To exercise your rights, please contact us at [contact@mostlyevents.com](mailto:contact@mostlyevents.com). We will respond to your request within a reasonable timeframe. Please note that we may need to verify your identity before processing your request.

## Changes to the Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on our website and indicating the effective date of the changes.

It is important to review this Privacy Policy periodically to stay informed about how we collect, use, and share your personal information. By continuing to use our platform after the effective date of any changes, you agree to the revised Privacy Policy.

## Contact Us

If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:

**Email:** [contact@mostlyevents.com](mailto:contact@mostlyevents.com)

We will make every effort to respond to your inquiries on time.`
  return (
    <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
            <ReactMarkdown >
                {Policy}
            </ReactMarkdown>
        </div>
    </main>
    
  )
}

export default page