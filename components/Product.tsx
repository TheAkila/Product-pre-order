'use client';

import { Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import { Product as ProductType } from '@/types/product';

export default function Product({ product }: { product: ProductType }) {
  const discountPct = product.regularPrice > 0
    ? Math.round(((product.regularPrice - product.preorderPrice) / product.regularPrice) * 100)
    : 0;

  return (
    <section id={`product-${product.id}`} className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-black mb-2 sm:mb-3 md:mb-4 px-2">
            {product.name}
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 max-w-5xl mx-auto">
          {product.images.map((imageUrl, index) => (
            <div key={imageUrl} className="group bg-slate-50 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden card-hover">
              <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`${product.name} - View ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority={index === 0}
                />
              </div>
              <div className="p-4 sm:p-5 md:p-6 bg-white">
                <p className="font-body text-xs sm:text-sm font-semibold text-slate-900 text-center uppercase tracking-wider">{product.name}</p>
              </div>
            </div>
          ))}
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
                LKR {product.regularPrice.toLocaleString()}
              </p>
              <p className="font-body text-xs text-slate-500">Regular Price</p>
            </div>

            {/* Pre-Order Price */}
            <p className="font-heading text-4xl font-bold text-brand-black mb-2">
              LKR {product.preorderPrice.toLocaleString()}
            </p>

            {/* Savings Display */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <p className="font-body text-sm font-bold text-green-800">
                 You Save: LKR {(product.regularPrice - product.preorderPrice).toLocaleString()}
              </p>
              <p className="font-body text-xs text-green-600">{discountPct}% Pre-Order Discount</p>
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
              {new Date(product.preorderCloses).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="font-body text-sm text-white/80 mt-2">Limited time offer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
