<template lang="pug">
div(
  class="block w-6 h-6 absolute right-4 bottom-4 cursor-pointer"
)
  //- processing animation
  template(v-if="isProcessing")
    div(class="w-full h-full border-4 border-solid border-[#4b5c6b] border-r-transparent border-b-transparent rounded-full animate-spin")

  //- normal display
  template(v-else)
    HeartFill(
      v-if="props.user.isFavorite"
      class="fill-[#4b5c6b]"
      @click.stop="removeFavorite(props.user)"
    )
    HeartEmpty(
      v-else
      class="fill-[#4b5c6b]"
      @click.stop="addFavorite(props.user)"
    )

</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DocumentData } from '@firebase/firestore'
import HeartFill from '@/components/icons/HeartFill.vue'
import HeartEmpty from '@/components/icons/HeartEmpty.vue'
import { useStore as useUserStore } from '@/stores/user'
import { useStore as useListStore } from '@/stores/list'
import storeService from '@/services/firestore'

interface Props {
  user: DocumentData
}

const props = defineProps<Props>()
const isProcessing = ref<boolean>(false)

const userStore = useUserStore()
const listStore = useListStore()

async function addFavorite(user: DocumentData) {
  if (user.isFavorite === true || isProcessing.value === true) {
    return
  }

  isProcessing.value = true

  const result = await storeService.addFavorite(userStore.uid, user.email)

  if (result === true) {
    listStore.fetch(true)
    user.isFavorite = true
  }

  isProcessing.value = false
}

async function removeFavorite(user: DocumentData) {
  if (user.isFavorite === false || isProcessing.value === true) {
    return
  }

  isProcessing.value = true

  const result = await storeService.removeFavorite(userStore.uid, user.email)

  if (result === true) {
    listStore.fetch(true)
    user.isFavorite = false
  }

  isProcessing.value = false
}

</script>