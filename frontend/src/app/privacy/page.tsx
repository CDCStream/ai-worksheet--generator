'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 29, 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                At Makos.ai, we respect your privacy and are committed to protecting your personal data.
                This Privacy Policy explains how we collect, use, and safeguard your information when you
                use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect the following types of information:
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Account Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Email address</li>
                <li>Name (if provided)</li>
                <li>Profile picture (if using Google sign-in)</li>
                <li>Password (encrypted)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Worksheets created</li>
                <li>Features used</li>
                <li>Time spent on the Service</li>
                <li>Device and browser information</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Payment Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Payment details are processed by our payment provider (Polar.sh)</li>
                <li>We do not store your full credit card information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide and maintain the Service</li>
                <li>Process your transactions</li>
                <li>Send you important updates and notifications</li>
                <li>Improve our Service and develop new features</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Storage & Security</h2>
              <p className="text-gray-600 leading-relaxed">
                Your data is stored securely using industry-standard encryption. We use Supabase for
                database hosting, which provides enterprise-grade security. We implement appropriate
                technical and organizational measures to protect your personal data against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies & Tracking</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Keep you signed in</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns (via Google Analytics)</li>
                <li>Improve Service performance</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                You can control cookies through your browser settings. Disabling cookies may affect
                Service functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Supabase</strong> - Database and authentication</li>
                <li><strong>Anthropic (Claude)</strong> - AI content generation</li>
                <li><strong>Polar.sh</strong> - Payment processing</li>
                <li><strong>Google Analytics</strong> - Usage analytics</li>
                <li><strong>Resend</strong> - Email delivery</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Each third-party service has its own privacy policy governing data use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights (GDPR)</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you are in the European Economic Area, you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Access</strong> - Request a copy of your personal data</li>
                <li><strong>Rectification</strong> - Correct inaccurate data</li>
                <li><strong>Erasure</strong> - Request deletion of your data</li>
                <li><strong>Portability</strong> - Receive your data in a portable format</li>
                <li><strong>Object</strong> - Object to certain processing activities</li>
                <li><strong>Withdraw consent</strong> - Withdraw previously given consent</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:support@makos.ai" className="text-teal-600 hover:underline">
                  support@makos.ai
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal data for as long as your account is active or as needed to
                provide the Service. You can request deletion of your account and associated data
                at any time. Some data may be retained for legal or legitimate business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                The Service is intended for users aged 13 and older. We do not knowingly collect
                personal information from children under 13. If you believe we have collected data
                from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant
                changes via email or through the Service. Your continued use after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
                <a href="mailto:support@makos.ai" className="text-teal-600 hover:underline">
                  support@makos.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

