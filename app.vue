<script setup lang="ts">
const route = useRoute()
const siteUrl = 'https://paroki-melania-dev.my.id'

useHead({
  link: computed(() => [
    { rel: 'canonical', href: `${siteUrl}${route.path}` },
  ]),
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
