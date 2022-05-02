import type { Query } from "@firebase/firestore";
import { db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "@firebase/firestore";


export default {
  getCollection(name: string) {
    return collection(db, name)
  },
  async getDoc(collection: string, ...docPath: string[]) {
    const docRef = doc(db, collection, ...docPath)

    return await getDoc(docRef)
  },
  async getDocs(query: Query) {
    return await getDocs(query)
  },
  async setDoc<T extends object>(collection: string, record: T, recordPath: string | undefined) {
    const collectionRef = this.getCollection(collection)
    await setDoc(doc(collectionRef, recordPath), record)
  }
}

