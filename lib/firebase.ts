import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase config check:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId,
  environment: process.env.NODE_ENV,
  buildTime: process.env.NEXT_PHASE === 'phase-production-build'
});

// During build time, allow missing environment variables
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;

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
if (missingVars.length > 0) {
  const errorMsg = `Missing required Firebase environment variables: ${missingVars.join(', ')}`;
  console.error(errorMsg);
  
  // Only throw during runtime, not during build
  if (!isBuildTime) {
    throw new Error(errorMsg);
  } else {
    console.warn('Build time: Firebase environment variables missing, using dummy config');
  }
}

// Initialize Firebase
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  // During build time with missing env vars, create a dummy app
  if (isBuildTime && missingVars.length > 0) {
    console.log('Build time: Skipping Firebase initialization due to missing env vars');
    // Export null values for build time
  } else {
    if (!getApps().length) {
      console.log('Initializing Firebase app...');
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      console.log('Firebase initialized successfully');
    } else {
      console.log('Using existing Firebase app...');
      app = getApps()[0];
      db = getFirestore(app);
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  if (!isBuildTime) {
    throw error;
  }
}

export { app, db };
