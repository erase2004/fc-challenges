<template lang="pug">
div(
  class="block w-6 h-6 absolute right-4 bottom-4 cursor-pointer"
)
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
import type { DocumentData } from '@firebase/firestore'
import HeartFill from '@/components/icons/HeartFill.vue'
import HeartEmpty from '@/components/icons/HeartEmpty.vue'
import { useStore as useUserStore } from '@/stores/user'
import { useStore as useListStore } from '@/stores/list'

interface Props {
  user: DocumentData
}

const props = defineProps<Props>()

const uiStore = useUserStore()
const listStore = useListStore()

async function addFavorite(user: DocumentData) {

}

async function removeFavorite(user: DocumentData) {

}

</script>