import type { DocumentData } from '@firebase/firestore'

export function userComponent(emits: (e: 'showModal', user: DocumentData) => void) {
  const showModal = (user: DocumentData) => {
    emits('showModal', user)
  }

  return {
    showModal
  }
}