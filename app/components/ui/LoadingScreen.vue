<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-300"
    >
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <component
            :is="SpinnerIcon"
            class="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin"
          />
        </div>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useLoading } from '~/composables/app/useLoading'
import { SpinnerIcon } from '~/composables/shared/icons'

const { isLoading } = useLoading()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
