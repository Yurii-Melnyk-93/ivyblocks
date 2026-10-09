<script setup lang="ts">
import type { BillingPeriod, PricingPlan } from './types'
import { Check } from 'lucide-vue-next'
import { computed, useId } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  plans: PricingPlan[]
  currency?: string
  locale?: string
  recommendedLabel?: string
  yearlyLabel?: string
  customPriceLabel?: string
}>(), {
  description: undefined,
  currency: 'USD',
  locale: 'en-US',
  recommendedLabel: 'Recommended',
  yearlyLabel: 'Billed yearly',
  customPriceLabel: 'Custom',
})

const emit = defineEmits<{
  select: [planId: string, period: BillingPeriod]
}>()

const period = defineModel<BillingPeriod>('period', { default: 'monthly' })

const yearly = computed({
  get: () => period.value === 'yearly',
  set: (value: boolean) => { period.value = value ? 'yearly' : 'monthly' },
})

const switchId = useId()

const money = computed(() => new Intl.NumberFormat(props.locale, {
  style: 'currency',
  currency: props.currency,
  maximumFractionDigits: 0,
}))

const planNames = computed(() => new Map(props.plans.map(plan => [plan.id, plan.name])))

function priceOf(plan: PricingPlan): number | null {
  return yearly.value ? plan.priceYearly : plan.priceMonthly
}

function yearlySaving(plan: PricingPlan): number {
  if (plan.priceMonthly === null || plan.priceYearly === null)
    return 0
  return Math.max(0, (plan.priceMonthly - plan.priceYearly) * 12)
}

const maxSaving = computed(() => Math.max(0, ...props.plans.map(yearlySaving)))
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
    <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div class="max-w-xl">
        <h2 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {{ title }}
        </h2>
        <p v-if="description" class="mt-3 text-muted-foreground text-pretty">
          {{ description }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <Switch :id="switchId" v-model="yearly" />
        <Label :for="switchId" class="cursor-pointer">{{ yearlyLabel }}</Label>
        <span
          v-if="maxSaving > 0"
          class="text-sm text-muted-foreground tabular-nums"
        >
          <slot name="saving-hint" :amount="money.format(maxSaving)">
            save up to {{ money.format(maxSaving) }}/yr
          </slot>
        </span>
      </div>
    </div>

    <ul class="mt-10 divide-y overflow-hidden rounded-xl border bg-card text-card-foreground md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,1.6fr)_auto]" aria-live="polite">
      <li
        v-for="plan in plans"
        :key="plan.id"
        class="relative grid gap-6 p-6 md:col-span-4 md:grid-cols-subgrid md:items-start md:gap-8 md:p-8"
        :class="plan.recommended && 'bg-muted/50'"
      >
        <span
          v-if="plan.recommended"
          aria-hidden="true"
          class="absolute inset-y-0 left-0 w-1 bg-primary"
        />

        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-lg font-semibold">
              {{ plan.name }}
            </h3>
            <Badge v-if="plan.recommended">
              {{ recommendedLabel }}
            </Badge>
          </div>
          <p class="mt-1 text-sm text-muted-foreground text-pretty">
            {{ plan.description }}
          </p>
        </div>

        <div>
          <template v-if="priceOf(plan) !== null">
            <p class="flex items-baseline gap-1">
              <span class="text-4xl font-semibold tracking-tight tabular-nums">
                {{ money.format(priceOf(plan) ?? 0) }}
              </span>
              <span class="text-sm text-muted-foreground">/mo</span>
            </p>
            <p
              v-if="yearly && yearlySaving(plan) > 0"
              class="mt-1 text-sm text-muted-foreground tabular-nums"
            >
              {{ money.format(yearlySaving(plan)) }} less per year
            </p>
          </template>
          <p v-else class="text-4xl font-semibold tracking-tight">
            {{ customPriceLabel }}
          </p>
        </div>

        <div>
          <p
            v-if="plan.inherits && planNames.get(plan.inherits)"
            class="mb-3 text-sm font-medium"
          >
            Everything in {{ planNames.get(plan.inherits) }}, plus:
          </p>
          <ul class="grid gap-2 text-sm sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <li v-for="feature in plan.features" :key="feature" class="flex gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <Button
          as-child
          class="w-full md:w-auto"
          :variant="plan.recommended ? 'default' : 'outline'"
          @click="emit('select', plan.id, period)"
        >
          <a :href="plan.ctaHref">{{ plan.ctaLabel }}</a>
        </Button>
      </li>
    </ul>
  </section>
</template>
