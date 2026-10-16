<script setup lang="ts">
import type { ShellCopy, ShellNavItem, ShellUser } from './types'
import { Menu, X } from '@lucide/vue'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import ShellNav from './ShellNav.vue'

const props = withDefaults(defineProps<{
  items: ShellNavItem[]
  activeId?: string
  /** Page title in the top bar. */
  title?: string
  user?: ShellUser
  copy?: Partial<ShellCopy>
}>(), {
  activeId: undefined,
  title: undefined,
  user: undefined,
  copy: () => ({}),
})

const emit = defineEmits<{
  navigate: [itemId: string]
}>()

const t = computed<ShellCopy>(() => ({
  navLabel: 'Main',
  openNavLabel: 'Open navigation',
  closeNavLabel: 'Close navigation',
  ...props.copy,
}))

// Mobile drawer: native <dialog> gives focus trapping, Escape and a backdrop.
const drawer = ref<HTMLDialogElement>()

function openDrawer() {
  drawer.value?.showModal()
}

function closeDrawer() {
  drawer.value?.close()
}

function onDrawerClick(event: MouseEvent) {
  // A click on the dialog box itself (not its content) is a click on the backdrop.
  if (event.target === drawer.value)
    closeDrawer()
}

function onNavigate(itemId: string) {
  closeDrawer()
  emit('navigate', itemId)
}
</script>

<template>
  <div class="min-h-dvh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
    <aside class="sticky top-0 hidden h-dvh border-r bg-muted/30 lg:block">
      <ShellNav
        :items="items"
        :active-id="activeId"
        :user="user"
        :nav-label="t.navLabel"
        @navigate="onNavigate"
      >
        <template #brand>
          <slot name="brand" />
        </template>
      </ShellNav>
    </aside>

    <dialog
      ref="drawer"
      :aria-label="t.navLabel"
      class="m-0 h-dvh max-h-none w-72 max-w-[85vw] border-r bg-background p-0 text-foreground backdrop:bg-black/50 lg:hidden"
      @click="onDrawerClick"
    >
      <div class="relative h-full">
        <Button
          variant="ghost"
          size="icon"
          class="absolute top-2.5 right-2"
          :aria-label="t.closeNavLabel"
          @click="closeDrawer"
        >
          <X aria-hidden="true" />
        </Button>
        <ShellNav
          :items="items"
          :active-id="activeId"
          :user="user"
          :nav-label="t.navLabel"
          @navigate="onNavigate"
        >
          <template #brand>
            <slot name="brand" />
          </template>
        </ShellNav>
      </div>
    </dialog>

    <div class="flex min-w-0 flex-col">
      <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          class="-ml-2 lg:hidden"
          :aria-label="t.openNavLabel"
          @click="openDrawer"
        >
          <Menu aria-hidden="true" />
        </Button>
        <h1 v-if="title" class="truncate text-base font-semibold">
          {{ title }}
        </h1>
        <div class="ml-auto flex items-center gap-2">
          <slot name="actions" />
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
