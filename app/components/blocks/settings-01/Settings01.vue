<script setup lang="ts">
import type { NotificationSetting, ProfileField, ProfileFieldErrors, ProfileValues, SettingsCopy, SettingsPayload } from './types'
import { LoaderCircle } from '@lucide/vue'
import { computed, ref, useId, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const props = withDefaults(defineProps<{
  /** Saved values. The form edits a draft and resets to these when they change. */
  profile: ProfileValues
  notifications?: NotificationSetting[]
  /** Field errors: shown under that field, only that field is highlighted. */
  errors?: ProfileFieldErrors
  pending?: boolean
  /** Set after a successful save; the message hides as soon as the draft changes. */
  saved?: boolean
  copy?: Partial<SettingsCopy>
}>(), {
  notifications: () => [],
  errors: () => ({}),
  pending: false,
  saved: false,
  copy: () => ({}),
})

const emit = defineEmits<{
  save: [payload: SettingsPayload]
}>()

const defaults: SettingsCopy = {
  title: 'Settings',
  description: 'Manage your profile and how we contact you.',
  profileTitle: 'Profile',
  profileDescription: 'Your name appears on invoices and in emails to your team.',
  nameLabel: 'Name',
  emailLabel: 'Email',
  notificationsTitle: 'Notifications',
  notificationsDescription: 'Choose which emails you get. Security emails are always sent.',
  saveLabel: 'Save changes',
  pendingLabel: 'Saving',
  resetLabel: 'Discard',
  savedMessage: 'Changes saved.',
}

const t = computed<SettingsCopy>(() => ({ ...defaults, ...props.copy }))

function toRecord(list: NotificationSetting[]) {
  return Object.fromEntries(list.map(n => [n.id, n.enabled]))
}

const draftProfile = ref<ProfileValues>({ ...props.profile })
const draftNotifications = ref<Record<string, boolean>>(toRecord(props.notifications))

function reset() {
  draftProfile.value = { ...props.profile }
  draftNotifications.value = toRecord(props.notifications)
}

watch(() => [props.profile, props.notifications], reset, { deep: true })

const dirty = computed(() => {
  const p = draftProfile.value
  if (p.name !== props.profile.name || p.email !== props.profile.email)
    return true
  return props.notifications.some(n => draftNotifications.value[n.id] !== n.enabled)
})

const showSaved = computed(() => props.saved && !dirty.value)

const uid = useId()
const fieldId = (field: ProfileField) => `${uid}-${field}`
const errorId = (field: ProfileField) => `${uid}-${field}-error`

function onSubmit() {
  if (props.pending || !dirty.value)
    return
  emit('save', {
    profile: {
      name: draftProfile.value.name.trim(),
      email: draftProfile.value.email.trim(),
    },
    notifications: { ...draftNotifications.value },
  })
}
</script>

<template>
  <section class="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-16">
    <h1 class="text-2xl font-semibold tracking-tight">
      {{ t.title }}
    </h1>
    <p v-if="t.description" class="mt-2 text-sm text-muted-foreground">
      {{ t.description }}
    </p>

    <form class="mt-10 divide-y border-y" @submit.prevent="onSubmit">
      <div class="grid gap-6 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
        <div>
          <h2 class="font-medium">
            {{ t.profileTitle }}
          </h2>
          <p class="mt-1 text-sm text-muted-foreground text-pretty">
            {{ t.profileDescription }}
          </p>
        </div>

        <div class="grid max-w-md gap-4">
          <div v-for="field in (['name', 'email'] as const)" :key="field" class="grid gap-2">
            <Label :for="fieldId(field)">
              {{ field === 'name' ? t.nameLabel : t.emailLabel }}
            </Label>
            <Input
              :id="fieldId(field)"
              v-model="draftProfile[field]"
              :name="field"
              :type="field === 'email' ? 'email' : 'text'"
              :autocomplete="field"
              required
              :aria-invalid="errors[field] ? true : undefined"
              :aria-describedby="errors[field] ? errorId(field) : undefined"
            />
            <p v-if="errors[field]" :id="errorId(field)" role="alert" class="text-sm text-destructive">
              {{ errors[field] }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="notifications.length"
        class="grid gap-6 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10"
      >
        <div>
          <h2 class="font-medium">
            {{ t.notificationsTitle }}
          </h2>
          <p class="mt-1 text-sm text-muted-foreground text-pretty">
            {{ t.notificationsDescription }}
          </p>
        </div>

        <ul class="grid gap-5">
          <li v-for="n in notifications" :key="n.id" class="flex items-start justify-between gap-6">
            <div>
              <Label :for="`${uid}-n-${n.id}`" class="cursor-pointer">{{ n.label }}</Label>
              <p v-if="n.description" :id="`${uid}-n-${n.id}-desc`" class="mt-1 text-sm text-muted-foreground">
                {{ n.description }}
              </p>
            </div>
            <Switch
              :id="`${uid}-n-${n.id}`"
              :model-value="draftNotifications[n.id]"
              :aria-describedby="n.description ? `${uid}-n-${n.id}-desc` : undefined"
              class="mt-0.5"
              @update:model-value="(v: boolean) => { draftNotifications[n.id] = v }"
            />
          </li>
        </ul>
      </div>

      <div class="flex flex-col-reverse gap-3 py-6 sm:flex-row sm:items-center sm:justify-end">
        <p v-if="showSaved" role="status" class="text-sm text-muted-foreground sm:mr-auto">
          {{ t.savedMessage }}
        </p>
        <Button type="button" variant="ghost" :disabled="!dirty || pending" @click="reset">
          {{ t.resetLabel }}
        </Button>
        <Button type="submit" :disabled="!dirty || pending" :aria-busy="pending">
          <LoaderCircle v-if="pending" class="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          {{ pending ? t.pendingLabel : t.saveLabel }}
        </Button>
      </div>
    </form>
  </section>
</template>
