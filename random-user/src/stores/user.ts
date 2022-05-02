import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import { auth } from '@/utils/firebase'
import { onAuthStateChanged } from '@firebase/auth'

const TOKEN_KEY = 'accessToken'

export const useStore = () => {
  const s = defineStore('user', {
    state: () => ({
      'accessToken': storage.get(TOKEN_KEY) || undefined
    }),
    getters: {

    },
    actions: {
      setToken(token: string) {
        this.accessToken = token
        storage.set(TOKEN_KEY, token)
      }
    }
  })

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // login

    } else {
      // logout

    }
  })

  return s;
}


