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
      UserList(
        v-for="user in listStore.displayData"
        :user="user"
        :key="user.uid"
      )

    div(
      v-else
      class="flex flex-row flex-wrap gap-x-6 gap-y-8"
    )
      //- card format
      UserCard(
        v-for="user in listStore.displayData"
        :user="user"
        :key="user.uid"
      )

  //- list data loading animation
  Loading(
    :loading="listLoading"
    loadingText="Data Loading ..."
  )

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Loading from '@/components/Loading.vue'
import UserList from '@/components/Users/UserList.vue'
import UserCard from '@/components/Users/UserCard.vue'
import { useStore as useUIStore } from '@/stores/ui'
import { useStore as useListStore } from '@/stores/list'

const uiStore = useUIStore()
const listStore = useListStore()
listStore.initialize()
const { loading: listLoading } = storeToRefs(listStore)

</script>