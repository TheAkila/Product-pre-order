import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

export default function ProductCard({ product }: { product: Product }) {
  const discountPct = product.regularPrice > 0
    ? Math.round(((product.regularPrice - product.preorderPrice) / product.regularPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
    >
      <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />
        )}
        {discountPct > 0 && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-brand-red text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full">
            {discountPct}% OFF
          </span>
        )}
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="font-heading text-sm sm:text-lg font-bold text-brand-black mb-1 truncate">{product.name}</h3>
        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <span className="font-body text-[11px] sm:text-sm text-slate-400 line-through">
            LKR {product.regularPrice.toLocaleString()}
          </span>
          <span className="font-body text-sm sm:text-lg font-bold text-brand-black">
            LKR {product.preorderPrice.toLocaleString()}
          </span>
        </div>
        <span className="block w-full text-center bg-brand-black text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 rounded-lg sm:rounded-xl group-hover:bg-brand-red transition-colors">
          View Details
        </span>
      </div>
    </Link>
  );
}
