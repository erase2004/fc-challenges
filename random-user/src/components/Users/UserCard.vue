<template lang="pug">
div(class="relative inline-block w-40 h-60 bg-substrate p-4 overflow-hidden")
  Avatar(:imageUrl="props.user.avatar")
  div(
    class="leading-tight overflow-hidden text-ellipsis line-clamp-[2] my-3 mx-auto"
    title="{{ props.user.name }}"
  ) {{ props.user.name }}
  FavoriteButton(:user="props.user")
</template>

<script setup lang="ts">
import type { DocumentData } from '@firebase/firestore'
import Avatar from '@/components/Avatar.vue'
import FavoriteButton from '@/components/Users/FavoriteButton.vue'

interface Props {
  user: DocumentData;
}

const props = defineProps<Props>()

</script>