<script setup lang="ts">
useHead({ title: 'Ivyblocks' })

const blocks = [
  { name: 'pricing-01', title: 'Pricing' },
  { name: 'hero-01', title: 'Hero' },
  { name: 'auth-01', title: 'Sign in and sign up' },
  { name: 'settings-01', title: 'Settings' },
  { name: 'dashboard-shell-01', title: 'Dashboard shell' },
]
</script>

<template>
  <main class="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
    <h1 class="text-2xl font-semibold tracking-tight">
      Ivyblocks
    </h1>
    <p class="mt-2 text-sm text-muted-foreground">
      shadcn-vue blocks for Nuxt and Vue.
    </p>
    <ul class="mt-8 divide-y border-y">
      <li v-for="block in blocks" :key="block.name" class="flex items-center justify-between gap-4 py-3 text-sm">
        <NuxtLink :to="`/preview/${block.name}`" class="font-medium underline-offset-4 hover:underline">
          {{ block.title }}
        </NuxtLink>
        <code class="text-muted-foreground">{{ block.name }}</code>
      </li>
    </ul>
  </main>
</template>
