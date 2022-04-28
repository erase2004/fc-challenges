<template lang="pug">
div(class="inline-block m-auto p-10 self-center bg-substrate")
  div(class="flex flex-col gap-y-6 ")
    Avatar(
      :imageUrl="imageUrl"
      class="self-center"
    )
    input(
      class="text-input"
      placeholder="Email"
      name="email"
      type="email"
    )
    input(
      class="text-input"
      placeholder="Name"
      name="name"
      type="text"
    )
    input(
      v-model="imageUrl"
      class="text-input"
      placeholder="Avatar Image URL"
      name="avatar"
      type="text"
    )
    input(
      class="text-input"
      placeholder="Password"
      name="password"
      type="password"
    )
    div(class="flex flex-row justify-between")
      span(class="action-text-primary") Login
      button(class="action-button-primary") Register
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import { ref } from 'vue'

const imageUrl = ref<string>('')
</script>