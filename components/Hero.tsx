'use client';

import { ChevronDown } from 'lucide-react';
import Logo from './Logo';


export default function Hero() {
  const scrollToForm = () =>
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center bg-brand-white text-brand-black overflow-hidden pt-4 pb-12 sm:justify-center sm:pt-0">

      

      {/* Logo */}
      <div className="mb-2 sm:mb-6 mt-2">
        <Logo size="lg" className="opacity-90 scale-75 sm:scale-100 origin-bottom" />
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-6xl md:text-7xl font-heading font-medium tracking-tight leading-tight text-center max-w-4xl px-4 text-balance">
        Designed for Strength.
        <br className="hidden md:block" />
        Engineered for Performance.
      </h1>

      {/* Subtext */}
      <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl font-body text-gray-700 text-center max-w-xl px-6 text-pretty leading-relaxed">
        Premium athletic wear for the modern lifter  refined materials, elevated cut, effortless performance.
      </p>

      {/* Pre-Order Discount Banner
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-brand-red to-red-600 text-white px-6 py-3 rounded-full shadow-lg mx-4">
        <div className="flex items-center justify-center gap-2 text-center">
         
          <div>
            <p className="font-heading text-sm sm:text-base font-bold">LIMITED TIME: 20% OFF PRE-ORDERS</p>
            <p className="font-body text-xs sm:text-sm opacity-90" suppressHydrationWarning>
              Save LKR 500 • Ends {typeof window !== 'undefined' 
                ? new Date(process.env.NEXT_PUBLIC_PREORDER_CLOSES || '2026-01-31').toLocaleDateString()
                : 'January 31, 2026'
              }
            </p>
          </div>
         
        </div>
      </div> */}

      {/* Buttons */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-6 sm:px-0">
        <button
          onClick={scrollToForm}
          className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-heading font-bold text-white bg-brand-black hover:bg-slate-800 transition-all rounded-lg shadow-lg hover:shadow-xl"
        >
          Reserve Your Tee
        </button>

        <button
          onClick={() =>
            document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-heading font-bold text-brand-black bg-transparent border-2 border-brand-black hover:bg-neutral-50 transition-all rounded-lg"
        >
          View Collection
        </button>
      </div>

      {/* Stats */}
      <div className="mt-10 sm:mt-20 flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-6 sm:gap-y-8 max-w-2xl text-center px-4">
        <div className="min-w-[80px] sm:min-w-[100px]">
          <div className="text-xl sm:text-3xl font-heading font-bold text-brand-black">100%</div>
          <div className="text-xs sm:text-sm font-body font-medium text-gray-600 tracking-wider">
            Organic Cotton
          </div>
        </div>

        <div className="min-w-[80px] sm:min-w-[100px]">
          <div className="text-xl sm:text-3xl font-heading font-bold text-brand-black">
            Limited
          </div>
          <div className="text-xs sm:text-sm font-body font-medium text-gray-600 tracking-wider">
            Edition
          </div>
        </div>

        <div className="min-w-[80px] sm:min-w-[100px]">
          <div className="text-xl sm:text-3xl font-heading font-bold text-brand-black">
            Worldwide
          </div>
          <div className="text-xs sm:text-sm font-body font-medium text-gray-600 tracking-wider">
            Premium
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 hidden sm:flex flex-col items-center text-gray-400 animate-bounce">
        <ChevronDown size={26} />
        <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em]">
          Scroll
        </span>
      </div>
    </section>
  );
}
