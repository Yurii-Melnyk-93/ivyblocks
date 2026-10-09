<script setup lang="ts">
import type { PricingPlan } from '@/components/blocks/pricing-01'
import { Pricing01 } from '@/components/blocks/pricing-01'

const route = useRoute()

useHead({
  title: 'pricing-01',
  htmlAttrs: { class: route.query.theme === 'dark' ? 'dark' : '' },
})

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For trying the product on a side project.',
    priceMonthly: 0,
    priceYearly: 0,
    features: ['3 projects', '1 GB storage', 'Community support'],
    ctaLabel: 'Start for free',
    ctaHref: '#signup',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For freelancers and small teams shipping client work.',
    priceMonthly: 29,
    priceYearly: 24,
    inherits: 'starter',
    features: ['Unlimited projects', '50 GB storage', 'Custom domains', 'Email support'],
    ctaLabel: 'Start 14-day trial',
    ctaHref: '#trial',
    recommended: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams that need roles, audit logs and SSO.',
    priceMonthly: 79,
    priceYearly: 66,
    inherits: 'pro',
    features: ['Roles and permissions', 'Audit log', 'SAML SSO', 'Priority support'],
    ctaLabel: 'Start 14-day trial',
    ctaHref: '#trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Volume pricing, invoicing and a dedicated contact.',
    priceMonthly: null,
    priceYearly: null,
    inherits: 'business',
    features: ['Custom contract', 'Invoice billing', 'Uptime SLA'],
    ctaLabel: 'Talk to sales',
    ctaHref: '#contact',
  },
]
</script>

<template>
  <main class="min-h-dvh">
    <Pricing01
      title="Pay for what your team actually uses"
      description="Every plan includes unlimited viewers. Change or cancel your plan at any time."
      :plans="plans"
    />
  </main>
</template>
