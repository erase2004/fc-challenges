<template lang="pug">
router-view
//- page loading animation
Loading(
  :loading="pageLoading"
  loadingText="Page loading ..."
)
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { auth } from '@/utils/firebase'
import { onAuthStateChanged } from '@firebase/auth'
import Loading from '@/components/Loading.vue'
import { useStore as useUIStore } from '@/stores/ui'
import { useStore as useUserStore } from '@/stores/user'

// Store initialize progress
const uiStore = useUIStore()
uiStore.initialize()

const { pageLoading } = storeToRefs(uiStore)

const userStore = useUserStore()
userStore.update()

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // login

    await userStore.updateById(user.email)
  } else {
    // logout

    userStore.reset()
  }
})
</script>