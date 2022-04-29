import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import { getValidTab, getValidListFormat, getValidPageSize } from '@/utils/helpers'

export const useStore = defineStore('ui', {
  state: () => ({
    'tab': storage.get('tab'),
    'listFormat': storage.get('listFormat'),
    'pageSize': storage.get('pageSize'),
  }),
  getters: {
    validTab(state): string {
      return getValidTab(state.tab)
    },
    validListFormat(state): string {
      return getValidListFormat(state.listFormat)
    },
    validPageSize(state): number {
      return getValidPageSize(state.pageSize)
    },
  }
})


