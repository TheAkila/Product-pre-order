import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import { Order, OrderFormData } from '@/types/order';

// GET /api/orders - Fetch all orders
export async function GET() {
  console.log('Orders API called at:', new Date().toISOString());
  
  try {
    // Check Firebase status first
    const firebaseStatus = getFirebaseStatus();
    console.log('Firebase status:', firebaseStatus);
    
    if (!firebaseStatus.isInitialized || !db) {
      console.error('Firebase is not properly initialized');
      return NextResponse.json({
        error: 'Database connection failed',
        details: firebaseStatus.error || 'Firebase not initialized',
        missingEnvVars: firebaseStatus.missingEnvVars,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('Firebase db initialized, fetching orders...');
    
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
        email: data.email,
        phone: data.phone,
        quantity: data.quantity,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        deliveryMethod: data.deliveryMethod,
        deliveryDetails: data.deliveryDetails,
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
    if (!body.name || !body.email || !body.phone || !body.quantity) {
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
    const deliveryFee = body.deliveryMethod === 'DELIVER' ? 200 : 0;
    const amount = (productPrice * body.quantity) + deliveryFee;

    // Validate delivery details if delivery method is DELIVER
    if (body.deliveryMethod === 'DELIVER') {
      if (!body.deliveryDetails?.address || !body.deliveryDetails?.city) {
        return NextResponse.json(
          { error: 'Address and city are required for delivery orders' },
          { status: 400 }
        );
      }
    }

    // Create order in Firebase
    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      console.error('Firebase db is not initialized for POST');
      return NextResponse.json({
        error: 'Database connection failed',
        details: firebaseStatus.error || 'Firebase not initialized'
      }, { status: 500 });
    }
    
    const ordersRef = collection(db, 'orders');
    const orderData = {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      quantity: body.quantity,
      amount,
      paymentMethod: 'PAYHERE',
      paymentStatus: 'PENDING_PAYMENT',
      deliveryMethod: body.deliveryMethod,
      ...(body.deliveryMethod === 'DELIVER' && {
        deliveryDetails: {
          address: body.deliveryDetails?.address?.trim(),
          city: body.deliveryDetails?.city?.trim(),
          postalCode: body.deliveryDetails?.postalCode?.trim(),
        }
      }),
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(ordersRef, orderData);

    console.log(`✓ Order created successfully: ${docRef.id}`);

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
