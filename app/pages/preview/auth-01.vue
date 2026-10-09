<script setup lang="ts">
import type { AuthMode, AuthPayload } from '@/components/blocks/auth-01'
import { Auth01 } from '@/components/blocks/auth-01'

const route = useRoute()

useHead({
  title: 'auth-01',
  htmlAttrs: { class: route.query.theme === 'dark' ? 'dark' : '' },
})

const mode = computed<AuthMode>(() => route.query.mode === 'sign-up' ? 'sign-up' : 'sign-in')
const switchHref = computed(() => mode.value === 'sign-in' ? '?mode=sign-up' : '?mode=sign-in')

const pending = ref(false)
const error = ref<string>()
const lastPayload = ref<AuthPayload>()

// Demo only: fake a request that always fails, to show pending and error states.
async function onSubmit(payload: AuthPayload) {
  lastPayload.value = payload
  error.value = undefined
  pending.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  pending.value = false
  error.value = payload.mode === 'sign-in'
    ? 'Incorrect email or password.'
    : 'An account with this email already exists.'
}
</script>

<template>
  <main class="min-h-dvh">
    <Auth01
      :key="mode"
      :mode="mode"
      :switch-href="switchHref"
      forgot-password-href="#reset"
      :providers="[
        { id: 'google', label: 'Continue with Google' },
        { id: 'github', label: 'Continue with GitHub' },
      ]"
      :pending="pending"
      :error="error"
      @submit="onSubmit"
    />
    <pre v-if="lastPayload" data-testid="payload" class="sr-only">{{ JSON.stringify({ ...lastPayload, password: '***' }) }}</pre>
  </main>
</template>
