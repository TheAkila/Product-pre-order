import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getProductById } from '@/lib/products';
import Product from '@/components/Product';
import OrderForm from '@/components/OrderForm';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 font-body text-sm font-semibold text-slate-600 hover:text-brand-red transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to all products
        </Link>
      </div>
      <Product product={product} />
      {product.bannerImage && (
        <div className="max-w-md mx-auto px-3 sm:px-6 lg:px-8 mb-4">
          <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden">
            <Image
              src={product.bannerImage}
              alt={`${product.name} banner`}
              fill
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 448px"
            />
          </div>
        </div>
      )}
      <OrderForm product={product} />
      <Footer />
    </main>
  );
}
