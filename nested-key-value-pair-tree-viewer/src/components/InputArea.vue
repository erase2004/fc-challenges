<template lang="pug">
div(class="w-full h-1/2 lg:w-1/2 lg:h-full border border-primary-500 overflow-hidden flex flex-col")
  //- add input group button
  div(class="flex justify-end p-3")
    button(class="bg-slate-200 text-slate-800 p-2 font-bold" @click.stop="addInputGroup") &#xff0b;Add New Pair
  //- input group list
  div(class="flex flex-col overflow-y-auto overflow-x-clip")
    //- input group
    div(
      class="px-5 py-2 flex"
      v-for="index in groupList"
      :key="index"
    )
      div(class="grid grid-cols-2 gap-4 flex-grow mr-3")
        //- key input
        input(
          class="bg-transparent outline-none border text-slate-200 border-slate-500 text-base px-2 py-1 w-full"
          placeholder="Key"
          v-model.lazy="keyInput[index]"
        )
        //- value input
        input(
          class="bg-transparent outline-none border text-slate-200 border-slate-500 text-base px-2 py-1 w-full"
          placeholder="Value"
          v-model.lazy="valueInput[index]"
        )
      //- remove input group button
      button(
        class="w-10 text-sm flex justify-center items-center bg-slate-300 text-slate-800"
        @click.stop="removeInputGroup(index)"
      ) &#xff0d;

Teleport(v-if="props.mounted" to="#display-area")
  TreeView(:tree="tree")
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRef } from 'vue'
import type { Tree } from '@/types/share'
import TreeView from '@/components/TreeView.vue'

interface Data {
  key: string;
  value: string;
}
interface MapData {
  [key: string]: string;
}
interface Props {
  mounted: boolean;
}

const props = defineProps<Props>()
const mounted = toRef(props, 'mounted')

const defaultData: Data[] = [
  {
    key: 'nav.header.creator',
    value: '3D Fabric Creator'
  },
  {
    key: 'nav.icon',
    value: 'Icon name'
  },
  {
    key: 'nav.header.product',
    value: 'Product'
  },
  {
    key: 'common.feature.experience',
    value: 'Try It Now!'
  },
  {
    key: 'common.feature.chooseFabric',
    value: 'Choose Fabric'
  },
  {
    key: '',
    value: ''
  }
]

const KEY_SEPERATOR = '.'

const inputGroupIndex = ref<number>(0)
const groupList = reactive<string[]>([])
const keyInput = reactive<MapData>({})
const valueInput = reactive<MapData>({})
const tree: Tree = reactive({
  key: '',
  value: '',
  children: {}
})

for (const index in defaultData) {
  const data = defaultData[index]
  const indexString = index.toString()

  groupList.push(indexString)
  keyInput[indexString] = data.key
  valueInput[indexString] = data.value

  inputGroupIndex.value += 1
}

function checkKey (key: string, seperator: string): [boolean, string[]] {
  let isValid: boolean = true
  const token = key.split(seperator)

  for (const t of token) {
    if (t === '') {
      isValid = false
      break
    }
  }

  return [isValid, token]
}

function addTreeNode (tree: Tree, keyArray: string[], value: string, level: number): void {
  if (level >= keyArray.length) return

  const key = keyArray[level]
  const reachEnd = level + 1 === keyArray.length
  let node: Tree = {
    key,
    value: reachEnd ? value : '',
    children: {}
  }

  if (tree.children[key] === undefined) {
    tree.value = ''
    tree.children[key] = node
  } else {
    if (reachEnd === false) {
      node = tree.children[key]
    } else {
      tree.value = ''
      tree.children[key] = node
    }
  }

  return addTreeNode(node, keyArray, value, level + 1)
}

function addInputGroup () {
  inputGroupIndex.value += 1

  const indexString = inputGroupIndex.value.toString()
  groupList.push(indexString)
  keyInput[indexString] = ''
  valueInput[indexString] = ''
}

function removeInputGroup (index: string) {
  groupList.splice(groupList.indexOf(index), 1)
  keyInput[index] = ''
  valueInput[index] = ''
  delete keyInput[index]
  delete valueInput[index]
}

async function dataChangeHandle () {
  tree.key = ''
  tree.value = ''
  tree.children = {}

  for (const index of groupList) {
    const key = keyInput[index]
    const value = valueInput[index]
    const [isValidKey, keyArray] = checkKey(key, KEY_SEPERATOR)

    if (isValidKey === false) {
      continue
    } else {
      addTreeNode(tree, keyArray, value, 0)
    }
  }
}

watch(keyInput, dataChangeHandle, { deep: true })
watch(valueInput, dataChangeHandle, { deep: true })
watch(mounted, dataChangeHandle)

</script>
