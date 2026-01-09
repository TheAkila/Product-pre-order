import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderFormData } from '@/types/order';

// GET /api/orders - Fetch all orders
export async function GET() {
  console.log('Orders API called at:', new Date().toISOString());
  
  try {
    // Check if Firebase is properly configured
    if (!db) {
      console.error('Firebase db is not initialized');
      return NextResponse.json(
        { error: 'Database connection failed - Firebase not configured' },
        { status: 500 }
      );
    }

    console.log('Firebase db initialized, fetching orders...');
    if (!db) {
      console.error('Firebase db became null after initialization check');
      return NextResponse.json(
        { error: 'Database connection lost' },
        { status: 500 }
      );
    }
    
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    console.log('Executing Firestore query...');
    const querySnapshot = await getDocs(q);
    console.log('Query completed, document count:', querySnapshot.size);

    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Processing document:', doc.id, data);
      orders.push({
        orderId: doc.id,
        name: data.name,
        phone: data.phone,
        size: data.size,
        quantity: data.quantity,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    console.log('Returning orders:', orders.length);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body: OrderFormData = await request.json();

    // Validate input
    if (!body.name || !body.phone || !body.size || !body.quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (body.quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Calculate amount
    const productPrice = parseInt(process.env.NEXT_PUBLIC_PRODUCT_PRICE || '2500');
    const amount = productPrice * body.quantity;

    // Create order in Firebase
    if (!db) {
      console.error('Firebase db is not initialized for POST');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const ordersRef = collection(db, 'orders');
    const orderData = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      size: body.size,
      quantity: body.quantity,
      amount,
      paymentMethod: 'PAYHERE',
      paymentStatus: 'PENDING_PAYMENT',
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(ordersRef, orderData);

    return NextResponse.json({
      orderId: docRef.id,
      ...orderData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
