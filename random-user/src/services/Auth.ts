import { auth } from "@/utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import type { SignInUser, SignUpUser } from "@/types/share"

export default {
  async signUp(data: SignUpUser) {
    const { email, password, name, avatar, gender, age } = data

    const resp = await createUserWithEmailAndPassword(auth, email, password)

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
  async getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();
        resolve(user);
      }, reject);
    })
  }
}

