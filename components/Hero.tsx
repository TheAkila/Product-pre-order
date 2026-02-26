'use client';

import Image from 'next/image';

export default function Hero() {
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
    </section>
  );
}
