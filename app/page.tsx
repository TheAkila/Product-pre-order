import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import { Product } from '@/types/product';
import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import Details from '@/components/Details';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

async function getActiveProducts(): Promise<Product[]> {
  const firebaseStatus = getFirebaseStatus();
  if (!firebaseStatus.isInitialized || !db) {
    console.error('Firebase not initialized, cannot load products:', firebaseStatus);
    return [];
  }

  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.active === false) return;
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description || '',
        imageFront: data.imageFront,
        imageBack: data.imageBack,
        regularPrice: data.regularPrice,
        preorderPrice: data.preorderPrice,
        deliveryFee: data.deliveryFee ?? 0,
        preorderCloses: data.preorderCloses,
        active: data.active !== false,
        sortOrder: data.sortOrder ?? 0,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.(),
      });
    });

    return products;
  } catch (error) {
    console.error('Error loading products for homepage:', error);
    return [];
  }
}

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
      <div id="products">
        {products.length > 0 ? (
          products.map((product) => <ProductSection key={product.id} product={product} />)
        ) : (
          <div className="py-20 text-center">
            <p className="font-body text-slate-500">No products are available for pre-order right now. Check back soon.</p>
          </div>
        )}
      </div>
      <Details />
      <Footer />
    </main>
  );
}
