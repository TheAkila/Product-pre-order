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

        {/* Size Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-brand-black to-slate-800 p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Ruler className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Size Guide</h3>
                <p className="font-body text-[10px] sm:text-xs md:text-sm text-white/90 mt-0.5 sm:mt-1">Find your perfect fit</p>
              </div>
            </div>
          </div>
          
          {/* Mobile: Card Layout */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {[
              { size: 'S', chest: '36-38', length: '27-28' },
              { size: 'M', chest: '38-40', length: '28-29' },
              { size: 'L', chest: '40-42', length: '29-30' },
              { size: 'XL', chest: '42-44', length: '30-31' },
              { size: 'XXL', chest: '44-46', length: '31-32' },
            ].map((row) => (
              <div key={row.size} className="p-4 hover:bg-slate-50 transition-colors active:bg-slate-100 touch-manipulation">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading text-2xl font-bold text-brand-black">{row.size}</span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Size</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Chest</div>
                    <div className="font-body text-base font-semibold text-slate-900">{row.chest}&quot;</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Length</div>
                    <div className="font-body text-base font-semibold text-slate-900">{row.length}&quot;</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="py-3 md:py-4 px-4 md:px-6 lg:px-8 text-left font-body text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider">Size</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 lg:px-8 text-left font-body text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider">Chest (in)</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 lg:px-8 text-left font-body text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider">Length (in)</th>
                </tr>
              </thead>
              <tbody className="font-body">
                {[
                  { size: 'S', chest: '36-38', length: '27-28' },
                  { size: 'M', chest: '38-40', length: '28-29' },
                  { size: 'L', chest: '40-42', length: '29-30' },
                  { size: 'XL', chest: '42-44', length: '30-31' },
                  { size: 'XXL', chest: '44-46', length: '31-32' },
                ].map((row, index) => (
                  <tr key={row.size} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index === 4 ? 'border-b-0' : ''}`}>
                    <td className="py-3 md:py-4 px-4 md:px-6 lg:px-8 font-heading text-lg md:text-xl font-bold text-brand-black">{row.size}</td>
                    <td className="py-3 md:py-4 px-4 md:px-6 lg:px-8 text-slate-700 text-sm md:text-base font-medium">{row.chest}</td>
                    <td className="py-3 md:py-4 px-4 md:px-6 lg:px-8 text-slate-700 text-sm md:text-base font-medium">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 sm:p-5 md:p-6 bg-slate-50 border-t border-slate-200">
            <p className="font-body text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
              <span className="font-semibold text-slate-900">Pro Tip:</span> If you&apos;re between sizes, we recommend sizing up for a relaxed fit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
