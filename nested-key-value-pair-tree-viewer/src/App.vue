<template lang="pug">
div(class="md:px-20 px-2 pt-5 h-screen flex flex-col")
  h1(class="mb-1 text-2xl text-primary-200 font-bold") Nested Key-Value Pair Tree Viewer
  div(class="mb-5 flex flex-grow flex-col lg:flex-row overflow-hidden gap-4")
    InputArea(:mounted="teleportTargetMounted")
    DisplayArea(@ready="setMounted")

</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputArea from '@/components/InputArea.vue'
import DisplayArea from '@/components/DisplayArea.vue'

const teleportTargetMounted = ref(false)

function setMounted () {
  teleportTargetMounted.value = true
}
</script>
