<template lang="pug">
div(class="flex flex-row flex-shrink-0 flex-nowrap justify-center gap-1")
  template(v-if="displayList.length > 0")
    //- more than length of display pages
    template(v-if="totalPage > displayLength")
      span(
        class="control-item"
        :class="{'disabled': reachEnd(current, 1)}"
        @click.stop="prev"
      ) &lt;

      template(v-for="page in displayList" :key="page")
        span(
          v-if="isValid(page)"
          class="page-item"
          :class="{'active': page === current}"
        ) {{ page }}
        span(
          v-else
          class="item"
        ) ...

      span(
        class="control-item"
        :class="{'disabled': reachEnd(current, totalPage)}"
        @click.stop="next"
      ) &gt;
    //- less than or equal to length of display pages, but more than minimum of control appear requirements
    template(v-else-if="totalPage > controlDisplayMin")
      span(
        class="control-item"
        :class="{'disabled': reachEnd(current, 1)}"
        @click.stop="prev"
      ) &lt;

      span(
        v-for="page in displayList"
        :key="page"
        class="page-item"
        :class="{'active': page === current}"
      ) {{ page }}

      span(
        class="control-item"
        :class="{'disabled': reachEnd(current, totalPage)}"
        @click.stop="next"
      ) &gt;
    //- only one page
    template(v-else)
      span(
        v-for="page in displayList"
        :key="page"
        class="page-item"
        :class="{'active': page === current}"
      ) {{ page }}
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const controlDisplayMin = 1
const displayLength = 7

// const totalPage = ref<number>(3)
// const totalPage = ref<number>(6)
const totalPage = ref<number>(7)
// const totalPage = ref<number>(8)
// const totalPage = ref<number>(12)

const current = ref<number>(1)

const displayList = computed(() => {
  let pageList: number[] = []

  if (totalPage.value <= displayLength) {
    for (let n = 1; n <= totalPage.value; n += 1) {
      pageList.push(n)
    }
  } else {
    //- create a array [current.value - x, ..., current.value, ..., current.value + y]
    //- where y - x = displayLength - 2 (left leftmost and rightmost for 1 and totalPage)
    const left = current.value - (Math.ceil((displayLength - 1) / 2) - 1)
    const right = current.value + (Math.floor((displayLength - 1) / 2) - 1)

    for (let n = left; n <= right; n += 1) {
      pageList.push(n)
    }

    //- shift whole array right, keep start of array greater than 1
    if (pageList[0] <= 1) {
      let diff = 1 - pageList[0] + 1

      pageList = pageList.map(n => n + diff)
    }

    //- shift whole array left, keep end of array less than totalPage
    if (pageList[pageList.length - 1] >= totalPage.value) {
      let diff = totalPage.value - pageList[pageList.length - 1] - 1

      pageList = pageList.map(n => n + diff)
    }

    //- -1 is use to represent '...'
    if (pageList[0] > 2) {
      pageList[0] = -1
    }
    if (pageList[0] !== 1) {
      pageList.unshift(1)
    }

    if (pageList[pageList.length - 1] < totalPage.value - 1) {
      pageList[pageList.length - 1] = -1
    }
    if (pageList[pageList.length - 1] !== totalPage.value) {
      pageList.push(totalPage.value)
    }
  }

  return pageList
})

function isValid(page: number) {
  return page !== -1
}

function reachEnd(page: number, boundary: number) {
  return page == boundary
}

function prev() {
  if (current.value <= 1) {
    return
  }
  current.value -= 1
}

function next() {
  if (current.value >= totalPage.value) {
    return
  }
  current.value += 1
}
</script>

<style lang="postcss">
.item {
  @apply inline-block w-8 h-8 font-bold text-center leading-8 bg-substrate;
}
.page-item, .control-item {
  @apply item cursor-pointer;
}
.page-item.active {
  @apply bg-[#8dd7cf];
}
.control-item.disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>