import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';

// Read Firebase configuration STRICTLY from environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID;

// Fixed admin email address read strictly from environment variable
export const adminEmail: string = import.meta.env.VITE_ADMIN_EMAIL || '';

// Detect whether Firebase environment variables are provided
export const isFirebaseConfigured = Boolean(apiKey && projectId);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firestoreDb: Firestore | null = null;

if (isFirebaseConfigured) {
  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };

  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  firebaseAuth = getAuth(firebaseApp);
  // Support custom database ID if set, otherwise default
  firestoreDb = firestoreDatabaseId && firestoreDatabaseId !== '(default)'
    ? getFirestore(firebaseApp, firestoreDatabaseId)
    : getFirestore(firebaseApp);
}

export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firestoreDb;

// Standardized error handler according to Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(errInfo.error);
}

// Initial connection test
if (isFirebaseConfigured && db) {
  (async () => {
    try {
      await getDocFromServer(doc(db, '_connection_test', 'ping'));
    } catch (e: any) {
      if (e?.message?.includes('the client is offline')) {
        console.warn('Firebase client is offline or configuration is unreachable.');
      }
    }
  })();
}
