<template lang="pug">
div(class="flex flex-row flex-shrink-0 justify-between items-center py-2")
  span(class="flex flex-row font-bold gap-3 items-center")
    span(
      v-for="tabName in VALID_TAB"
      :key="tabName"
      :class="getTabClass(listStore.getTab, tabName)"
      @click.stop="changeTab(tabName)"
    ) {{ tabName }}
  span(class="flex flex-row items-center gap-2 pr-2")
    span(class="relative")
      select(
        name="pagesize"
        class="appearance-none bg-white py-1 pl-2 pr-6 border-2 border-solid border-[#c5ced6] rounded outline-none"
        @change="changePageSize($event)"
      )
        option(
          v-for="(pageSize, index) in VALID_PAGE_SIZE"
          :key="pageSize"
          :value="pageSize"
          :selected="pageSize === listStore.getPageSize"
        ) {{ pageSize }}
      span(class="absolute right-3 top-1/2 -translate-y-3/4")
        ArrowUp(class="w-2 h-2")
      span(class="absolute right-3 bottom-1/2 translate-y-3/4")
        ArrowDown(class="w-2 h-2")
    span
      Grid(
        class="w-6 h-6 cursor-pointer"
        @click.stop="changeListFormat('card')"
        :class="getFormatClass(uiStore.getListFormat, 'card')"
      )
    span
      List(
        class="w-6 h-6 cursor-pointer"
        @click.stop="changeListFormat('list')"
        :class="getFormatClass(uiStore.getListFormat, 'list')"
      )
</template>

<script setup lang="ts">
import ArrowUp from '@/components/icons/ArrowUp.vue'
import ArrowDown from '@/components/icons/ArrowDown.vue'
import Grid from '@/components/icons/Grid.vue'
import List from '@/components/icons/List.vue'
import { useStore as useUIStore } from '@/stores/ui'
import { useStore as useListStore } from '@/stores/list'
import { isSame } from '@/utils/helpers'
import { VALID_TAB, VALID_PAGE_SIZE } from '@/utils/constants'

const uiStore = useUIStore()
const listStore = useListStore()

function getTabClass(input: string, tab: string): string {
  return `action-text-${isSame(input, tab) ? 'primary' : 'secondary'}`
}

function getFormatClass(input: string, format: string): string {
  return `format-${isSame(input, format) ? 'active' : 'inactive'}`
}

function changeTab(tab: string) {
  listStore.setTab(tab)
  listStore.setCurrent(1)
  listStore.fetch()
}

function changeListFormat(format: string) {
  uiStore.setListFormat(format)
}

function changePageSize(event: Event) {
  if (!event.target) return

  const target = (<HTMLSelectElement>event.target)
  listStore.setPageSize(target.value)
  listStore.setCurrent(1)
  listStore.setDisplayData()
}

</script>

<style lang="postcss">
.format-active {
  @apply fill-[#e9a2ad] hover:fill-rose-300;
}
.format-inactive {
  @apply fill-substrate hover:fill-slate-300;
}
</style>