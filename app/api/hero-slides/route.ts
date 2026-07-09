import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import { HeroSlide } from '@/types/heroSlide';

// GET /api/hero-slides - Fetch all hero carousel slides, ordered by upload order
export async function GET() {
  try {
    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json(
        { error: 'Database connection failed', details: firebaseStatus.error || 'Firebase not initialized' },
        { status: 500 }
      );
    }

    const slidesRef = collection(db, 'heroSlides');
    const q = query(slidesRef, orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);

    const slides: HeroSlide[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      slides.push({
        id: doc.id,
        imageUrl: data.imageUrl,
        sortOrder: data.sortOrder ?? 0,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      });
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/hero-slides - Add a new slide (admin only)
export async function POST(request: NextRequest) {
  try {
    const body: { imageUrl?: string; adminPassword?: string } = await request.json();

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!correctPassword || body.adminPassword !== correctPassword) {
      return NextResponse.json({ error: 'Unauthorized', details: 'Invalid admin password' }, { status: 401 });
    }

    if (!body.imageUrl) {
      return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 });
    }

    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const slidesRef = collection(db, 'heroSlides');
    const slideData = {
      imageUrl: body.imageUrl,
      sortOrder: Date.now(),
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(slidesRef, slideData);

    return NextResponse.json({ id: docRef.id, ...slideData, createdAt: new Date() });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
