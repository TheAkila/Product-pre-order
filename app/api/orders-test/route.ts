import { NextResponse } from 'next/server';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  console.log('Orders test API called at:', new Date().toISOString());
  
  try {
    // First test - simple connection
    console.log('Testing Firebase connection...');
    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Firebase db is null or undefined - Firebase not configured',
        timestamp: new Date().toISOString(),
        buildTime: process.env.NEXT_PHASE === 'phase-production-build'
      }, { status: 500 });
    }

    // Second test - try to get collection reference
    console.log('Getting orders collection reference...');
    if (!db) {
      console.error('Firebase db became null before collection reference');
      return NextResponse.json({
        success: false,
        error: 'Firebase db became null',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    const ordersRef = collection(db, 'orders');
    console.log('Orders collection reference created successfully');

    // Third test - try a simple query with limit
    console.log('Attempting to fetch limited orders...');
    const q = query(ordersRef, limit(5));
    
    console.log('Executing query...');
    const querySnapshot = await getDocs(q);
    console.log('Query executed successfully, docs:', querySnapshot.size);

    // Process results
    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Processing doc:', doc.id);
      orders.push({
        orderId: doc.id,
        data: data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Orders fetched successfully',
      count: orders.length,
      orders: orders,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Orders test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}