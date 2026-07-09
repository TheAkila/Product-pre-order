import Link from 'next/link';
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
      <OrderForm product={product} />
      <Footer />
    </main>
  );
}
