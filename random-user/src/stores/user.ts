import { defineStore } from 'pinia'
import type { User } from '@firebase/auth'
import { onAuthStateChanged } from '@firebase/auth'
import { auth } from '@/utils/firebase'
import authService from '@/services/auth'
import storeService from '@/services/firestore'
import storage from '@/utils/storage'
import { USERNAME_KEY, UID_KEY } from '@/utils/constants'

export const useStore = () => {
  const store = defineStore('user', {
    state: () => ({
      name: storage.get(USERNAME_KEY) || '',
      uid: storage.get(UID_KEY) || ''
    }),
    getters: {

    },
    actions: {
      async update() {
        const user = await authService.getCurrentUser() as User | null

        if (!user) {
          return
        }

        await this.updateById(user.email)
      },
      async updateById(id: string | null) {
        if (id === null) {
          return
        }

        const userDoc = await storeService.getDoc('users', id)
        const userData = userDoc.data()

        if (userData) {
          this.name = userData.name
          this.uid = userData.email
          storage.set(USERNAME_KEY, this.name)
          storage.set(UID_KEY, this.uid)
        }
      }
    }
  })

  const s = store()
  s.update()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // login

      await s.updateById(user.email)
    } else {
      // logout

      storage.remove(USERNAME_KEY)
      s.$reset()
    }
  })

  return s;
}


