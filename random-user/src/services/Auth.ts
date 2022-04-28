import { db, auth } from "@/utils/helpers";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth"
import type { SignInUser, SignUpUser } from "@/types/share"

const userCollection = collection(db, 'users')

export default {
  async signUp(data: SignUpUser) {
    const { email, password, name, avatar } = data

    const { user: { uid } } = await createUserWithEmailAndPassword(auth, email, password)

    const docRef = await addDoc(userCollection, {
      uid,
      name,
      email,
      avatar
    })

    return true
  },
  async signIn(data: SignInUser) {
    const { email, password } = data

    const { user } = await signInWithEmailAndPassword(auth, email, password)

    return user
  }
}

