<script setup lang="ts">
import type { ShellNavItem, ShellUser } from './types'
import { computed } from 'vue'

const props = defineProps<{
  items: ShellNavItem[]
  activeId?: string
  user?: ShellUser
  navLabel: string
}>()

const emit = defineEmits<{
  navigate: [itemId: string]
}>()

const initials = computed(() => (props.user?.name ?? '')
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part[0]?.toUpperCase())
  .join(''))
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex h-14 shrink-0 items-center border-b px-4">
      <slot name="brand" />
    </div>

    <nav :aria-label="navLabel" class="flex-1 overflow-y-auto p-3">
      <ul class="grid gap-1">
        <li v-for="item in items" :key="item.id">
          <a
            :href="item.href"
            :aria-current="item.id === activeId ? 'page' : undefined"
            class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-foreground"
            @click="emit('navigate', item.id)"
          >
            <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
            <span class="flex-1 truncate">{{ item.label }}</span>
            <span
              v-if="item.badge !== undefined"
              class="rounded-full bg-muted px-2 text-xs tabular-nums text-muted-foreground"
            >
              {{ item.badge }}
            </span>
          </a>
        </li>
      </ul>
    </nav>

    <div v-if="user" class="flex shrink-0 items-center gap-3 border-t p-4">
      <img
        v-if="user.avatarUrl"
        :src="user.avatarUrl"
        alt=""
        class="size-8 shrink-0 rounded-full object-cover"
      >
      <span
        v-else
        aria-hidden="true"
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
      >
        {{ initials }}
      </span>
      <div class="min-w-0">
        <p class="truncate text-sm font-medium">
          {{ user.name }}
        </p>
        <p class="truncate text-xs text-muted-foreground">
          {{ user.email }}
        </p>
      </div>
    </div>
  </div>
</template>
