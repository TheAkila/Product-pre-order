'use client';

import { ChevronDown } from 'lucide-react';
import Logo from './Logo';

export default function Hero() {
  const scrollToForm = () =>
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center bg-brand-white text-brand-black overflow-hidden pt-16 pb-24 sm:py-0">
      
      {/* Logo */}
      <div className="mb-6 sm:mb-8">
        <Logo size="lg" className="opacity-90 scale-90 sm:scale-100" />
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-medium tracking-tight leading-tight text-center max-w-4xl px-4 text-balance">
        Designed for Strength.
        <br className="hidden md:block" />
        Engineered for Performance.
      </h1>

      {/* Subtext */}
      <p className="mt-6 text-sm sm:text-lg md:text-xl font-body text-gray-700 text-center max-w-xl px-6 text-pretty leading-relaxed">
        Premium athletic wear for the modern lifter — refined materials, elevated cut, effortless performance.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0">
        <button
          onClick={scrollToForm}
          className="w-full sm:w-auto px-10 py-4 text-xl font-heading font-bold text-white bg-brand-red hover:bg-brand-red-dark transition-all rounded-lg shadow-brand hover:shadow-brand-lg"
        >
          Reserve Your Tee
        </button>

        <button
          onClick={() =>
            document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="w-full sm:w-auto px-10 py-4 text-xl font-heading font-bold text-brand-black bg-transparent border-2 border-brand-black hover:bg-neutral-50 transition-all rounded-lg"
        >
          View Collection
        </button>
      </div>

      {/* Stats */}
      <div className="mt-14 sm:mt-20 flex flex-wrap justify-center gap-x-12 gap-y-8 max-w-2xl text-center px-4">
        <div className="min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-heading font-bold text-brand-red">100%</div>
          <div className="text-sm font-body font-medium text-gray-600 tracking-wider">
            Organic Cotton
          </div>
        </div>
        <div className="min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-heading font-bold text-brand-red">
            Limited
          </div>
          <div className="text-sm font-body font-medium text-gray-600 tracking-wider">
            Edition
          </div>
        </div>
        <div className="min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-heading font-bold text-brand-red">
            Worldwide
          </div>
          <div className="text-sm font-body font-medium text-gray-600 tracking-wider">
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
