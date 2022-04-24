<template lang="pug">
div(class="text-lg")
  //- node with children
  template(v-if="Object.keys(props.tree.children).length > 0")
    div(class="flex cursor-pointer")
      span(class="font-bold whitespace-nowrap") {{props.tree.key}}
      span(
        class="ml-1"
        @click.stop="toggle"
      ) [{{collapse === true ? '+' : '-'}}]
    div(
      class="pl-[1em]"
      v-show="collapse === false"
    )
      Node(v-for="node in Object.values(props.tree.children)" :tree="node")

  //- node without children
  template(v-else)
    div(class="inline")
      span(class="font-bold whitespace-nowrap") {{props.tree.key}}
    div(class="inline")
      span(class="ml-1") :
      span(class="ml-3 pr-6 text-rose-300 whitespace-nowrap") {{props.tree.value}}

</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Tree } from '@/types/share'
import Node from '@/components/Node.vue'

interface Props {
  tree: Tree;
}

const props = defineProps<Props>()

const collapse = ref(false)

function toggle () {
  collapse.value = !collapse.value
}

</script>
