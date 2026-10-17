<script setup lang="ts">
import { LoaderCircle } from '@lucide/vue'
import { ref, useId } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Netlify Forms: the form is in the prerendered HTML, so Netlify detects it at deploy.
// Submissions are posted with fetch as urlencoded data, which Netlify requires.
const FORM_NAME = 'waitlist'

const status = ref<'idle' | 'pending' | 'done'>('idle')
const error = ref<string>()

const uid = useId()
const emailId = `${uid}-email`
const errorId = `${uid}-error`

async function onSubmit(event: Event) {
  const form = event.target as HTMLFormElement
  error.value = undefined
  status.value = 'pending'
  try {
    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString()
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    if (!res.ok)
      throw new Error(String(res.status))
    status.value = 'done'
  }
  catch {
    status.value = 'idle'
    error.value = 'Could not join the list. Check your connection and try again.'
  }
}
</script>

<template>
  <p v-if="status === 'done'" role="status" class="text-sm font-medium">
    You're on the list. One email when the pack is out, nothing else.
  </p>
  <form
    v-else
    :name="FORM_NAME"
    method="POST"
    data-netlify="true"
    netlify-honeypot="bot-field"
    class="grid gap-2"
    @submit.prevent="onSubmit"
  >
    <input type="hidden" name="form-name" :value="FORM_NAME">
    <p class="hidden">
      <label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label>
    </p>

    <Label :for="emailId">Email</Label>
    <div class="flex flex-col gap-2 sm:flex-row">
      <Input
        :id="emailId"
        type="email"
        name="email"
        autocomplete="email"
        required
        placeholder="you@example.com"
        class="sm:max-w-xs"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? errorId : undefined"
      />
      <Button type="submit" :disabled="status === 'pending'" :aria-busy="status === 'pending'">
        <LoaderCircle v-if="status === 'pending'" class="animate-spin motion-reduce:animate-none" aria-hidden="true" />
        {{ status === 'pending' ? 'Joining' : 'Join the waitlist' }}
      </Button>
    </div>
    <p v-if="error" :id="errorId" role="alert" class="text-sm text-destructive">
      {{ error }}
    </p>
  </form>
</template>
