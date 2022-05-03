<template lang="pug">
router-view
//- page loading animation
Loading(
  :loading="pageLoading"
  loadingText="Page loading ..."
)
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Loading from '@/components/Loading.vue';
import { useStore } from '@/stores/ui';

const uiStore = useStore()
const { pageLoading } = storeToRefs(uiStore)
</script>