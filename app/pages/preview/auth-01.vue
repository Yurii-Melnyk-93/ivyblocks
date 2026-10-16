<script setup lang="ts">
import type { AuthFieldErrors, AuthMode, AuthPayload } from '@/components/blocks/auth-01'
import { Auth01 } from '@/components/blocks/auth-01'

const route = usePreviewPage('auth-01')

const mode = computed<AuthMode>(() => route.query.mode === 'sign-up' ? 'sign-up' : 'sign-in')
const switchHref = computed(() => mode.value === 'sign-in' ? '?mode=sign-up' : '?mode=sign-in')

const pending = ref(false)
const error = ref<string>()
const errors = ref<AuthFieldErrors>({})
const lastPayload = ref<AuthPayload>()

// Demo only: a fake request that always fails. Sign-in shows a form-level
// error (email and password highlighted); sign-up shows an email field error.
async function onSubmit(payload: AuthPayload) {
  lastPayload.value = payload
  error.value = undefined
  errors.value = {}
  pending.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  pending.value = false
  if (payload.mode === 'sign-in')
    error.value = 'Incorrect email or password.'
  else
    errors.value = { email: 'An account with this email already exists.' }
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
      :errors="errors"
      @submit="onSubmit"
    />
    <pre v-if="lastPayload" data-testid="payload" class="sr-only">{{ JSON.stringify({ ...lastPayload, password: '***' }) }}</pre>
  </main>
</template>
