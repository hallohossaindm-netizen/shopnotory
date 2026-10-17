import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const env: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' && import.meta && import.meta.env
    ? (import.meta.env as any)
    : (typeof process !== 'undefined' && process.env ? process.env : {});

const defaultFirebaseConfig = {
  apiKey: "AIzaSyDbvT4rjl12eUSmKTao0KcN6NJH9YIUy6Y",
  authDomain: "shopnotory13.firebaseapp.com",
  projectId: "shopnotory13",
  storageBucket: "shopnotory13.firebasestorage.app",
  messagingSenderId: "27958213094",
  appId: "1:27958213094:web:f7458c0e5b9a3f3cad3e27",
  measurementId: "G-WGXRPDEXPV"
};

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
};

const configured = Boolean(
  config.apiKey &&
  config.apiKey !== 'replace_me' &&
  config.projectId &&
  config.projectId !== 'your-project-id' &&
  config.appId &&
  config.appId !== 'replace_me'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (configured) {
  try {
    app = getApps().length ? getApps()[0] : initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization error, fallback to unconfigured mode:', err);
  }
}

export const firebaseReady = Boolean(configured && app);
export { auth, db };
