<script setup lang="ts">
import type { AuthCopy, AuthMode, AuthPayload, AuthProvider } from './types'
import { LoaderCircle } from '@lucide/vue'
import { computed, ref, useId } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = withDefaults(defineProps<{
  mode?: AuthMode
  providers?: AuthProvider[]
  /** Link to the other mode (sign-up page from sign-in, and back). */
  switchHref: string
  forgotPasswordHref?: string
  /** Form-level error, e.g. "Incorrect email or password." */
  error?: string
  pending?: boolean
  minPasswordLength?: number
  copy?: Partial<AuthCopy>
}>(), {
  mode: 'sign-in',
  providers: () => [],
  forgotPasswordHref: undefined,
  error: undefined,
  pending: false,
  minPasswordLength: 8,
  copy: () => ({}),
})

const emit = defineEmits<{
  submit: [payload: AuthPayload]
  provider: [providerId: string]
}>()

const defaults: Record<AuthMode, AuthCopy> = {
  'sign-in': {
    title: 'Sign in',
    description: 'Welcome back. Enter your details to continue.',
    submitLabel: 'Sign in',
    pendingLabel: 'Signing in',
    nameLabel: 'Name',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    forgotPasswordLabel: 'Forgot password?',
    dividerLabel: 'or with email',
    switchPrompt: 'No account yet?',
    switchLabel: 'Create one',
  },
  'sign-up': {
    title: 'Create your account',
    description: 'Start with a free account. You can invite your team later.',
    submitLabel: 'Create account',
    pendingLabel: 'Creating account',
    nameLabel: 'Name',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    forgotPasswordLabel: 'Forgot password?',
    dividerLabel: 'or with email',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Sign in',
  },
}

const t = computed<AuthCopy>(() => ({ ...defaults[props.mode], ...props.copy }))
const isSignUp = computed(() => props.mode === 'sign-up')

const name = ref('')
const email = ref('')
const password = ref('')

const uid = useId()
const ids = {
  name: `${uid}-name`,
  email: `${uid}-email`,
  password: `${uid}-password`,
  passwordHint: `${uid}-password-hint`,
  error: `${uid}-error`,
}

function onSubmit() {
  if (props.pending)
    return
  const base = { email: email.value.trim(), password: password.value }
  emit('submit', isSignUp.value
    ? { mode: 'sign-up', name: name.value.trim(), ...base }
    : { mode: 'sign-in', ...base })
}
</script>

<template>
  <section class="mx-auto w-full max-w-sm px-4 py-16 sm:py-24">
    <h1 class="text-2xl font-semibold tracking-tight">
      {{ t.title }}
    </h1>
    <p v-if="t.description" class="mt-2 text-sm text-muted-foreground text-pretty">
      {{ t.description }}
    </p>

    <template v-if="providers.length">
      <div class="mt-8 grid gap-2">
        <Button
          v-for="provider in providers"
          :key="provider.id"
          type="button"
          variant="outline"
          class="w-full"
          :disabled="pending"
          @click="emit('provider', provider.id)"
        >
          <slot name="provider-icon" :provider="provider" />
          {{ provider.label }}
        </Button>
      </div>

      <div class="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span class="h-px flex-1 bg-border" />
        {{ t.dividerLabel }}
        <span class="h-px flex-1 bg-border" />
      </div>
    </template>

    <form
      class="grid gap-4"
      :class="!providers.length && 'mt-8'"
      :aria-describedby="error ? ids.error : undefined"
      @submit.prevent="onSubmit"
    >
      <div v-if="isSignUp" class="grid gap-2">
        <Label :for="ids.name">{{ t.nameLabel }}</Label>
        <Input
          :id="ids.name"
          v-model="name"
          name="name"
          autocomplete="name"
          required
        />
      </div>

      <div class="grid gap-2">
        <Label :for="ids.email">{{ t.emailLabel }}</Label>
        <Input
          :id="ids.email"
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          inputmode="email"
          required
          :aria-invalid="error ? true : undefined"
        />
      </div>

      <div class="grid gap-2">
        <div class="flex items-baseline justify-between gap-4">
          <Label :for="ids.password">{{ t.passwordLabel }}</Label>
          <a
            v-if="!isSignUp && forgotPasswordHref"
            :href="forgotPasswordHref"
            class="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {{ t.forgotPasswordLabel }}
          </a>
        </div>
        <Input
          :id="ids.password"
          v-model="password"
          type="password"
          name="password"
          :autocomplete="isSignUp ? 'new-password' : 'current-password'"
          :minlength="isSignUp ? minPasswordLength : undefined"
          required
          :aria-invalid="error ? true : undefined"
          :aria-describedby="isSignUp ? ids.passwordHint : undefined"
        />
        <p v-if="isSignUp" :id="ids.passwordHint" class="text-xs text-muted-foreground">
          <slot name="password-hint" :min="minPasswordLength">
            At least {{ minPasswordLength }} characters.
          </slot>
        </p>
      </div>

      <p
        v-if="error"
        :id="ids.error"
        role="alert"
        class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        {{ error }}
      </p>

      <Button type="submit" class="mt-2 w-full" :disabled="pending" :aria-busy="pending">
        <LoaderCircle v-if="pending" class="animate-spin motion-reduce:animate-none" aria-hidden="true" />
        {{ pending ? t.pendingLabel : t.submitLabel }}
      </Button>
    </form>

    <p class="mt-8 text-sm text-muted-foreground">
      {{ t.switchPrompt }}
      <a :href="switchHref" class="font-medium text-foreground underline-offset-4 hover:underline">
        {{ t.switchLabel }}
      </a>
    </p>
  </section>
</template>
