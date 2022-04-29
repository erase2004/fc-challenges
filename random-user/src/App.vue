<template lang="pug">
router-view
</template>

<script setup lang="ts">
import storage from '@/utils/storage';
import { useStore as useUIStore } from '@/stores/ui';

const uiStore = useUIStore()
uiStore.$subscribe((mutation, state) => {
  storage.set('tab', state.tab)
  storage.set('listFormat', state.listFormat)
  storage.set('pageSize', state.pageSize)
})

</script>