import Link from 'next/link';
import { XCircle, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-3xl mx-auto w-full">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-full flex items-center justify-center">
            <XCircle size={40} className="sm:w-12 sm:h-12 text-slate-900" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 text-brand-black px-4">
          Payment Cancelled
        </h1>

        <p className="font-body text-base sm:text-lg text-slate-600 text-center mb-8 sm:mb-12 px-4">
          Your payment was not completed
        </p>

        {/* Message */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200 p-6 sm:p-8 md:p-12 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 flex-shrink-0 mt-1" strokeWidth={2} />
            <div>
              <p className="font-body text-base sm:text-lg text-brand-black mb-2">
                No charges have been made to your account.
              </p>
              <p className="font-body text-sm sm:text-base text-slate-600">
                If you experienced any issues during checkout, please try again or contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Reasons */}
        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-black mb-4 sm:mb-6 text-center">Common Reasons</h2>
          <ul className="space-y-3 sm:space-y-4 font-body text-sm sm:text-base text-slate-600">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brand-black rounded-full"></div>
              <span>Payment was cancelled by you</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brand-black rounded-full"></div>
              <span>Payment gateway timeout or connection issue</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brand-black rounded-full"></div>
              <span>Technical issues with payment provider</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brand-black rounded-full"></div>
              <span>Insufficient funds or declined card</span>
            </li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
          <Link
            href="/"
            className="btn-accent inline-flex items-center justify-center gap-2 min-h-[52px]"
          >
            <RefreshCw size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
            Try Again
          </Link>
          <a
            href="mailto:support@liftingsocial.com"
            className="btn-secondary inline-flex items-center justify-center gap-2 min-h-[52px]"
          >
            <HelpCircle size={18} className="sm:w-5 sm:h-5" strokeWidth={2} />
            Contact Support
          </a>
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-body text-xs sm:text-sm text-blue-900 text-center">
            💡 Your reservation has not been confirmed. Limited stock is still available.
          </p>
        </div>
      </div>
    </main>
  );
}
