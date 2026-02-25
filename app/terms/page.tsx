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
                Welcome to Lifting Social. These Terms and Conditions govern your use of our website and the purchase and sale of products 
                from our platform. By accessing and using our website, you agree to comply with these terms. Please read them carefully before 
                proceeding with any transactions.
              </p>
              <div className="bg-brand-red/10 rounded-xl p-6 border-l-4 border-brand-red">
                <p className="font-body text-sm text-slate-700 leading-relaxed">
                  <strong>Important:</strong> By completing a purchase, you acknowledge that you have read, understood, and agree to these terms.
                </p>
              </div>
            </section>

            {/* Use of Website */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Use of the Website</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">User Responsibilities</h3>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>You must be at least 18 years old to make purchases</li>
                    <li>You are responsible for maintaining the confidentiality of your account information</li>
                    <li>You agree to provide accurate and current information during registration and checkout</li>
                    <li>You may not use our website for any unlawful or unauthorized purposes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Product Information and Pricing */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Product Information and Pricing</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Accuracy of Information</h3>
                  <p className="font-body text-slate-700 text-sm mb-3">
                    We strive to provide accurate product descriptions, images, and pricing information. However, we do not guarantee 
                    the accuracy or completeness of such information.
                  </p>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>Prices are subject to change without notice</li>
                    <li>Promotions or discounts are valid for limited time only</li>
                    <li>Minor variations in color, design, or finish are normal in handcrafted items</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Orders and Payments */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-brand-red" />
                Orders and Payments
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Order Process</h3>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>By placing an order on our website, you are making an offer to purchase the selected products</li>
                    <li>We reserve the right to refuse or cancel any order for any reason, including product availability or suspected fraud</li>
                    <li>Order confirmation will be sent via email after successful payment</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Payment Terms</h3>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>Payment is required at the time of placing your order</li>
                    <li>We use trusted third-party payment processor PayHere to handle your payment information securely</li>
                    <li>We do not store or have access to your full payment details</li>
                    <li>Prices shown in Sri Lankan Rupees (LKR)</li>
                  </ul>
                </div>
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
                          <ShoppingBag className="w-5 h-5 text-brand-red" />
                        </div>
                        <h4 className="font-heading text-xs font-semibold text-brand-black mb-1">Production</h4>
                        <p className="font-body text-xs text-slate-600">2-4 weeks</p>
                      </div>
                      <div>
                        <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Truck className="w-5 h-5 text-brand-red" />
                        </div>
                        <h4 className="font-heading text-xs font-semibold text-brand-black mb-1">Shipping</h4>
                        <p className="font-body text-xs text-slate-600">1-2 weeks</p>
                      </div>
                      <div>
                        <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <AlertTriangle className="w-5 h-5 text-brand-red" />
                        </div>
                        <h4 className="font-heading text-xs font-semibold text-brand-black mb-1">Total Time</h4>
                        <p className="font-body text-xs text-slate-600">3-6 weeks</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-slate-600 mt-3">
                    * Timelines are estimates and may vary due to production capacity, shipping delays, or other factors beyond our control.
                  </p>
                </div>
              </div>
            </section>

            

            {/* Shipping and Delivery */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4 flex items-center gap-3">
                <Truck className="w-6 h-6 text-brand-red" />
                Shipping and Delivery
              </h2>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Shipping Policy</h3>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>We will make reasonable efforts to ensure timely shipping and delivery of your orders</li>
                    <li>Shipping and delivery times provided are estimates and may vary based on your location and other factors</li>
                    <li>You are responsible for providing an accurate shipping address</li>
                    <li>Delivery confirmation will be sent via email or SMS</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Refund Policy */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Refund Policy</h2>
              
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Returns</h3>
                  <p className="font-body text-slate-700 text-sm mb-3">
                    Thank you for shopping at Lifting Social. We value your satisfaction. To be eligible for a return, items must:
                  </p>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>Be returned within 7 days from the date of delivery</li>
                    <li>Be unused and in the same condition as received</li>
                    <li>Be in original packaging</li>
                    <li>Include proof of purchase or order number</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Refunds</h3>
                  <p className="font-body text-slate-700 text-sm mb-3">
                    Once we receive your return and inspect the item, we will notify you of the status of your refund. If approved:
                  </p>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>Refund will be initiated to your original payment method</li>
                    <li>Refund amount will exclude any shipping charges from the initial purchase</li>
                    <li>Refunds will be processed within 7-14 business days</li>
                    <li>Additional time may be required for the refund to appear in your account</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Damaged or Defective Items</h3>
                  <p className="font-body text-slate-700 text-sm">
                    In the event that your item arrives damaged or defective, please contact us immediately. We will arrange for a 
                    replacement or issue a refund, depending on your preference and product availability.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Return Shipping</h3>
                  <p className="font-body text-slate-700 text-sm">
                    You are responsible for paying the shipping costs for returning your item unless the return is due to our error 
                    (e.g., wrong item shipped, defective product). In such cases, we will provide you with a prepaid shipping label.
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-400">
                  <h3 className="font-heading text-lg font-semibold text-yellow-800 mb-3">Non-Returnable Items</h3>
                  <p className="font-body text-slate-700 text-sm mb-3">
                    The following items cannot be returned or refunded:
                  </p>
                  <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                    <li>Items damaged due to misuse or neglect</li>
                    <li>Items without proof of purchase or order number</li>
                    <li>Personalized or custom-made items (unless defective)</li>
                    <li>Items exceeding the return period</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cancellation and Refunds */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Cancellation Policy</h2>
              
              <div className="bg-gradient-to-br from-brand-red/10 to-brand-black/5 rounded-xl p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Pre-Order Cancellation</h3>
                    <ul className="font-body text-slate-700 space-y-2 text-sm">
                      <li>• Pre-orders can be cancelled within 24 hours of placement</li>
                      <li>• No cancellations accepted once production begins</li>
                      <li>• Cancellation requests must be made via email</li>
                      <li>• Refund processing: 7-14 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Contact for Cancellation</h3>
                    <p className="font-body text-slate-700 text-sm mb-2">
                      To cancel your order, please email us with your order number:
                    </p>
                    <p className="font-body text-slate-700 text-sm font-semibold">
                      liftingsocial@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Product Information */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Product Information</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Product Descriptions and Pricing</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    We strive to provide accurate product descriptions, images, and pricing information. We do not guarantee the accuracy 
                    or completeness of such information. We reserve the right to modify or discontinue products without notice.
                  </p>
                </div>
                <div className="border-l-4 border-brand-red pl-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-2">Quality Standards</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    We maintain high quality standards for all products. Minor variations in color, design, or finish are normal in 
                    handcrafted items and do not constitute defects.
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

            {/* Intellectual Property */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Intellectual Property</h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <ul className="font-body text-slate-700 space-y-3 text-sm">
                  <li><strong>Ownership:</strong> All content and materials on our website, including text, images, logos, and graphics, 
                  are protected by intellectual property rights and are the property of Lifting Social or its licensors.</li>
                  <li><strong>Restrictions:</strong> You may not use, reproduce, distribute, or modify any content from our website 
                  without our prior written consent.</li>
                  <li><strong>User Content:</strong> Any content you create or upload remains your property. By uploading content to our website, 
                  you grant us a non-exclusive, royalty-free license to use it for business purposes.</li>
                </ul>
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
                  Lifting Social{`'`}s liability is limited to the purchase price of the product. We are not liable for:
                </p>
                <ul className="font-body text-slate-700 space-y-2 list-disc list-inside text-sm">
                  <li>Indirect, special, incidental, or consequential damages</li>
                  <li>Delays due to factors beyond our control (weather, shipping, natural disasters, etc.)</li>
                  <li>Changes in personal preferences or requirements</li>
                  <li>Loss or damage during shipping</li>
                  <li>Third-party services or actions outside our control</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="font-body text-slate-700 text-sm">
                    <strong>Disclaimer:</strong> We make no warranties or representations, express or implied, regarding the quality, 
                    accuracy, or suitability of the products offered on our website.
                  </p>
                </div>
              </div>
            </section>

            {/* Amendments and Termination */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-brand-black mb-4">Amendments and Termination</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3">Changes to Terms</h3>
                  <p className="font-body text-slate-700 text-sm leading-relaxed mb-3">
                    We reserve the right to modify, update, or change these Terms and Conditions at any time without prior notice. 
                    Changes will be effective immediately upon posting on our website. It is your responsibility to review these terms periodically for any changes.
                  </p>
                  <p className="font-body text-slate-700 text-sm leading-relaxed">
                    Your continued use of our service after changes constitutes acceptance of the new terms. For significant changes, 
                    we will provide notice via email to registered customers.
                  </p>
                </div>
                <div className="bg-brand-black text-white rounded-xl p-4">
                  <p className="font-body text-xs text-slate-200">
                    Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
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