<script setup lang="ts">
import { Check, Copy } from '@lucide/vue'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  command: string
}>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 2000)
  }
  catch {
    // Clipboard blocked: the command stays visible and selectable.
  }
}
</script>

<template>
  <div class="flex min-w-0 items-start gap-2 rounded-lg border bg-muted/40 py-1.5 pr-1.5 pl-4">
    <code class="min-w-0 flex-1 py-1.5 font-mono text-sm [overflow-wrap:anywhere]">{{ command }}</code>
    <Button
      variant="ghost"
      size="icon-sm"
      :aria-label="copied ? 'Copied' : 'Copy command'"
      @click="copy"
    >
      <Check v-if="copied" aria-hidden="true" />
      <Copy v-else aria-hidden="true" />
    </Button>
    <span class="sr-only" role="status">{{ copied ? 'Copied to clipboard' : '' }}</span>
  </div>
</template>
