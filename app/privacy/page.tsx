import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-black text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-body"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="font-body text-slate-300">How we protect and handle your personal information</p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Content */}
      <div className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-brand-red" />
                Introduction
              </h2>
              <p className="font-body text-slate-700 mb-4 leading-relaxed">
                At Lifting Social, we are committed to protecting the privacy and security of our customers' personal information. 
                This Privacy Policy outlines how we collect, use, and safeguard your information when you visit or make a purchase on our website. 
                By using our website, you consent to the practices described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-brand-red" />
                Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Personal Information</h3>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside">
                    <li>Full name and contact information (provided during registration/checkout)</li>
                    <li>Email address for order confirmations and updates</li>
                    <li>Phone number for SMS notifications and delivery coordination</li>
                    <li>Shipping address for product delivery</li>
                    <li>Payment and billing information processed securely by PayHere (we do not store full payment details)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Order Information</h3>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside">
                    <li>Product details (size, quantity, preferences)</li>
                    <li>Order date and time</li>
                    <li>Payment status and transaction details</li>
                    <li>Order fulfillment and shipping information</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Technical Information</h3>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside">
                    <li>IP address and browser information</li>
                    <li>Device type and operating system</li>
                    <li>Website usage patterns and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">How We Use Your Information</h2>
              <p className="font-body text-slate-700 mb-6 leading-relaxed">
                We use the collected information for the following purposes:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-brand-red">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Order Processing & Fulfillment</h3>
                  <p className="font-body text-slate-700 text-sm">To process and fulfill your orders, including shipping and delivery</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-brand-red">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Customer Communication</h3>
                  <p className="font-body text-slate-700 text-sm">To communicate with you regarding your purchases, provide customer support, and respond to inquiries or requests</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-brand-red">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Service Improvement</h3>
                  <p className="font-body text-slate-700 text-sm">To improve our website, products, and services based on your feedback and browsing patterns</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-brand-red">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Fraud Prevention</h3>
                  <p className="font-body text-slate-700 text-sm">To detect and prevent fraud, unauthorized activities, and abuse of our website</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-brand-red">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Personalization & Marketing</h3>
                  <p className="font-body text-slate-700 text-sm">To personalize your shopping experience and present relevant product recommendations (with your consent)</p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Data Security</h2>
              <div className="bg-gradient-to-br from-brand-red/10 to-brand-black/5 rounded-xl p-6">
                <p className="font-body text-slate-700 mb-4 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-brand-red" />
                    </div>
                    <h4 className="font-heading text-sm font-semibold text-brand-black mb-1">Encryption</h4>
                    <p className="font-body text-xs text-slate-600">All data transmitted is encrypted using industry-standard SSL</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Database className="w-6 h-6 text-brand-red" />
                    </div>
                    <h4 className="font-heading text-sm font-semibold text-brand-black mb-1">Secure Storage</h4>
                    <p className="font-body text-xs text-slate-600">Data stored in secure, encrypted databases with access controls</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-6 h-6 text-brand-red" />
                    </div>
                    <h4 className="font-heading text-sm font-semibold text-brand-black mb-1">Access Control</h4>
                    <p className="font-body text-xs text-slate-600">Limited access to personal information on need-to-know basis</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Information Sharing</h2>
              <p className="font-body text-slate-700 mb-6 leading-relaxed">
                We respect your privacy and do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                except in the following circumstances:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Trusted Service Providers</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    We may share your information with third-party service providers who assist us in operating our website, 
                    processing payments, and delivering products. These providers are contractually obligated to handle your data securely and confidentially.
                  </p>
                </div>
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">PayHere Payment Processing</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    We use PayHere (payhere.lk) for secure payment processing. PayHere has its own privacy policy and 
                    security measures for handling payment information. We do not store your full payment card details.
                  </p>
                </div>
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Firebase/Google Cloud</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    We use Google Firebase for secure data storage and management. Google's privacy policy applies to 
                    this service. All data is stored in encrypted format with appropriate access controls.
                  </p>
                </div>
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">SMS Services</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    We may use SMS service providers to send order confirmations and updates. These services only receive 
                    the minimum information necessary to deliver messages.
                  </p>
                </div>
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Legal Requirements</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    We may disclose your information if required to do so by law or in response to valid legal requests or orders.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Cookies and Tracking Technologies</h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="font-body text-slate-700 mb-4 leading-relaxed">
                  We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and gather 
                  information about your preferences and interactions with our website. You have the option to disable cookies through 
                  your browser settings, but this may limit certain features and functionality of our website.
                </p>
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h3 className="font-heading text-sm font-semibold text-brand-black mb-3">Types of Cookies Used:</h3>
                  <ul className="font-body text-slate-700 space-y-2 text-sm list-disc list-inside">
                    <li>Essential cookies for website functionality</li>
                    <li>Analytics cookies to understand user behavior and improve services</li>
                    <li>Performance cookies to optimize website speed and functionality</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Your Rights</h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="font-body text-slate-700 mb-4 leading-relaxed">
                  You have the following rights regarding your personal information:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-brand-black mb-2">Access & Correction</h4>
                    <p className="font-body text-xs text-slate-600 mb-3">Request access to or correction of your personal information</p>
                    
                    <h4 className="font-heading text-sm font-semibold text-brand-black mb-2">Data Portability</h4>
                    <p className="font-body text-xs text-slate-600 mb-3">Request a copy of your data in a portable format</p>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-brand-black mb-2">Deletion</h4>
                    <p className="font-body text-xs text-slate-600 mb-3">Request deletion of your personal information (where legally permissible)</p>
                    
                    <h4 className="font-heading text-sm font-semibold text-brand-black mb-2">Opt-out</h4>
                    <p className="font-body text-xs text-slate-600">Unsubscribe from marketing communications at any time</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Contact Us</h2>
              <div className="bg-brand-black text-white rounded-xl p-6">
                <p className="font-body text-slate-200 mb-4">
                  If you have questions about this Privacy Policy or want to exercise your rights, contact us:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-red" />
                    <div>
                      <p className="font-body text-sm text-white">Email</p>
                      <a href="mailto:privacy@liftingsocial.com" className="font-body text-xs text-slate-300 hover:text-white">
                        liftingsocial@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-brand-red" />
                    <div>
                      <p className="font-body text-sm text-white">Address</p>
                      <p className="font-body text-xs text-slate-300">
                        Lifting Social<br/>Sri Lanka
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Changes to the Privacy Policy</h2>
              <p className="font-body text-slate-700 text-sm leading-relaxed mb-4">
                We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page 
                with a revised "last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we 
                collect, use, and protect your information.
              </p>
              <div className="bg-brand-black text-white rounded-xl p-4">
                <p className="font-body text-xs text-slate-200">
                  Last Updated: February 26, 2026
                </p>
              </div>
            </section>
          </div>
          
          {/* Footer Navigation */}
          <div className="border-t border-slate-200 pt-8 mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link 
                href="/" 
                className="btn-primary inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>
              <div className="flex gap-4">
                <Link href="/terms" className="font-body text-sm text-brand-red hover:underline">
                  Terms of Service
                </Link>
                <a href="mailto:liftingsocial@gmail.com" className="font-body text-sm text-slate-600 hover:text-brand-black">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}