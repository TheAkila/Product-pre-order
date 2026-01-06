'use client';

import { ChevronDown } from 'lucide-react';
import Logo from './Logo';

export default function Hero() {
  const scrollToForm = () =>
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center bg-white text-gray-800 overflow-hidden">
      
      {/* Optional Background Image */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
           style={{ backgroundImage: "url('/hero-bg.jpg')" }}></div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 -z-5"></div>

      {/* Logo */}
      <div className="mb-8">
        <Logo size="lg" className="opacity-90" />
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight leading-tight text-center max-w-3xl px-4">
        Designed for Strength. Engineered for Performance.
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 text-center max-w-xl px-4">
        Premium athletic wear for the modern lifter — refined materials, elevated cut, effortless performance.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={scrollToForm}
          className="px-8 py-3 text-lg font-semibold text-white bg-neutral-900 hover:bg-black transition-all rounded-lg shadow-md"
        >
          Reserve Your Tee
        </button>

        <button
          onClick={() =>
            document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="px-8 py-3 text-lg font-medium text-neutral-900 bg-transparent border border-neutral-900 hover:bg-neutral-100 transition-all rounded-lg"
        >
          View Collection
        </button>
      </div>

      {/* Optional Stats */}
      <div className="mt-14 grid grid-cols-3 gap-8 max-w-xl text-center">
        <div>
          <div className="text-2xl font-semibold">100%</div>
          <div className="text-sm text-gray-500 tracking-wide">Organic Cotton</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">Limited</div>
          <div className="text-sm text-gray-500 tracking-wide">Edition</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">Worldwide</div>
          <div className="text-sm text-gray-500 tracking-wide">Premium</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 flex flex-col items-center text-gray-500 animate-bounce">
        <ChevronDown size={26} />
        <span className="text-xs uppercase tracking-wider">Scroll</span>
      </div>

    </section>
  );
}
