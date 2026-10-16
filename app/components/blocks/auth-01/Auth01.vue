<script setup lang="ts">
import type { AuthCopy, AuthField, AuthFieldErrors, AuthMode, AuthPayload, AuthProvider } from './types'
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
  /**
   * Error about the credentials as a whole, e.g. "Incorrect email or password."
   * Shown under the password field; highlights email and password.
   */
  error?: string
  /** Field errors: shown under that field, only that field is highlighted. */
  errors?: AuthFieldErrors
  pending?: boolean
  minPasswordLength?: number
  copy?: Partial<AuthCopy>
}>(), {
  mode: 'sign-in',
  providers: () => [],
  forgotPasswordHref: undefined,
  error: undefined,
  errors: () => ({}),
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
  formError: `${uid}-form-error`,
}

function errorId(field: AuthField) {
  return `${uid}-${field}-error`
}

// A form-level error is about the credentials, so it marks email and password.
function invalid(field: AuthField) {
  return props.errors[field] || (props.error && field !== 'name') ? true : undefined
}

function describedBy(field: AuthField) {
  return [
    props.errors[field] && errorId(field),
    props.error && field === 'email' && ids.formError,
  ].filter(Boolean).join(' ') || undefined
}

// The hint gives way to any error shown under the password field.
const showPasswordHint = computed(() => isSignUp.value && !props.errors.password && !props.error)

const passwordDescribedBy = computed(() => [
  showPasswordHint.value && ids.passwordHint,
  props.errors.password && errorId('password'),
  props.error && ids.formError,
].filter(Boolean).join(' ') || undefined)

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
          <slot name="provider-icon" :provider="provider">
            <component :is="provider.icon" v-if="provider.icon" class="size-4" aria-hidden="true" />
          </slot>
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
          :aria-invalid="invalid('name')"
          :aria-describedby="describedBy('name')"
        />
        <p v-if="errors.name" :id="errorId('name')" role="alert" class="text-sm text-destructive">
          {{ errors.name }}
        </p>
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
          :aria-invalid="invalid('email')"
          :aria-describedby="describedBy('email')"
        />
        <p v-if="errors.email" :id="errorId('email')" role="alert" class="text-sm text-destructive">
          {{ errors.email }}
        </p>
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
          :aria-invalid="invalid('password')"
          :aria-describedby="passwordDescribedBy"
        />
        <p v-if="showPasswordHint" :id="ids.passwordHint" class="text-xs text-muted-foreground">
          <slot name="password-hint" :min="minPasswordLength">
            At least {{ minPasswordLength }} characters.
          </slot>
        </p>
        <p v-if="errors.password" :id="errorId('password')" role="alert" class="text-sm text-destructive">
          {{ errors.password }}
        </p>
        <p v-if="error" :id="ids.formError" role="alert" class="text-sm text-destructive">
          {{ error }}
        </p>
      </div>

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
