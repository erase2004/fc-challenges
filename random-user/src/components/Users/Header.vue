<template lang="pug">
div(class="flex flex-row flex-shrink-0 bg-[#c3cfd9] justify-between items-center px-4")
  span(
    class="font-bold flex-shrink-1 whitespace-nowrap overflow-y-clip overflow-x-auto"
  ) Hi, {{ userStore.name }}
  span(
    class="action-text-primary flex-shrink-0"
    :disabled="isProcessing"
    @click.stop="handleLogout"
  ) Logout
</template>

<script setup lang="ts">
import authService from '@/services/auth'
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/user'

const router = useRouter()
const isProcessing = ref<boolean>(false)
const userStore = useStore()

async function handleLogout() {
  if (isProcessing.value === true) {
    return
  }

  isProcessing.value = true

  try {
    await authService.signOut()

    router.push({'name': 'login'})

} catch (error) {
    console.error(error)

  } finally {
    isProcessing.value = false
  }
}
</script>