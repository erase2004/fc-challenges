import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from '@/secrets/firebaseConfig'

const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Authenication
export const auth = getAuth(app)

const db = getFirestore(app)
enableIndexedDbPersistence(db)
  .catch((error) => {
    switch (error.code) {
      case 'failed-precondition':
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        break;

      case 'unimplemented':
        // The current browser does not support all of the
        // features required to enable persistence
        break;

      default:
        break;
    }
  })

// Firestore
export { db }