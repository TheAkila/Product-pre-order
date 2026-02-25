'use client';

import { Calendar, Tag } from 'lucide-react';
import Image from 'next/image';

export default function Product() {
  return (
    <section id="product" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-black mb-2 sm:mb-3 md:mb-4 px-2">
            Elite Gym Shaker
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed">
            Premium shaker. Limited release. Built for champions.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {/* Front View Card */}
          <div className="group bg-slate-50 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden card-hover">
            <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
              <Image 
                src="/images/Front.png" 
                alt="Lifting Social T-shirt Front View - Black tee with chest logo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                priority
              />
            </div>
            <div className="p-4 sm:p-5 md:p-6 bg-white">
              <p className="font-body text-xs sm:text-sm font-semibold text-slate-900 text-center uppercase tracking-wider">LIFTING SOCIAL on side</p>
              <p className="font-body text-[10px] sm:text-xs text-slate-500 text-center mt-1">make yours</p>
            </div>
          </div>

          {/* Back View Card */}
          <div className="group bg-slate-50 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden card-hover">
            <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
              <Image 
                src="/images/Back.png" 
                alt="Lifting Social T-shirt Back View - BEAST MODE DESIGN"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
            <div className="p-4 sm:p-5 md:p-6 bg-white">
              <p className="font-body text-xs sm:text-sm font-semibold text-slate-900 text-center uppercase tracking-wider">Elite Design</p>
              <p className="font-body text-[10px] sm:text-xs text-slate-500 text-center mt-1">Pre order Today</p>
            </div>
          </div>
        </div>

        {/* Price & Deadline Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative overflow-hidden">
            {/* Pre-Order Discount Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-br from-brand-red to-red-600 text-white px-4 py-2 text-xs font-bold rounded-bl-xl">
              PRE-ORDER SPECIAL
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-black/10 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-brand-black" />
              </div>
              <p className="font-body text-sm font-medium text-slate-600">PRICE</p>
            </div>
            
            {/* Regular Price (crossed out) */}
            <div className="mb-2">
              <p className="font-body text-lg text-slate-400 line-through">
                LKR {(parseInt(process.env.NEXT_PUBLIC_PRODUCT_PRICE || '2500') * 1.2).toLocaleString()}
              </p>
              <p className="font-body text-xs text-slate-500">Regular Price</p>
            </div>
            
            {/* Pre-Order Price */}
            <p className="font-heading text-4xl font-bold text-brand-black mb-2">
              LKR {(parseInt(process.env.NEXT_PUBLIC_PRODUCT_PRICE || '2500')).toLocaleString()}
            </p>
            
            {/* Savings Display */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <p className="font-body text-sm font-bold text-green-800">
                 You Save: LKR {(parseInt(process.env.NEXT_PUBLIC_PRODUCT_PRICE || '2500') * 0.2).toLocaleString()}
              </p>
              <p className="font-body text-xs text-green-600">20% Pre-Order Discount</p>
            </div>
            
            <p className="font-body text-sm text-slate-500">Per unit · Limited stock</p>
          </div>

          <div className="bg-gradient-to-br from-brand-black to-slate-900 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="font-body text-sm font-medium text-white/90">PRE-ORDER CLOSES</p>
            </div>
            <p className="font-heading text-3xl font-bold" suppressHydrationWarning>
              {typeof window !== 'undefined' 
                ? new Date(process.env.NEXT_PUBLIC_PREORDER_CLOSES || '2026-01-31').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'January 31, 2026'
              }
            </p>
            <p className="font-body text-sm text-white/80 mt-2">Limited time offer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
