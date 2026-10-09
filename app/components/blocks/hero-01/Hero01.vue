<script setup lang="ts">
import type { HeroLink } from './types'
import { Button } from '@/components/ui/button'

withDefaults(defineProps<{
  title: string
  description?: string
  primaryAction: HeroLink
  secondaryAction?: HeroLink
  /** Small link above the title, e.g. a release note. */
  announcement?: HeroLink
  /** Short reassurance under the actions, e.g. "No credit card required". */
  note?: string
}>(), {
  description: undefined,
  secondaryAction: undefined,
  announcement: undefined,
  note: undefined,
})
</script>

<template>
  <section class="overflow-hidden">
    <div
      class="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      <div class="max-w-xl">
        <a
          v-if="announcement"
          :href="announcement.href"
          class="mb-6 inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {{ announcement.label }}
        </a>

        <h1 class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {{ title }}
        </h1>

        <p v-if="description" class="mt-5 text-lg text-muted-foreground text-pretty">
          {{ description }}
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button as-child size="lg">
            <a :href="primaryAction.href">{{ primaryAction.label }}</a>
          </Button>
          <Button v-if="secondaryAction" as-child size="lg" variant="outline">
            <a :href="secondaryAction.href">{{ secondaryAction.label }}</a>
          </Button>
        </div>

        <p v-if="note" class="mt-4 text-sm text-muted-foreground">
          {{ note }}
        </p>
      </div>

      <!-- On lg the frame runs past the right edge of the container. -->
      <div class="relative lg:-mr-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
        <div class="overflow-hidden rounded-xl border bg-card shadow-sm lg:rounded-r-none lg:border-r-0">
          <slot name="media">
            <div aria-hidden="true" class="flex aspect-[16/10] min-h-0 text-muted-foreground">
              <div class="hidden w-1/5 shrink-0 flex-col gap-3 border-r bg-muted/40 p-4 sm:flex">
                <div class="h-3 w-3/4 rounded bg-foreground/15" />
                <div class="mt-3 h-2 w-full rounded bg-foreground/10" />
                <div class="h-2 w-5/6 rounded bg-foreground/10" />
                <div class="h-2 w-2/3 rounded bg-foreground/10" />
                <div class="h-2 w-4/5 rounded bg-foreground/10" />
              </div>
              <div class="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div class="h-3 w-1/3 rounded bg-foreground/15" />
                  <div class="h-6 w-16 rounded-md bg-primary/80" />
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <div v-for="n in 3" :key="n" class="rounded-lg border p-3">
                    <div class="h-2 w-1/2 rounded bg-foreground/10" />
                    <div class="mt-2 h-4 w-2/3 rounded bg-foreground/20" />
                  </div>
                </div>
                <div class="flex min-h-0 flex-1 items-end gap-2 rounded-lg border p-3">
                  <div
                    v-for="(h, i) in [40, 65, 50, 80, 60, 90, 70, 55, 85, 75, 95, 68]"
                    :key="i"
                    class="flex-1 rounded-t bg-primary/20"
                    :style="{ height: `${h}%` }"
                  />
                </div>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>
