<script setup lang="ts">
import { Hero01 } from '@/components/blocks/hero-01'

const route = useRoute()

useHead({
  title: 'hero-01',
  htmlAttrs: { class: route.query.theme === 'dark' ? 'dark' : '' },
})
</script>

<template>
  <main class="min-h-dvh">
    <Hero01
      title="Invoices your clients actually pay on time"
      description="Send branded invoices, collect card and bank payments, and get reminded before anything is overdue."
      :primary-action="{ label: 'Start free trial', href: '#signup' }"
      :secondary-action="{ label: 'See how it works', href: '#demo' }"
      :announcement="{ label: 'New: recurring invoices for retainers', href: '#changelog' }"
      note="14-day trial. No credit card required."
    />
  </main>
</template>
