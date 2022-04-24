<template lang="pug">
div(
  id="display-area"
  class="w-full h-1/2 lg:w-1/2 lg:h-full border border-primary-500 overflow-hidden flex flex-col"
)
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const emit = defineEmits(['ready'])

onMounted(() => {
  emit('ready')
})
</script>
