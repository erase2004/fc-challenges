import type {
  DocumentData
} from '@firebase/firestore'
import {
  onSnapshot,
  query,
  where
} from '@firebase/firestore'
import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import authService from '@/services/auth'
import storeService from '@/services/firestore'
import { getValidOption } from '@/utils/helpers'
import { VALID_TAB, VALID_PAGE_SIZE, TAB_KEY, PAGE_SIZE_KEY, CURRENT_KEY } from "@/utils/constants"

function getValidTab(format: string | null) {
  return getValidOption<string>(VALID_TAB, format)
}

function getValidPageSize(pageSize: number | string | null) {
  pageSize = Number(pageSize)

  return getValidOption<number>(VALID_PAGE_SIZE, pageSize)
}

export const useStore = defineStore('list', {
  state: () => ({
    tab: '',
    pageSize: 0,
    data: [] as DocumentData[],
    favoriteData: [] as DocumentData[],
    displayData: [] as DocumentData[],
    totalPage: 1,
    current: 1,
    loading: true,
  }),
  getters: {
    getTab(state): string {
      return getValidTab(state.tab)
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
    setPageSize(pageSize: string | number | null): void {
      this.pageSize = getValidPageSize(pageSize)
      storage.set(PAGE_SIZE_KEY, this.pageSize.toString())
    },
    setCurrent(current: string | number | null): void {
      current = Number(current)

      if (current < 1) {
        current = 1
      }
      this.current = current
      storage.set(CURRENT_KEY, this.current.toString())
    },
    initialize() {
      this.setTab(storage.get(TAB_KEY))
      this.setPageSize(storage.get(PAGE_SIZE_KEY))
      this.setCurrent(storage.get(CURRENT_KEY))
      this.fetch()
    },
    async fetch() {
      // get user list and related favorite data
      this.loading = true

      try {
        const userQuery = query(storeService.getCollection('users'))

        const [user, userSnap] = await Promise.all([authService.getCurrentUser(), storeService.getDocs(userQuery)])

        if (!user || userSnap.empty) {
          this.loading = false
          return
        }

        const favorites: string[] = []
        const favoriteQuery = query(storeService.getCollection('favorites'), where('uid', '==', user.email!))
        const favoriteSnap = await storeService.getDocs(favoriteQuery)

        if (!favoriteSnap.empty) {
          favoriteSnap.forEach(docSnap => {
            const doc = docSnap.data()
            favorites.push(doc.target)
          })
        }

        this.data = []
        this.favoriteData = []

        userSnap.forEach(docSnap => {
          const doc = docSnap.data()
          doc.id = docSnap.id
          doc.isFavorite = favorites.includes(doc.email)

          if (doc.isFavorite === true) {
            this.favoriteData = [...this.favoriteData, doc]
          }

          this.data = [...this.data, doc]
        })

        this.setDisplayData()

      } catch (error) {

        throw error
      } finally {

        this.loading = false
      }
    },
    setDisplayData() {
      const start = this.pageSize * (this.current - 1)
      const end = this.pageSize * (this.current)

      let data = (this.getTab === 'ALL') ? this.data : this.favoriteData
      this.totalPage = Math.ceil(data.length / this.pageSize)
      this.displayData = data.slice(start, end)
    }
  }
})