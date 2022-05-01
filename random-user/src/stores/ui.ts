import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import { getValidTab, getValidListFormat, getValidPageSize } from '@/utils/helpers'

const TAB_KEY = 'tab'
const LIST_FORMAT_KEY = 'listFormat'
const PAGE_SIZE_KEY = 'pageSize'

export const useStore = () => {
  const store = defineStore('ui', {
    state: () => ({
      'tab': '',
      'listFormat': '',
      'pageSize': 0,
    }),
    getters: {
      getTab(state): string {
        return getValidTab(state.tab)
      },
      getListFormat(state): string {
        return getValidListFormat(state.listFormat)
      },
      getPageSize(state): number {
        return getValidPageSize(state.pageSize)
      },
    },
    actions: {
      setTab(tab: string | null): void {
        this.tab = getValidTab(tab)
        storage.set(TAB_KEY, this.tab)
      },
      setListFormat(format: string | null): void {
        this.listFormat = getValidListFormat(format)
        storage.set(LIST_FORMAT_KEY, this.listFormat)
      },
      setPageSize(pageSize: string | number | null): void {
        this.pageSize = getValidPageSize(pageSize)
        storage.set(PAGE_SIZE_KEY, this.pageSize.toString())
      }
    }
  })

  const s = store()
  s.setTab(storage.get(TAB_KEY))
  s.setListFormat(storage.get(LIST_FORMAT_KEY))
  s.setPageSize(storage.get(PAGE_SIZE_KEY))

  return s
}


