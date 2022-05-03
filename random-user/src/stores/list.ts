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
import { VALID_TAB, VALID_PAGE_SIZE } from "@/utils/constants"

const TAB_KEY = 'tab'
const PAGE_SIZE_KEY = 'pageSize'
const CURRENT_KEY = 'current'

function getValidTab(format: string | null) {
  return getValidOption<string>(VALID_TAB, format)
}

function getValidPageSize(pageSize: number | string | null) {
  pageSize = Number(pageSize)

  return getValidOption<number>(VALID_PAGE_SIZE, pageSize)
}

export const useStore = () => {
  const store = defineStore('list', {
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
      fetch() {
        const userQuery = query(storeService.getCollection('users'))

        const unSubscribtion = onSnapshot(userQuery, async (snap) => {
          this.loading = true

          try {
            if (!snap.empty) {
              const user = await authService.getCurrentUser()

              if (!user) {
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

              snap.forEach(docSnap => {
                const doc = docSnap.data()
                doc.id = docSnap.id
                doc.isFavorite = favorites.includes(doc.email)

                if (doc.isFavorite === true) {
                  this.favoriteData = [...this.favoriteData, doc]
                }

                this.data = [...this.data, doc]
              })

              this.setDisplayData()
            }
          } catch (error) {
            throw error
          } finally {
            this.loading = false
            unSubscribtion()
          }
        })
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

  const s = store()
  s.setTab(storage.get(TAB_KEY))
  s.setPageSize(storage.get(PAGE_SIZE_KEY))
  s.setCurrent(storage.get(CURRENT_KEY))
  s.fetch()

  return s
}