import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// During build time, allow missing environment variables
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
const isServerSide = typeof window === 'undefined';

console.log('Firebase initialization attempt:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId,
  environment: process.env.NODE_ENV,
  isBuildTime,
  isServerSide,
  vercelEnv: process.env.VERCEL_ENV
});

// Validate required Firebase environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

// Initialize Firebase with proper error handling
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let initError: Error | null = null;

try {
  if (missingVars.length > 0) {
    const errorMsg = `Missing Firebase environment variables: ${missingVars.join(', ')}`;
    console.error(errorMsg);

    if (!isBuildTime) {
      initError = new Error(errorMsg);
      console.warn('Firebase not initialized due to missing environment variables');
    } else {
      console.log('Build time: Skipping Firebase initialization due to missing env vars');
    }
  } else {
    // All environment variables are present, try to initialize
    if (!getApps().length) {
      console.log('Initializing Firebase app...');
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      storage = getStorage(app);
      console.log('Firebase initialized successfully');
    } else {
      console.log('Using existing Firebase app...');
      app = getApps()[0];
      db = getFirestore(app);
      storage = getStorage(app);
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  initError = error instanceof Error ? error : new Error('Firebase initialization failed');
  
  // Don't throw during build time or module loading
  if (!isBuildTime && isServerSide) {
    console.error('Firebase initialization failed, but continuing...');
  }
}

// Export with error checking function
export { app, db, storage };

export function getFirebaseStatus() {
  return {
    isInitialized: !!db,
    hasError: !!initError,
    error: initError?.message,
    missingEnvVars: missingVars
  };
}
