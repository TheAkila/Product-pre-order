import Link from 'next/link';
import Logo from '@/components/Logo';
import { Package, Clock, MessageCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-3xl mx-auto w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <Logo size="lg" className="opacity-100 scale-75 sm:scale-100" />
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 text-brand-black px-4">
          Payment Successful!
        </h1>

        <p className="font-body text-base sm:text-lg text-slate-600 text-center mb-8 sm:mb-12 px-4">
          Your order has been confirmed and is being processed
        </p>

        {/* Success Message */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200 p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 shadow-sm">
          <p className="font-body text-base sm:text-lg text-brand-black mb-4">
            Thank you for supporting Lifting Social! 
          </p>
          <p className="font-body text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">
            You&apos;ll receive a confirmation message on your phone shortly.
          </p>
          <p className="font-body text-sm sm:text-base text-slate-600">
            We&apos;ll keep you updated every step of the way until your Elite Gym Shaker arrives.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-black mb-4 sm:mb-6 text-center">What’s Next?</h2>
          <div className="space-y-5 sm:space-y-6">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-black/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-black" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-body font-semibold text-brand-black mb-1 text-sm sm:text-base">Check your phone</h3>
                <p className="font-body text-xs sm:text-sm text-slate-600">Order confirmation sent via SMS</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-body font-semibold text-brand-black mb-1 text-sm sm:text-base">Processing</h3>
                <p className="font-body text-xs sm:text-sm text-slate-600">We&apos;ll process your order within 24 hours</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-body font-semibold text-brand-black mb-1 text-sm sm:text-base">Delivery updates</h3>
                <p className="font-body text-xs sm:text-sm text-slate-600">Track your order via SMS notifications</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center min-h-[52px]"
          >
            Back to Home
          </Link>
          <p className="font-body text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6 px-4">
            Questions? Email us at <a href="mailto:support@liftingsocial.com" className="text-brand-red hover:underline">theliftingsocial@gmail.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}
