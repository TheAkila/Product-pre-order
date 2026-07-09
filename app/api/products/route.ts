import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import { Product, ProductFormData, MAX_PRODUCT_IMAGES } from '@/types/product';
import { mapProductDoc } from '@/lib/products';

// GET /api/products - Fetch all products (add ?activeOnly=true for public homepage use)
export async function GET(request: NextRequest) {
  try {
    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json(
        {
          error: 'Database connection failed',
          details: firebaseStatus.error || 'Firebase not initialized',
        },
        { status: 500 }
      );
    }

    const activeOnly = request.nextUrl.searchParams.get('activeOnly') === 'true';

    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('sortOrder', 'asc'));
    const querySnapshot = await getDocs(q);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (activeOnly && data.active === false) return;
      products.push(mapProductDoc(doc.id, data));
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body: ProductFormData & { adminPassword?: string } = await request.json();

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!correctPassword || body.adminPassword !== correctPassword) {
      return NextResponse.json({ error: 'Unauthorized', details: 'Invalid admin password' }, { status: 401 });
    }

    const images = Array.isArray(body.images) ? body.images.filter(Boolean).slice(0, MAX_PRODUCT_IMAGES) : [];

    if (!body.name || images.length === 0 || body.preorderPrice == null || body.regularPrice == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const productsRef = collection(db, 'products');
    const productData = {
      name: body.name.trim(),
      description: (body.description || '').trim(),
      images,
      bannerImage: body.bannerImage || '',
      regularPrice: Number(body.regularPrice),
      preorderPrice: Number(body.preorderPrice),
      deliveryFee: Number(body.deliveryFee) || 0,
      preorderCloses: body.preorderCloses,
      active: body.active !== false,
      sortOrder: Number(body.sortOrder) || 0,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(productsRef, productData);

    return NextResponse.json({
      id: docRef.id,
      ...productData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
