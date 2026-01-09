import Link from 'next/link';
import { ArrowLeft, FileText, ShoppingBag, CreditCard, Truck, AlertTriangle, Shield } from 'lucide-react';

export default function TermsPage() {
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
              <p className="font-body text-slate-300">Terms and conditions for using our pre-order service</p>
            </div>
          </div>
          <p className="font-body text-sm text-slate-400">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Agreement to Terms</h2>
              <p className="font-body text-slate-700 mb-4 leading-relaxed">
                By accessing and using the Lifting Social website and pre-order service, you accept and agree to be bound by the terms 
                and provision of this agreement. These Terms of Service govern your use of our website and the purchase of our products.
              </p>
              <div className="bg-brand-red/10 rounded-xl p-6 border-l-4 border-brand-red">
                <p className="font-body text-sm text-slate-700 leading-relaxed">
                  <strong>Important:</strong> Please read these terms carefully before placing a pre-order. By completing a purchase, 
                  you acknowledge that you have read, understood, and agree to these terms.
                </p>
              </div>
            </section>

            {/* Pre-Order Terms */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-brand-red" />
                Pre-Order Terms
              </h2>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Pre-Order Process</h3>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>Pre-orders are accepted for a limited time period as specified on our website</li>
                    <li>Payment is required at the time of placing your pre-order</li>
                    <li>Pre-orders are subject to availability and production capacity</li>
                    <li>We reserve the right to limit quantities per customer</li>
                    <li>Pre-order prices may differ from regular retail prices</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Production Timeline</h3>
                  <p className="font-body text-slate-700 text-sm mb-3">
                    Pre-ordered items are manufactured after the pre-order period closes. Estimated production and delivery times:
                  </p>
                  <div className="bg-white rounded-lg p-4">
                    <div className="grid sm:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <FileText className="w-5 h-5 text-brand-red" />
                        </div>
                        <h4 className="font-heading text-xs font-semibold text-brand-black mb-1">Production</h4>
                        <p className="font-body text-xs text-slate-600">2-4 weeks after pre-order closes</p>
                      </div>
                      <div>
                        <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Truck className="w-5 h-5 text-brand-red" />
                        </div>
                        <h4 className="font-heading text-xs font-semibold text-brand-black mb-1">Shipping</h4>
                        <p className="font-body text-xs text-slate-600">1-2 weeks for delivery</p>
                      </div>
                      <div>
                        <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <ShoppingBag className="w-5 h-5 text-brand-red" />
                        </div>
                        <h4 className="font-heading text-xs font-semibold text-brand-black mb-1">Total Time</h4>
                        <p className="font-body text-xs text-slate-600">3-6 weeks from order</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-slate-600 mt-3">
                    * Timelines are estimates and may vary due to production capacity, shipping delays, or other factors beyond our control.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-brand-red" />
                Payment Terms
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-brand-black text-white rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold mb-3">Payment Processing</h3>
                  <ul className="font-body text-slate-200 space-y-2 text-sm">
                    <li>• All payments processed through PayHere</li>
                    <li>• Payment required before order confirmation</li>
                    <li>• Prices shown in Sri Lankan Rupees (LKR)</li>
                    <li>• Payment confirmation sent via email/SMS</li>
                  </ul>
                </div>
                <div className="bg-brand-black text-white rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold mb-3">Accepted Methods</h3>
                  <ul className="font-body text-slate-200 space-y-2 text-sm">
                    <li>• Credit/Debit Cards (Visa, Mastercard)</li>
                    <li>• Online Banking</li>
                    <li>• Mobile Wallets (via PayHere)</li>
                    <li>• Other PayHere supported methods</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-400">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-yellow-800 mb-2">Important Payment Notes</h4>
                    <ul className="font-body text-xs text-yellow-700 space-y-1">
                      <li>• Failed payments may result in order cancellation</li>
                      <li>• Refunds processed only as per our refund policy</li>
                      <li>• Additional bank charges may apply for international cards</li>
                      <li>• Keep payment confirmation for your records</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            

            {/* Cancellation and Refunds */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Cancellation & Refunds</h2>
              
              <div className="bg-gradient-to-br from-brand-red/10 to-brand-black/5 rounded-xl p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Cancellation Policy</h3>
                    <ul className="font-body text-slate-700 space-y-2 text-sm">
                      <li>• Pre-orders can be cancelled within 24 hours of placement</li>
                      <li>• No cancellations accepted once production begins</li>
                      <li>• Cancellation requests must be made via email</li>
                      <li>• Processing fee may apply for approved cancellations</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Refund Conditions</h3>
                    <ul className="font-body text-slate-700 space-y-2 text-sm">
                      <li>• Refunds for defective or incorrect items</li>
                      <li>• Must report issues within 7 days of delivery</li>
                      <li>• Items must be unused and in original condition</li>
                      <li>• Refund processing: 7-14 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Product Information */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Product Information</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Size and Fit</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    Size charts are provided as guidance only. Actual fit may vary slightly due to manufacturing tolerances. 
                    We are not responsible for incorrect size selection.
                  </p>
                </div>
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Quality Standards</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    We maintain high quality standards for all products. Minor variations in color, design, or finish are 
                    normal in handcrafted items and do not constitute defects.
                  </p>
                </div>
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Care Instructions</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    Care instructions will be provided with each item. Following these instructions is essential to maintain 
                    product quality and longevity.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-brand-red" />
                Limitation of Liability
              </h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="font-body text-slate-700 mb-4 leading-relaxed text-sm">
                  Lifting Social's liability is limited to the purchase price of the product. We are not liable for:
                </p>
                <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                  <li>Indirect, special, incidental, or consequential damages</li>
                  <li>Delays due to factors beyond our control (weather, shipping, etc.)</li>
                  <li>Changes in personal preferences or requirements</li>
                  <li>Loss or damage during shipping (covered by shipping insurance where applicable)</li>
                </ul>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Changes to Terms</h2>
              <p className="font-body text-slate-700 text-sm leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
                on our website. Your continued use of our service after changes constitutes acceptance of the new terms.
              </p>
              <div className="bg-brand-black text-white rounded-xl p-4">
                <p className="font-body text-xs text-slate-200">
                  We recommend reviewing these terms periodically. For significant changes, we will provide notice via 
                  email to registered customers.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Contact & Support</h2>
              <div className="bg-brand-black text-white rounded-xl p-6">
                <p className="font-body text-slate-200 mb-4">
                  For questions about these terms or any issues with your order:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-red/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white">Email Support</p>
                      <a href="mailto:support@liftingsocial.com" className="font-body text-xs text-slate-300 hover:text-white">
                        liftingsocial@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-red/20 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white">Order Support</p>
                      <p className="font-body text-xs text-slate-300">
                        Include your order number in all communications
                      </p>
                    </div>
                  </div>
                </div>
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
                <Link href="/privacy" className="font-body text-sm text-brand-red hover:underline">
                  Privacy Policy
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