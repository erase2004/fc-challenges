import { valueToNode } from "@babel/types"

export default {
  get(key: string) {
    return localStorage.getItem(key)
  },
  set(key: string, value: string): void {
    localStorage.setItem(key, value)
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}