<template lang="pug">
div(
  v-show="props.loading"
  class="absolute left-0 right-0 top-0 bottom-0"
)
  div(class="w-full h-full bg-gray-900 opacity-75")
  span(class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")
    div(class="w-48 h-48 border-4 border-solid border-gray-100 border-r-transparent border-b-transparent rounded-full animate-spin")
    span(class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100 text-xl text-center") {{ props.loadingText }}
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
  loadingText: string;
}

const props = defineProps<Props>()
</script>