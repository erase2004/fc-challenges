import { Query, DocumentData, addDoc } from "@firebase/firestore";
import { db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  writeBatch
} from "@firebase/firestore";


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
  async setDoc(collection: string, record: DocumentData, recordPath?: string | undefined) {
    const collectionRef = this.getCollection(collection)

    if (recordPath) {
      await setDoc(doc(collectionRef, recordPath), record)
    } else {
      await addDoc(collectionRef, record)
    }
  },
  async addFavorite(sourceUserName: string, targetUserName: string) {
    try {
      const existQuery = query(
        this.getCollection('favorites'),
        where('source', '==', sourceUserName),
        where('target', '==', targetUserName)
      )

      const existSnap = await this.getDocs(existQuery)

      if (!existSnap.empty) {
        return true
      }

      await this.setDoc('favorites', {
        source: sourceUserName,
        target: targetUserName
      })

      return true
    } catch (error) {
      console.error(error)

      return false
    }
  },
  async removeFavorite(sourceUserName: string, targetUserName: string) {
    try {
      const existQuery = query(
        this.getCollection('favorites'),
        where('source', '==', sourceUserName),
        where('target', '==', targetUserName)
      )

      const existSnap = await this.getDocs(existQuery)
      if (existSnap.empty) {
        return true
      }

      const docs = [...existSnap.docs]
      do {
        const batch = writeBatch(db)
        const partition = docs.splice(0, 500)

        partition.forEach(snapDoc => {
          batch.delete(snapDoc.ref)
        })
        await batch.commit()
      } while (docs.length > 0)

      return true

    } catch (error) {
      console.error(error)

      return false
    }
  }
}

