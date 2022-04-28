<template lang="pug">
div(class="inline-block m-auto p-10 self-center bg-[#dfe6ed]")
  div(class="flex flex-col gap-y-6 ")
    input(
      class="text-input"
      placeholder="Email"
      name="email"
      type="email"
    )
    input(
      class="text-input"
      placeholder="Password"
      name="password"
      type="password"
    )
    div(class="flex flex-row justify-between")
      span(class="action-text-primary") Register
      button(class="action-button-primary") Login
</template>

<script setup lang="ts">

</script>