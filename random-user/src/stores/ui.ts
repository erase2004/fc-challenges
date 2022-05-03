import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import { getValidOption } from '@/utils/helpers'
import { VALID_LIST_FORMAT, LIST_FORMAT_KEY } from "@/utils/constants"

function getValidListFormat(format: string | null) {
  return getValidOption<string>(VALID_LIST_FORMAT, format)
}

export const useStore = defineStore('ui', {
  state: () => ({
    'listFormat': '',
    'pageLoading': true
  }),
  getters: {
    getListFormat(state): string {
      return getValidListFormat(state.listFormat)
    }
  },
  actions: {
    initialize() {
      this.setListFormat(storage.get(LIST_FORMAT_KEY))
    },
    setListFormat(format: string | null): void {
      this.listFormat = getValidListFormat(format)
      storage.set(LIST_FORMAT_KEY, this.listFormat)
    }
  }
})


