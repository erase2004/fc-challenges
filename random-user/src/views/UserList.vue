<template lang="pug">
div(class="flex flex-col h-full w-full")
  Header
  div(class="flex flex-col flex-grow px-4 overflow-hidden")
    Control
    List
    Pagination


</template>

<script setup lang="ts">
import Header from '@/components/Users/Header.vue'
import Control from '@/components/Users/Control.vue'
import List from '@/components/Users/List.vue'
import Pagination from '@/components/Users/Pagination.vue'


</script>