import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import { getValidOption } from '@/utils/helpers'
import { VALID_LIST_FORMAT } from "@/utils/constants"

const LIST_FORMAT_KEY = 'listFormat'

function getValidListFormat(format: string | null) {
  return getValidOption<string>(VALID_LIST_FORMAT, format)
}

export const useStore = () => {
  const store = defineStore('ui', {
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
      setListFormat(format: string | null): void {
        this.listFormat = getValidListFormat(format)
        storage.set(LIST_FORMAT_KEY, this.listFormat)
      }
    }
  })

  const s = store()
  s.setListFormat(storage.get(LIST_FORMAT_KEY))

  return s
}


