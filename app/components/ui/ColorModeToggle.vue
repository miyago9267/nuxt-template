<template>
  <ClientOnly>
    <button
      class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-center"
      aria-label="切換深色/淺色模式"
      @click="toggleDarkMode"
    >
      <Icon
        :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
        class="w-5 h-5 sm:w-6 sm:h-6"
      />
    </button>
    <template #fallback>
      <div
        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center"
      >
        <div class="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDarkMode } from '~/composables/ui/useDarkMode'

const { isDark, toggleDarkMode, initDarkMode } = useDarkMode()

onMounted(() => {
  initDarkMode()
})
</script>
