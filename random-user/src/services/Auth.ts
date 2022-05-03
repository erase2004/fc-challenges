import type { SignInUser, SignUpUser } from "@/types/share"
import type { User } from "@firebase/auth"
import { auth } from "@/utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import storeService from '@/services/firestore'

export default {
  async signUp(data: SignUpUser) {
    const { email, password, name, avatar = '', gender, age } = data

    const resp = await createUserWithEmailAndPassword(auth, email, password)

    await storeService.setDoc('users', {
      age,
      avatar,
      email,
      gender,
      name,
      uid: email
    }, email)

    return resp
  },
  async signIn(data: SignInUser) {
    const { email, password } = data

    const { user } = await signInWithEmailAndPassword(auth, email, password)

    return user
  },
  async signOut() {
    const resp = await signOut(auth)

    return resp
  },
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();
        resolve(user);
      }, reject);
    })
  }
}

