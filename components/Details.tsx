'use client';

import { Package, Shirt, Award, Ruler } from 'lucide-react';

export default function Details() {
  const features = [
    {
      icon: <Shirt size={28} strokeWidth={1.5} />,
      title: 'Premium Fabric',
      description: '100% premium combed cotton. Pre-shrunk for lasting fit. Breathable and built to last through your toughest sessions.',
    },
    {
      icon: <Package size={28} strokeWidth={1.5} />,
      title: 'Signature Design',
      description: 'Chest logo branding with bold BEAT MODE back graphic. "THINK GOOD" hem label detail. Designed for the dedicated.',
    },
    {
      icon: <Award size={28} strokeWidth={1.5} />,
      title: 'Limited Edition',
      description: 'Exclusive first drop. Once they\'re gone, they\'re gone. Be part of the Lifting Social movement from the beginning.',
    },
  ];

  return (
    <section id="details" className="py-12 sm:py-16 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-black mb-2 sm:mb-3 md:mb-4 px-2">
            Built Different
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed">
            Quality you can feel. Style that stands out. Performance that matters.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200 hover:border-brand-black transition-all duration-300 card-hover"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-black/10 rounded-xl flex items-center justify-center text-brand-black mb-4 sm:mb-6">
                {feature.icon}
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-black mb-2 sm:mb-3">{feature.title}</h3>
              <p className="font-body text-sm sm:text-base text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
