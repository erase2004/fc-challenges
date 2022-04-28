export const isSame = (str1: string, str2: string) => {
  return str1 === str2
}
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from '@/secrets/firebaseConfig'

const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Authenication
export const auth = getAuth(app)

// Firestore
export const db = getFirestore(app)
