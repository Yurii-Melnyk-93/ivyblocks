<script setup lang="ts">
import type { ShellNavItem } from '@/components/blocks/dashboard-shell-01'
import { FileText, LayoutDashboard, Plus, Settings, Users } from '@lucide/vue'
import { DashboardShell01 } from '@/components/blocks/dashboard-shell-01'
import { Button } from '@/components/ui/button'

usePreviewPage('dashboard-shell-01')

const items: ShellNavItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview', icon: LayoutDashboard },
  { id: 'invoices', label: 'Invoices', href: '#invoices', icon: FileText, badge: 3 },
  { id: 'clients', label: 'Clients', href: '#clients', icon: Users },
  { id: 'settings', label: 'Settings', href: '#settings', icon: Settings },
]

const activeId = ref('invoices')
const title = computed(() => items.find(i => i.id === activeId.value)?.label)

const invoices = [
  { id: 'INV-1042', client: 'Northwind Studio', amount: '$1,200.00', status: 'Overdue' },
  { id: 'INV-1041', client: 'Bluebird Labs', amount: '$860.00', status: 'Sent' },
  { id: 'INV-1040', client: 'Harbor & Co', amount: '$2,450.00', status: 'Paid' },
]
</script>

<template>
  <DashboardShell01
    :items="items"
    :active-id="activeId"
    :title="title"
    :user="{ name: 'Ann Lee', email: 'ann@example.com' }"
    @navigate="activeId = $event"
  >
    <template #brand>
      <span class="font-semibold">Ledgerly</span>
    </template>
    <template #actions>
      <Button size="sm">
        <Plus aria-hidden="true" />
        New invoice
      </Button>
    </template>

    <ul class="divide-y rounded-lg border">
      <li v-for="inv in invoices" :key="inv.id" class="flex items-center justify-between gap-4 px-4 py-3 text-sm">
        <div class="min-w-0">
          <p class="font-medium">
            {{ inv.client }}
          </p>
          <p class="text-muted-foreground">
            {{ inv.id }} · {{ inv.status }}
          </p>
        </div>
        <span class="tabular-nums">{{ inv.amount }}</span>
      </li>
    </ul>
  </DashboardShell01>
</template>
