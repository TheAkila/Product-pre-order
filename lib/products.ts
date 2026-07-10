import { collection, doc, getDoc, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import { Product } from '@/types/product';

export function mapProductDoc(id: string, data: DocumentData): Product {
  return {
    id,
    name: data.name,
    description: data.description || '',
    images: Array.isArray(data.images) ? data.images : [],
    bannerImage: data.bannerImage || undefined,
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    regularPrice: data.regularPrice,
    preorderPrice: data.preorderPrice,
    deliveryFee: data.deliveryFee ?? 0,
    preorderCloses: data.preorderCloses,
    active: data.active !== false,
    sortOrder: data.sortOrder ?? 0,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.(),
  };
}

export async function getActiveProducts(): Promise<Product[]> {
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
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.active === false) return;
      products.push(mapProductDoc(docSnap.id, data));
    });

    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  const firebaseStatus = getFirebaseStatus();
  if (!firebaseStatus.isInitialized || !db) {
    return null;
  }

  try {
    const snap = await getDoc(doc(db, 'products', productId));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.active === false) return null;
    return mapProductDoc(snap.id, data);
  } catch (error) {
    console.error('Error loading product:', error);
    return null;
  }
}
