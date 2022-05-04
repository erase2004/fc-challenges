<template lang="pug">
div(
  class="relative inline-block w-40 h-60 bg-substrate p-4 overflow-hidden"
  @click.stop="showModal(props.user)"
)
  Avatar(:imageUrl="props.user.avatar")
  div(
    class="leading-tight overflow-hidden text-ellipsis line-clamp-[2] my-3 mx-auto"
    title="{{ props.user.name }}"
  ) {{ props.user.name }}
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