<template>
  <div>
    <LoadingScreen />

    <div
      v-if="isInitializing"
      class="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50 transition-all duration-500"
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

    <div v-show="!isInitializing">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

    <Toast />
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDarkMode } from '~/composables/ui/useDarkMode'
import { useAuth } from '~/composables/app/useAuth'
import { useLoading } from '~/composables/app/useLoading'
import { SpinnerIcon } from '~/composables/shared/icons'
import LoadingScreen from '~/components/ui/LoadingScreen.vue'
import Toast from '~/components/ui/Toast.vue'
import BackToTop from '~/components/ui/BackToTop.vue'

const { initDarkMode } = useDarkMode()
const { stopLoading } = useLoading()
const router = useRouter()
const route = useRoute()
const auth = useAuth()

const isInitializing = ref(true)

const PUBLIC_PATHS = new Set(['/login', '/auth/google-bind'])

onMounted(async () => {
  initDarkMode()
  const requiresAuth = route.path !== '/login' && !PUBLIC_PATHS.has(route.path)

  try {
    const isValid = await auth.verify()

    // 如果是登入頁面，檢查是否已登入
    if (route.path === '/login') {
      if (isValid) {
        await router.push('/')
      }
      return
    }

    if (requiresAuth && !isValid) {
      // 其他受保護頁面，驗證登入狀態
      await router.push('/login')
    }
  }
  catch (error) {
    console.error('[App] Failed to verify session:', error)
    if (requiresAuth) {
      // 其他受保護頁面驗證失敗，重定向到登入頁
      await router.push('/login')
    }
  }
  finally {
    isInitializing.value = false
    stopLoading()
  }
})
</script>

<style>
/* Global box-sizing reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Input elements should inherit box-sizing */
input,
textarea,
select,
button {
  box-sizing: border-box;
}

body,
html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background: #f9fafb;
}
</style>
