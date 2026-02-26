'use client';

import Image from 'next/image';

export default function Hero() {
  const scrollToForm = () =>
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center text-white overflow-hidden">
      {/* Full-screen background image */}
      <Image
        src="/images/home.png"
        alt="Lifting Social Elite Gym Shaker"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="z-0"
        priority
      />

      {/* Overlay to darken the image slightly for better text contrast */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Buttons positioned at the bottom */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-20 flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-6">
        <button
          onClick={scrollToForm}
          className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-heading font-bold text-brand-black bg-white hover:bg-neutral-200 transition-all rounded-lg shadow-lg hover:shadow-xl"
        >
          Reserve Your Shaker
        </button>

        <button
          onClick={() =>
            document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-heading font-bold text-white bg-transparent border-2 border-white hover:bg-white/10 transition-all rounded-lg"
        >
          View Product
        </button>
      </div>
    </section>
  );
}
