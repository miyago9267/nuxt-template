<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
    <div class="text-sm text-gray-600 dark:text-gray-400">
      顯示第 <span class="font-semibold text-gray-900 dark:text-gray-100">{{ start }}</span> 到
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ end }}</span> 筆，共
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ total }}</span> 筆資料
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">每頁顯示：</span>
        <span class="text-sm text-gray-600 dark:text-gray-400 sm:hidden">每頁：</span>
        <div class="w-20">
          <CustomSelect
            :model-value="limit"
            :options="[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
            ]"
            size="sm"
            @update:model-value="(value) => handleLimitChange(Number(value))"
          />
        </div>
      </div>

      <div class="flex items-center gap-1 flex-wrap justify-center sm:justify-start">
        <button
          :disabled="currentPage === 1"
          class="px-2 sm:px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/60 dark:border-gray-700/30 shadow-sm text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="第一頁"
          @click="goToPage(1)"
        >
          <span class="hidden sm:inline">首頁</span>
          <span class="sm:hidden">首</span>
        </button>
        <button
          :disabled="currentPage === 1"
          class="px-2 sm:px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/60 dark:border-gray-700/30 shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="上一頁"
          @click="goToPage(currentPage - 1)"
        >
          <component :is="ChevronLeftIcon" />
        </button>

        <template
          v-for="page in visiblePages"
          :key="page"
        >
          <button
            v-if="page !== '...'"
            :class="`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              page === currentPage
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/60 dark:border-gray-700/30 shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`"
            @click="goToPage(page as number)"
          >
            {{ page }}
          </button>
          <span
            v-else
            class="px-1 sm:px-2 text-gray-400 dark:text-gray-500 text-xs sm:text-sm"
          >
            ...
          </span>
        </template>

        <button
          :disabled="currentPage === totalPages"
          class="px-2 sm:px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/60 dark:border-gray-700/30 shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="下一頁"
          @click="goToPage(currentPage + 1)"
        >
          <component :is="ChevronRightIcon" />
        </button>
        <button
          :disabled="currentPage === totalPages"
          class="px-2 sm:px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/60 dark:border-gray-700/30 shadow-sm text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="最後一頁"
          @click="goToPage(totalPages)"
        >
          <span class="hidden sm:inline">末頁</span>
          <span class="sm:hidden">末</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '~/composables/shared/icons'
import CustomSelect from '~/components/ui/CustomSelect.vue'

interface Props {
  currentPage: number
  limit: number
  total: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:limit': [limit: number]
}>()

const totalPages = computed(() => {
  if (props.total === 0) return 1
  return Math.ceil(props.total / props.limit)
})

const start = computed(() => {
  if (props.total === 0) return 0
  return (props.currentPage - 1) * props.limit + 1
})

const end = computed(() => {
  if (props.total === 0) return 0
  const endValue = props.currentPage * props.limit
  return endValue > props.total ? props.total : endValue
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 1) {
    return [1]
  }

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  }
  else {
    pages.push(1)
    if (current <= 3) {
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
    else if (current >= total - 2) {
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    }
    else {
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const goToPage = (page: number) => {
  const total = totalPages.value
  if (page >= 1 && page <= total && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}

const handleLimitChange = (newLimit: number) => {
  emit('update:limit', newLimit)
  emit('update:currentPage', 1)
}
</script>
