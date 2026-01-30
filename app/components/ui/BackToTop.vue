<template>
  <Transition name="fade-slide">
    <button
      v-if="isVisible"
      class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      aria-label="回到頂部"
      title="回到頂部"
      @click="scrollToTop"
    >
      <component
        :is="ChevronUpIcon"
        class="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
      />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronUpIcon } from '~/composables/shared/icons'

const isVisible = ref(false)
const scrollThreshold = 300
const mainElement = ref<HTMLElement | null>(null)

const handleScroll = () => {
  if (import.meta.client) {
    if (!mainElement.value) {
      mainElement.value = document.querySelector('main')
    }
    if (mainElement.value) {
      const scrollTop = mainElement.value.scrollTop
      isVisible.value = scrollTop > scrollThreshold
    }
    else {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      isVisible.value = scrollTop > scrollThreshold
    }
  }
}

const scrollToTop = () => {
  if (import.meta.client) {
    if (!mainElement.value) {
      mainElement.value = document.querySelector('main')
    }

    if (mainElement.value) {
      mainElement.value.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
    else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }
}

onMounted(() => {
  if (import.meta.client) {
    mainElement.value = document.querySelector('main')
    if (mainElement.value) {
      mainElement.value.addEventListener('scroll', handleScroll)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    if (mainElement.value) {
      mainElement.value.removeEventListener('scroll', handleScroll)
    }
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
