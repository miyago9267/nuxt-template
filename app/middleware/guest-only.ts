import { useAuth } from '~/composables/app/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  if (import.meta.server) {
    return
  }

  if (!auth.isAuthenticated.value) {
    await auth.verify()
  }

  if (auth.isAuthenticated.value) {
    const redirect = typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/')
      ? to.query.redirect
      : '/'

    return navigateTo(redirect, { replace: true })
  }
})
