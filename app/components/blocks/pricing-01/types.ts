export type BillingPeriod = 'monthly' | 'yearly'

export interface PricingPlan {
  id: string
  name: string
  description: string
  /** Price per month when billed monthly. `null` = custom / contact sales. */
  priceMonthly: number | null
  /** Price per month when billed yearly. `null` = custom / contact sales. */
  priceYearly: number | null
  features: string[]
  /** `id` of a cheaper plan whose features this one includes. */
  inherits?: string
  ctaLabel: string
  ctaHref: string
  recommended?: boolean
}
