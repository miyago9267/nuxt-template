<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-all duration-500 relative">
    <div class="fixed top-6 right-6 z-20">
      <ColorModeToggle />
    </div>

    <div class="w-full max-w-md relative z-10">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Login
          </h1>
        </div>

        <form
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <div class="flex items-center justify-center mb-4">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              @click="handleGoogleSignIn"
            >
              使用 Google 登入
            </button>
          </div>
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              帳號
            </label>
            <input
              id="username"
              v-model.trim="account"
              type="text"
              inputmode="text"
              autocomplete="username"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="請輸入帳號"
            >
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              密碼
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="passwordFieldType"
                autocomplete="current-password"
                required
                class="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                placeholder="請輸入密碼"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="切換密碼顯示"
                @click="togglePassword"
              >
                <component :is="showPassword ? EyeOffIcon : EyeIcon" />
              </button>
            </div>
          </div>
          <div v-if="shouldShowTotpField">
            <div class="flex items-center justify-between">
              <label
                for="totp"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                二階段驗證碼
              </label>
              <button
                v-if="needsTotp"
                type="button"
                class="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                @click="resetTotpFlow"
              >
                切換帳號
              </button>
            </div>
            <div class="relative">
              <input
                id="totp"
                v-model="totpCode"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                autocomplete="one-time-code"
                class="w-full px-4 py-2 pr-16 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white tracking-[0.4em] text-lg"
                placeholder="123456"
              >
              <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                6 位數
              </span>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ needsTotp ? '此帳號已啟用 2FA，請輸入驗證器顯示的 6 位數字' : '若帳號啟用 2FA，可直接輸入驗證碼完成一次提交' }}
            </p>
          </div>
          <button
            v-else
            type="button"
            class="w-full rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
            @click="openTotpField"
          >
            已啟用 2FA？輸入 6 位數驗證碼
          </button>
          <div class="flex items-center">
            <label
              for="remember"
              class="flex items-center cursor-pointer group"
            >
              <div class="relative">
                <input
                  id="remember"
                  v-model="remember"
                  type="checkbox"
                  class="sr-only"
                >
                <div
                  class="w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center"
                  :class="remember
                    ? 'bg-primary-500 border-transparent dark:bg-gray-600 dark:border-gray-600'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-primary-400 dark:group-hover:border-gray-500'"
                >
                  <component
                    :is="CheckIcon"
                    v-if="remember"
                    class="w-3.5 h-3.5 text-white dark:text-gray-200"
                  />
                </div>
              </div>
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                記住我
              </span>
            </label>
          </div>
          <button
            type="submit"
            :disabled="!canSubmit"
            class="w-full cursor-pointer rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 py-3 px-4 text-lg font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="isSubmitting"
              class="inline-flex h-4 w-4 items-center justify-center"
            >
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            </span>
            <span>{{ isSubmitting ? '登入中...' : '登入' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { EyeIcon, EyeOffIcon, CheckIcon } from '~/composables/shared/icons'
import { useAuth } from '~/composables/app/useAuth'
import { useToast } from '~/composables/ui/useToast'
import ColorModeToggle from '~/components/ui/ColorModeToggle.vue'
import type { FetchErrorLike } from '~/types/auth'

definePageMeta({
  layout: false,
  middleware: 'guest-only' as any,
})

useSeoMeta({
  title: '登入 | RiceCall Admin',
})

const route = useRoute()
const auth = useAuth()

const { showToast } = useToast()

const account = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const totpCode = ref('')
const needsTotp = ref(false)
const totpFieldVisible = ref(false)
const sanitizeTotpInput = (value: string) => value.replace(/[^0-9]/g, '').slice(0, 6)
const shouldShowTotpField = computed(() => totpFieldVisible.value || needsTotp.value)

const openTotpField = () => {
  totpFieldVisible.value = true
}

const resetTotpFlow = () => {
  needsTotp.value = false
  totpFieldVisible.value = false
  totpCode.value = ''
}

const accountPrefill = computed(() => {
  if (typeof route.query.account === 'string') return route.query.account
  return ''
})

watch(
  () => accountPrefill.value,
  (value) => {
    if (value && !account.value) {
      account.value = value
    }
  },
  { immediate: true },
)

watch(needsTotp, (value) => {
  if (value) {
    totpFieldVisible.value = true
  }
})

watch(totpCode, (value) => {
  const sanitized = sanitizeTotpInput(value)
  if (sanitized !== value) {
    totpCode.value = sanitized
  }
})

watch(account, (newValue, oldValue) => {
  if (!needsTotp.value || oldValue === undefined) {
    return
  }
  if (newValue.trim() !== oldValue.trim()) {
    resetTotpFlow()
  }
})

const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'))
const isSubmitting = computed(() => auth.loading.value)
const totpRequirementMet = computed(() => !needsTotp.value || totpCode.value.length === 6)

const canSubmit = computed(() => {
  return Boolean(account.value.trim()) && Boolean(password.value) && !isSubmitting.value && totpRequirementMet.value
})

watch([account, password, totpCode], () => {
  auth.clearError()
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const redirectTarget = computed(() => {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) return redirect
  return '/'
})

const extractTotpReason = (error: unknown): string | undefined => {
  const fetchError = error as FetchErrorLike | undefined
  const payload = fetchError?.data
  if (!payload) return undefined
  if (typeof payload.reason === 'string') {
    return payload.reason
  }
  const nested = payload.data
  if (nested && typeof nested === 'object') {
    const reason = (nested as Record<string, unknown>).reason
    if (typeof reason === 'string') {
      return reason
    }
  }
  return undefined
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  try {
    await auth.login({
      account: account.value.trim(),
      password: password.value,
      totp: totpCode.value || undefined,
    })
    await navigateTo(redirectTarget.value, { replace: true })
  }
  catch (error: unknown) {
    const totpReason = extractTotpReason(error)

    if (totpReason === 'account_inactive') {
      showToast('登入失敗，帳號尚未開通，請等待管理員開通', 'error')
      return
    }

    if ((error as { statusCode?: number } | undefined)?.statusCode === 403) {
      showToast('權限不足，無法登入', 'error')
      return
    }

    if (totpReason === 'totp_required') {
      needsTotp.value = true
      totpFieldVisible.value = true
      showToast('此帳號已啟用二階段驗證，請輸入驗證碼', 'warning')
      return
    }

    if (totpReason === 'totp_invalid') {
      needsTotp.value = true
      totpFieldVisible.value = true
      totpCode.value = ''
      showToast('驗證碼錯誤，請再試一次', 'error')
      return
    }

    showToast(auth.error.value || '登入失敗，請稍後再試', 'error')
  }
}

const handleGoogleSignIn = () => {
  const redirect = redirectTarget.value || '/'
  window.location.href = `/api/auth/google/start?redirect=${encodeURIComponent(redirect)}`
}

onMounted(async () => {
  if (auth.isAuthenticated.value) {
    await navigateTo(redirectTarget.value, { replace: true })
  }
})
</script>
