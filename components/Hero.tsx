'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero({ images }: { images?: string[] }) {
  const slides = images || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (currentSlide >= slides.length) setCurrentSlide(0);
  }, [slides.length, currentSlide]);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(((index % slides.length) + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-white py-14 sm:py-20 md:py-24 flex flex-col items-center overflow-hidden">
      <div
        className="relative w-full max-w-5xl h-[220px] sm:h-[320px] md:h-[380px] flex items-center justify-center"
        style={{ perspective: '1400px' }}
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        {slides.map((src, index) => {
          let offset = index - currentSlide;
          if (offset > slides.length / 2) offset -= slides.length;
          if (offset < -slides.length / 2) offset += slides.length;

          const distance = Math.abs(offset);
          const isCenter = offset === 0;
          const translateX = offset * 58;
          const rotateY = offset === 0 ? 0 : offset > 0 ? -48 : 48;
          const scale = isCenter ? 1 : Math.max(0.6, 1 - distance * 0.2);
          const opacity = distance > 2 ? 0 : 1 - distance * 0.3;

          return (
            <div
              key={index}
              role="button"
              tabIndex={isCenter ? -1 : 0}
              aria-label={isCenter ? undefined : `Go to slide ${index + 1}`}
              className="absolute aspect-square w-[220px] sm:w-[320px] md:w-[380px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out"
              style={{
                transform: `translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex: 100 - distance,
                opacity,
                pointerEvents: distance > 2 ? 'none' : 'auto',
                cursor: isCenter ? 'default' : 'pointer',
              }}
              onClick={() => !isCenter && goToSlide(index)}
            >
              <Image
                src={src}
                alt={`Lifting Social hero slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === currentSlide}
                sizes="(max-width: 640px) 220px, (max-width: 768px) 320px, 380px"
              />
              {!isCenter && <div className="absolute inset-0 bg-black/40" />}
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[110] bg-black/5 hover:bg-black/10 text-brand-black p-2 rounded-full transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[110] bg-black/5 hover:bg-black/10 text-brand-black p-2 rounded-full transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="relative z-[110] mt-6 sm:mt-8 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-brand-black w-8' : 'bg-slate-300 hover:bg-slate-400 w-2.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
