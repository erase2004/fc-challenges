import { defineStore } from 'pinia'
import storage from '@/utils/storage'

export const useStore = defineStore('ui', {
  state: () => ({
    'listFormat': storage.get('listFormat') || 'card'
  })
})


