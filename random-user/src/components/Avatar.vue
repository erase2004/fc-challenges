<template lang="pug">
div(class="w-32 h-32 rounded-full bg-slate-400")
  img(
    v-if="selfImageUrl !== ''"
    :src="selfImageUrl"
    @error="handleError"
    class="w-full h-full rounded-full object-cover"
    loading="lazy"
    decoding="async"
  )
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  imageUrl: string | undefined;
}
interface Emits {
  (e: 'failed'): void;
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const selfImageUrl = ref(props.imageUrl)

watch(() => props.imageUrl, (value, previouseValue) => {
  selfImageUrl.value = value
})

function handleError() {
  if (selfImageUrl.value === undefined) {
    selfImageUrl.value = ''
    return
  }

  selfImageUrl.value = ''
  emit('failed')
}
</script>