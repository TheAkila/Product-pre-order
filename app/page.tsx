import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import { getActiveProducts } from '@/lib/products';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Details from '@/components/Details';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

async function getHeroSlideImages(): Promise<string[]> {
  const firebaseStatus = getFirebaseStatus();
  if (!firebaseStatus.isInitialized || !db) {
    return [];
  }

  try {
    const slidesRef = collection(db, 'heroSlides');
    const q = query(slidesRef, orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().imageUrl as string).filter(Boolean);
  } catch (error) {
    console.error('Error loading hero slides for homepage:', error);
    return [];
  }
}

export default async function Home() {
  const [products, heroImages] = await Promise.all([getActiveProducts(), getHeroSlideImages()]);

  return (
    <main className="min-h-screen">
      <Hero images={heroImages} />
      <section id="products" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-black mb-2 sm:mb-3">
              Shop Pre-Orders
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Pick an item to view details, pricing, and reserve yours.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center font-body text-slate-500 py-12">
              No products are available for pre-order right now. Check back soon.
            </p>
          )}
        </div>
      </section>
      <Details />
      <Footer />
    </main>
  );
}
