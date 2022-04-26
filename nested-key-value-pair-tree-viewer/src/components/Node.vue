<template lang="pug">
div(class="text-lg")
  //- node with children
  template(v-if="Object.keys(props.tree.children).length > 0")
    div(
      class="flex cursor-pointer"
      @click.stop="toggle"
    )
      span(class="mr-1") [{{collapse === true ? '+' : '-'}}]
      span(class="font-bold whitespace-nowrap") {{props.tree.key}}
    div(
      class="pl-[1.5em]"
      v-show="collapse === false"
    )
      Node(
        v-for="node in Object.values(props.tree.children)"
        :tree="node"
        :key="node.key"
      )

  //- node without children
  template(v-else)
    div(class="inline select-none")
      span(class="font-bold whitespace-nowrap") {{props.tree.key}}
    div(class="inline select-none")
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
