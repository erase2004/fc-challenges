<template lang="pug">
div(class="flex flex-row h-full flex-shrink-1 flex-grow-0 overflow-x-clip overflow-y-auto")
  div(
    v-if="uiStore.getListFormat === 'list'"
    class="flex flex-col flex-grow gap-y-8"
  )
    div(
      v-for="user in listStore.displayData"
      :key="user.uid"
      class="relative flex flex-row flex-shrink-0 h-28 bg-substrate p-4 overflow-hidden"
    )
      Avatar(
        :imageUrl="user.avatar"
        class="h-20 w-20 flex-shrink-0"
      )
      div(class="flex flex-col flex-grow flex-shrink justify-center text-lg font-semibold leading-tight overflow-hidden px-4")
        div(class="inline-block") {{ user.name }}
      div(class="inline-block flex-shrink-0 w-6 h-6 absolute right-4 bottom-4 cursor-pointer")
        HeartFill(
          v-if="user.isFavorite"
          class="fill-[#4b5c6b]"
        )
        HeartEmpty(
          v-else
          class="fill-[#4b5c6b]"
        )

  div(
    v-else
    class="flex flex-row flex-wrap gap-x-6 gap-y-8"
  )
    div(
      v-for="user in listStore.displayData"
      :key="user.uid"
      class="relative inline-block w-40 h-60 bg-substrate p-4 overflow-hidden"
    )
      Avatar(:imageUrl="user.avatar")
      div(
        class="leading-tight overflow-hidden text-ellipsis line-clamp-[2] my-3 mx-auto"
        title="aaaa bbbb cccc ddd eeee ffff"
      ) {{ user.name }}
      div(class="block w-6 h-6 absolute right-4 bottom-4 cursor-pointer")
        HeartFill(
          v-if="user.isFavorite"
          class="fill-[#4b5c6b]"
        )
        HeartEmpty(
          v-else
          class="fill-[#4b5c6b]"
        )
  Loading(
    :loading="listLoading"
    loadingText="Data Loading ..."
  )

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Loading from '@/components/Loading.vue'
import Avatar from '@/components/Avatar.vue'
import HeartFill from '@/components/icons/HeartFill.vue'
import HeartEmpty from '../icons/HeartEmpty.vue'
import { useStore as useUIStore } from '@/stores/ui'
import { useStore as useListStore } from '@/stores/list'

const uiStore = useUIStore()
const listStore = useListStore()
const { loading: listLoading } = storeToRefs(listStore)

</script>