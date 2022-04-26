<template lang="pug">
div(
  class="flex flex-col h-full text-slate-200 p-6 overflow-x-auto overflow-y-auto"
  v-if="Object.keys(props.tree).length > 0"
)
  Node(
    v-for="node in Object.values(props.tree.children)"
    :tree="node"
    :key="node.key"
  )
</template>

<script setup lang="ts">
import type { Tree } from '@/types/share'
import Node from '@/components/Node.vue'

interface Props {
  tree: Tree;
}

const props = defineProps<Props>()

</script>
