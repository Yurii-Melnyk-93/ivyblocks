import type { Component } from 'vue'

export interface ShellNavItem {
  id: string
  label: string
  href: string
  /** Any icon component, e.g. from @lucide/vue. */
  icon?: Component
  /** Small count or label after the item, e.g. unread items. */
  badge?: string | number
}

export interface ShellUser {
  name: string
  email: string
  avatarUrl?: string
}

export interface ShellCopy {
  navLabel: string
  openNavLabel: string
  closeNavLabel: string
}
