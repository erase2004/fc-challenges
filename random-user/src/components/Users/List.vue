<template lang="pug">
div(class="flex flex-row h-full flex-shrink-1 flex-grow-0 overflow-x-clip overflow-y-auto")
  div(
    v-if="uiStore.listFormat === 'list'"
    class="flex flex-col flex-grow gap-y-8"
  )
    div(
      v-for="item in list"
      :key="item"
      class="flex flex-row flex-shrink-0 h-28 bg-substrate p-4 overflow-hidden"
    )
      Avatar(
        imageUrl=""
        class="h-20 w-20 flex-shrink-0"
      )
      div(class="flex flex-col flex-grow flex-shrink justify-center text-lg font-semibold leading-tight overflow-hidden px-4")
        div(class="inline-block") aaaa bbbb cccc ddd eeee ffff aaaa bbbb cccc ddd eeee ffff aaaa bbbb cccc ddd eeee ffff
      div(class="inline-block flex-shrink-0 w-6 h-6 ml-auto cursor-pointer")
        HeartFill(class="fill-[#4b5c6b]")
        HeartEmpty(class="fill-[#4b5c6b]")

  div(
    v-else
    class="flex flex-row flex-wrap gap-x-6 gap-y-8")
    div(
      v-for="item in list"
      :key="item"
      class="inline-block w-40 h-60 bg-substrate p-4 overflow-hidden"
    )
      Avatar(imageUrl="")
      div(
        class="leading-tight overflow-hidden text-ellipsis line-clamp-[2] my-3 mx-auto"
        title="aaaa bbbb cccc ddd eeee ffff"
      ) aaaa bbbb cccc ddd eeee ffff
      div(class="block w-6 h-6 ml-auto cursor-pointer")
        HeartFill(class="fill-[#4b5c6b]")
        HeartEmpty(class="fill-[#4b5c6b]")

</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Avatar from '@/components/Avatar.vue'
import HeartFill from '@/components/icons/HeartFill.vue'
import HeartEmpty from '../icons/HeartEmpty.vue'
import { useStore } from '@/stores/ui'

const uiStore = useStore()

let list = reactive<number[]>([])

for (let n = 0; n < 50; n += 1) {
  list.push(n)
}
</script>