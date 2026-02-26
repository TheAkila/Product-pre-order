'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center text-white overflow-hidden">
      {/* Mobile background image */}
      <Image
        src="/images/home_mobile.png"
        alt="Lifting Social Elite Gym Shaker"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="z-0 block sm:hidden"
        priority
      />
      {/* Desktop background image */}
      <Image
        src="/images/home_desktop.png"
        alt="Lifting Social Elite Gym Shaker"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="z-0 hidden sm:block"
        priority
      />
    </section>
  );
}
