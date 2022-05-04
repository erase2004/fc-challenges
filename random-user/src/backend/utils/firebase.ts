import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from "firebase-admin/firestore"
const serviceAccount = require('@/secrets/serviceAccount.json')

const app = initializeApp({
  credential: cert(serviceAccount)
});

// Authenication
export const auth = getAuth(app)

// Firestore
export const db = getFirestore(app)