'use client';

import { ChevronDown, Sparkles, Zap, Award } from 'lucide-react';
import Logo from './Logo';

export default function Hero() {
  const scrollToForm = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-red/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        {/* Logo - Top */}
        <div className="flex justify-center mb-8 sm:mb-12 animate-fade-in">
          <Logo size="lg" />
        </div>

        {/* Main Content */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Limited Edition Badge */}
          <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-brand-red/10 to-brand-red/5 border border-brand-red/20 rounded-full mb-8 sm:mb-10 backdrop-blur-sm animate-fade-in-up shadow-lg shadow-brand-red/5">
            <Sparkles size={16} className="text-brand-red animate-pulse" />
            <span className="text-sm sm:text-base font-semibold text-brand-red tracking-wider uppercase">Limited Edition Drop</span>
            <Sparkles size={16} className="text-brand-red animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-brand-black mb-6 sm:mb-8 leading-tight tracking-tight animate-fade-in-up px-4">
            LIFTING
            <span className="block text-brand-red mt-2">SOCIAL</span>
          </h1>

          {/* Tagline */}
          <p className="font-body text-xl sm:text-2xl md:text-3xl lg:text-4xl text-slate-700 mb-4 sm:mb-6 max-w-3xl mx-auto leading-snug font-medium animate-fade-in-up delay-200 px-4">
            Built for Those Who Lift
          </p>

          <p className="font-body text-base sm:text-lg md:text-xl text-slate-600 mb-10 sm:mb-14 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300 px-4">
            Premium athletic wear engineered for champions. Exclusive pre-order, limited stock available.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 animate-fade-in-up delay-400 px-4">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Award size={18} className="text-brand-red" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">Premium Quality</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Zap size={18} className="text-brand-red" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">Limited Stock</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Sparkles size={18} className="text-brand-red" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">Exclusive Design</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch mb-12 sm:mb-16 px-4 max-w-xl mx-auto animate-fade-in-up delay-500">
            <button
              onClick={scrollToForm}
              className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-brand-red text-white font-heading font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl shadow-brand-red/25 hover:shadow-2xl hover:shadow-brand-red/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 overflow-hidden min-h-[58px] sm:min-h-[64px]"
            >
              <span className="relative z-10">Pre-Order Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-red to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button
              onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-brand-black font-heading font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 border-brand-black hover:bg-brand-black hover:text-white hover:-translate-y-1 active:translate-y-0 transition-all duration-200 shadow-lg min-h-[58px] sm:min-h-[64px]"
            >
              View Details
            </button>
          </div>

          {/* Countdown/Urgency */}
          <div className="inline-block px-6 py-3 bg-slate-900/5 backdrop-blur-sm rounded-full mb-8 sm:mb-12 animate-fade-in-up delay-600">
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              🔥 Pre-order closes <span className="font-bold text-brand-red">January 31, 2026</span>
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-slate-400 animate-bounce mt-8 sm:mt-12">
          <ChevronDown size={28} strokeWidth={2} />
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">Discover More</span>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
