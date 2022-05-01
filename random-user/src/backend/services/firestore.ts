import type { Query } from 'firebase-admin/firestore';
import { CollectionReference } from 'firebase-admin/firestore'
import { db } from '@/backend/utils/firebase'

type Resolve = (value: boolean) => void
type Reject = (value: boolean) => void

async function deleteQueryBatch(query: Query, resolve: Resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;

  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve(true);
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

async function addRecordsBatch<T extends object, U extends keyof T>(collectionRef: CollectionReference, records: T[], recordKey: U) {
  const batch = db.batch()

  records.forEach(record => {
    const key = record[recordKey]
    const docRef = collectionRef.doc(String(key))
    batch.set(docRef, record)
  })

  return await batch.commit()
}

function getCollection(name: string) {
  return db.collection(name)
}

export default {
  async deleteCollection(name: string, batchSize: number) {
    const collection = getCollection(name)
    const query = collection.limit(batchSize)

    return new Promise((resolve: Resolve, reject: Reject) => {
      deleteQueryBatch(query, resolve).catch(reject)
    })
  },
  async addRecords<T extends object, U extends keyof T>(name: string, records: T[], recordKey: U, batchSize: number) {
    const collection = getCollection(name)

    do {
      const partition = records.splice(0, batchSize)

      await addRecordsBatch(collection, partition, recordKey)
    } while (records.length > 0);

    return true
  }
}

