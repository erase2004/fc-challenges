import { valueToNode } from "@babel/types"

export default {
  get(key: string) {
    return localStorage.getItem(key)
  },
  set(key: string, value: string | null): void {
    if (value === null) value = ''

    localStorage.setItem(key, value)
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}