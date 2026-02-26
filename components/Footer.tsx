import { Mail, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="mb-3 sm:mb-4 flex justify-center sm:justify-start">
              <div className="w-28 h-auto">
                <Image 
                  src="/images/lifting-social-logo-2.svg" 
                  alt="Lifting Social" 
                  width={680} 
                  height={360}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold mb-1 sm:mb-2">LIFTING SOCIAL</h3>
            <p className="font-body text-xs sm:text-sm text-slate-400">Built for Champions</p>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="font-body text-xs sm:text-sm font-semibold text-slate-300 mb-3 sm:mb-4">GET IN TOUCH</h4>
            <div className="space-y-2.5 sm:space-y-3">
              <a 
                href="mailto:support@liftingsocial.com" 
                className="flex items-center justify-center sm:justify-start gap-2 font-body text-xs sm:text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] sm:min-h-0 touch-manipulation"
              >
                <Mail size={16} strokeWidth={2} />
                <span className="break-all">liftingsocial@gmail.com</span>
              </a>
              <a 
                href="https://instagram.com/theliftingsocial" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-2 font-body text-xs sm:text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] sm:min-h-0 touch-manipulation"
              >
                <Instagram size={16} strokeWidth={2} />
                @liftingsocial
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-body text-xs sm:text-sm font-semibold text-slate-300 mb-3 sm:mb-4">QUICK LINKS</h4>
            <div className="space-y-2">
              <a href="#product" className="block font-body text-xs sm:text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] sm:min-h-0 flex items-center justify-center sm:justify-start touch-manipulation">
                View Collection
              </a>
             
              <a href="#order-form" className="block font-body text-xs sm:text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] sm:min-h-0 flex items-center justify-center sm:justify-start touch-manipulation">
                Pre-Order Now
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="font-body text-[10px] sm:text-xs text-slate-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Lifting Social. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="font-body text-[10px] sm:text-xs text-slate-500 hover:text-white transition-colors min-h-[44px] sm:min-h-0 flex items-center touch-manipulation">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-body text-[10px] sm:text-xs text-slate-500 hover:text-white transition-colors min-h-[44px] sm:min-h-0 flex items-center touch-manipulation">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
