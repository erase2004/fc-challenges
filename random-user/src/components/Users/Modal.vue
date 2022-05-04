<template lang="pug">
div(
  class="absolute left-0 right-0 top-0 bottom-0"
)
  div(
    @click.stop="closeModal"
    class="w-full h-full bg-[#c3cfd9] opacity-75"
  )
  span(class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")
    div(class="w-80 sm:w-96 px-6 py-10 sm:p-10 bg-white")
      //- close button
      div(
        class="absolute right-3 top-5 sm:right-5 font-bold text-xl text-[#293845] cursor-pointer"
        @click.stop="closeModal"
      ) X

      //- user info
      Avatar(
        :imageUrl="props.user.avatar"
        class="mx-auto"
      )
      div(class="mt-4")
        div(class="info-group")
          div(class="title") Name
          div(class="content") {{ props.user.name }}
        div(class="info-group")
          div(class="title") Email
          a(class="content" :href="`mailto:${props.user.email}`") {{ props.user.email}}
        div(class="info-group")
          div(class="title") Gender
          div(class="content") {{ props.user.gender}}
        div(class="info-group")
          div(class="title") Age
          div(class="content") {{ props.user.age }}
      span
</template>

<script setup lang="ts">
import type { DocumentData } from '@firebase/firestore'
import Avatar from '@/components/Avatar.vue'

interface Props {
  user: DocumentData;
}
interface Emits {
  (e: 'closeModal'): void;
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

function closeModal() {
  emits('closeModal')
}

</script>

<style lang="postcss">
.info-group {
  @apply flex flex-row;
}
.title {
  @apply inline-block w-1/4 font-bold;
}
.content {
  @apply inline-block w-3/4 whitespace-nowrap overflow-hidden text-ellipsis;
}
</style>