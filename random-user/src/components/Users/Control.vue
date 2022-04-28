<template lang="pug">
div(class="flex flex-col flex-grow px-4")
  div(class="flex flex-row flex-shrink-0 justify-between items-center")
    span(class="flex flex-row font-bold gap-3 items-center")
      span(class="action-text-primary") ALL
      span(class="action-text-secondary") Favorite
    span(class="flex flex-row items-center gap-2")
      span(class="relative")
        select(
          name="pagesize"
          class="appearance-none bg-white py-1 pl-2 pr-6 border-2 border-solid border-[#c5ced6] rounded outline-none"
        )
          option(value="10" selected) 10
          option(value="30") 30
          option(value="50") 50
        span(class="absolute right-3 top-1/2 -translate-y-3/4")
          ArrowUp(class="w-2 h-2")
        span(class="absolute right-3 bottom-1/2 translate-y-3/4")
          ArrowDown(class="w-2 h-2")
      span
        Grid(class="w-6 h-6 cursor-pointer format-active")
      span
        List(class="w-6 h-6 cursor-pointer format-inactive")
</template>

<script setup lang="ts">
import ArrowUp from '@/components/icons/ArrowUp.vue'
import ArrowDown from '@/components/icons/ArrowDown.vue'
import Grid from '@/components/icons/Grid.vue'
import List from '@/components/icons/List.vue'
</script>

<style lang="postcss">
.format-active {
  @apply fill-[#e9a2ad] hover:fill-rose-300;
}
.format-inactive {
  @apply fill-substrate hover:fill-slate-300;
}
</style>