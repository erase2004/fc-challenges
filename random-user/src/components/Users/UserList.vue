<template lang="pug">
div(
  class="relative flex flex-row flex-shrink-0 h-28 bg-substrate p-4 overflow-hidden"
  @click.stop="showModal(props.user)"
)
  Avatar(
    :imageUrl="props.user.avatar"
    class="h-20 w-20 flex-shrink-0"
  )
  div(class="flex flex-col flex-grow flex-shrink justify-center text-lg font-semibold leading-tight overflow-hidden px-4")
    div(class="inline-block") {{ props.user.name }}
  FavoriteButton(:user="props.user")
</template>

<script setup lang="ts">
import type { DocumentData } from '@firebase/firestore'
import { userComponent } from '@/utils/userComponent'
import Avatar from '@/components/Avatar.vue'
import FavoriteButton from '@/components/Users/FavoriteButton.vue'

interface Props {
  user: DocumentData;
}

interface Emits {
  (e: 'showModal', user: DocumentData): void;
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { showModal } = userComponent(emits)
</script>