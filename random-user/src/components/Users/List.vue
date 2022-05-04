<template lang="pug">
div(class="flex flex-row h-full flex-shrink-1 flex-grow-0 overflow-x-clip overflow-y-auto")
  //- list loading error presentation
  template(v-if="listStore.hasError === true")
    h1(class=" text-2xl font-bold text-center m-auto") Encounter error, please retry later

  template(v-else)
    div(
      v-if="uiStore.getListFormat === 'list'"
      class="flex flex-col flex-grow gap-y-8"
    )
      //- list format
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
        FavoriteButton(:user="user")

    div(
      v-else
      class="flex flex-row flex-wrap gap-x-6 gap-y-8"
    )
      //- card format
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
        FavoriteButton(:user="user")

  //- list data loading animation
  Loading(
    :loading="listLoading"
    loadingText="Data Loading ..."
  )

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Loading from '@/components/Loading.vue'
import Avatar from '@/components/Avatar.vue'
import FavoriteButton from '@/components/Users/FavoriteButton.vue'
import { useStore as useUIStore } from '@/stores/ui'
import { useStore as useListStore } from '@/stores/list'

const uiStore = useUIStore()
const listStore = useListStore()
listStore.initialize()
const { loading: listLoading } = storeToRefs(listStore)

</script>