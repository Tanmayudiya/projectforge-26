import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

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
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isFirebaseConfigured = false;

// Attempt to load Firebase config safely
try {
  // Check if custom config exists in window/localStorage or placeholder
  const storedConfig = localStorage.getItem('projectforge_firebase_config');
  let config = storedConfig ? JSON.parse(storedConfig) : null;

  if (!config) {
    // Default mock/demo configuration to initialize Firebase SDK safely without throwing at load time
    config = {
      apiKey: "AIzaSyFakeKeyForLocalDemonstration12345678",
      authDomain: "projectforge-demo.firebaseapp.com",
      projectId: "projectforge-demo",
      storageBucket: "projectforge-demo.appspot.com",
      messagingSenderId: "123456789012",
      appId: "1:123456789012:web:abcdef123456"
    };
  }

  if (getApps().length === 0) {
    app = initializeApp(config);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseConfigured = !storedConfig ? false : true;
} catch (err) {
  console.warn('Firebase initialized in local fallback mode:', err);
}

export { app, auth, db, isFirebaseConfigured };

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
