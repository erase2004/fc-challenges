import { defineStore } from 'pinia'
import storage from '@/utils/storage'

const TOKEN_KEY = 'accessToken'

export const useStore = defineStore('user', {
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


