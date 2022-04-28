<template lang="pug">
div(class="w-32 h-32 rounded-full bg-slate-400")
  img(
    v-show="selfImageUrl !== ''"
    :src="selfImageUrl"
    @error="selfImageUrl = ''"
    class="w-full h-full rounded-full object-cover"
  )
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
interface Props {
  imageUrl: string;
}

const props = defineProps<Props>()
const selfImageUrl = ref(props.imageUrl)

watch(() => props.imageUrl, (value, previouseValue) => {
  selfImageUrl.value = value
})
</script>