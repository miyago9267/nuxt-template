<template>
  <ColorScheme
    tag="div"
    placeholder=" "
    class="min-h-screen"
  >
    <NuxtLoadingIndicator />
    <NuxtPage />
  </ColorScheme>
</template>

<script setup lang="ts">
import '~/assets/css/theme.css'

useSeoMeta({
  title: 'Nuxt 4 Template',
})

const colorMode = useColorMode()

onMounted(() => {
  colorMode.preference = 'dark'
})
</script>

<style>
html,
body {
  padding: unset !important;
  margin: unset !important;
  background-color: var(--bg-default);
  color: var(--font-default);
  font-family: "Noto Sans TC", sans-serif;
}
</style>
