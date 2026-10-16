<script setup lang="ts">
import type { NotificationSetting, ProfileFieldErrors, ProfileValues, SettingsPayload } from '@/components/blocks/settings-01'
import { Settings01 } from '@/components/blocks/settings-01'

const route = useRoute()

useHead({
  title: 'settings-01',
  htmlAttrs: { class: route.query.theme === 'dark' ? 'dark' : '' },
})

const profile = ref<ProfileValues>({ name: 'Ann Lee', email: 'ann@example.com' })
const notifications = ref<NotificationSetting[]>([
  { id: 'invoice-paid', label: 'Invoice paid', description: 'When a client pays an invoice.', enabled: true },
  { id: 'invoice-overdue', label: 'Invoice overdue', description: 'The day after an invoice is due.', enabled: true },
  { id: 'product-news', label: 'Product news', description: 'Occasional emails about new features.', enabled: false },
])

const pending = ref(false)
const saved = ref(false)
const errors = ref<ProfileFieldErrors>({})

// Demo only: a fake request. An email containing "taken" fails on the email field.
async function onSave(payload: SettingsPayload) {
  errors.value = {}
  saved.value = false
  pending.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  pending.value = false
  if (payload.profile.email.includes('taken')) {
    errors.value = { email: 'This email is already used by another account.' }
    return
  }
  profile.value = payload.profile
  notifications.value = notifications.value.map(n => ({ ...n, enabled: payload.notifications[n.id] ?? n.enabled }))
  saved.value = true
}
</script>

<template>
  <main class="min-h-dvh">
    <Settings01
      :profile="profile"
      :notifications="notifications"
      :errors="errors"
      :pending="pending"
      :saved="saved"
      @save="onSave"
    />
  </main>
</template>
