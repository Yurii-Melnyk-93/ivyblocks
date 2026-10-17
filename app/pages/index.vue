<script setup lang="ts">
import CopyCommand from '@/components/landing/CopyCommand.vue'
import WaitlistForm from '@/components/landing/WaitlistForm.vue'

useHead({
  title: 'Ivyblocks: shadcn-vue blocks for Nuxt and Vue',
  meta: [{ name: 'description', content: 'Free shadcn-vue blocks for Nuxt and Vue. Install with one command, own the code.' }],
})

const REGISTRY = 'https://ivyblocks.netlify.app/r'
const REPO = 'https://github.com/Yurii-Melnyk-93/ivyblocks'

const addCommand = (name: string) => `npx shadcn-vue@latest add ${REGISTRY}/${name}.json`

const blocks = [
  { name: 'pricing-01', title: 'Pricing', description: 'Plans as rows with a monthly/yearly switch, yearly savings and “everything in X, plus”.' },
  { name: 'hero-01', title: 'Hero', description: 'Headline, two actions and a product frame that runs off the right edge on desktop.' },
  { name: 'auth-01', title: 'Sign in and sign up', description: 'One form for both modes: OAuth buttons, field errors, pending state, typed submit payload.' },
  { name: 'settings-01', title: 'Settings', description: 'Profile and notification settings with unsaved-change tracking, discard and save states.' },
  { name: 'dashboard-shell-01', title: 'Dashboard shell', description: 'Sidebar navigation, top bar and a mobile drawer built on the native dialog element.' },
]
</script>

<template>
  <div class="min-h-dvh">
    <header class="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
      <span class="font-semibold">Ivyblocks</span>
      <a :href="REPO" class="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">GitHub</a>
    </header>

    <main class="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <section class="py-16 md:py-24">
        <h1 class="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          shadcn-vue blocks you install with one command
        </h1>
        <p class="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
          Pricing, hero, auth, settings and a dashboard shell for Nuxt and Vue. The code lands in your project and follows your theme.
        </p>
        <div class="mt-8 max-w-2xl">
          <CopyCommand :command="addCommand('pricing-01')" />
        </div>
        <p class="mt-4 text-sm text-muted-foreground">
          Free, five blocks so far.
          <a href="#waitlist" class="font-medium text-foreground underline-offset-4 hover:underline">Join the waitlist</a>
          for the full pack.
        </p>
      </section>

      <section id="blocks" class="border-t py-12" aria-labelledby="blocks-title">
        <h2 id="blocks-title" class="text-xl font-semibold tracking-tight">
          Free blocks
        </h2>
        <ul class="mt-6 divide-y">
          <li v-for="block in blocks" :key="block.name" class="grid grid-cols-1 gap-3 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8">
            <div>
              <h3 class="font-medium">
                {{ block.title }}
              </h3>
              <p class="mt-1 text-sm text-muted-foreground text-pretty">
                {{ block.description }}
              </p>
              <NuxtLink :to="`/preview/${block.name}`" class="mt-2 inline-block text-sm font-medium underline-offset-4 hover:underline">
                Open preview
              </NuxtLink>
            </div>
            <CopyCommand :command="addCommand(block.name)" class="self-start" />
          </li>
        </ul>
      </section>

      <section class="border-t py-12" aria-labelledby="setup-title">
        <h2 id="setup-title" class="text-xl font-semibold tracking-tight">
          Before you install
        </h2>
        <ul class="mt-6 grid max-w-2xl gap-4 text-sm">
          <li>
            <p class="font-medium">
              Nuxt 4, or Vue 3 with Vite, and Tailwind CSS 4
            </p>
          </li>
          <li>
            <p class="font-medium">
              shadcn-vue set up in the project
            </p>
            <p class="mt-1 text-muted-foreground">
              Follow the shadcn-vue installation guide, then run <code class="font-mono">npx shadcn-vue@latest init</code>. Blocks install the base components they need.
            </p>
          </li>
          <li>
            <p class="font-medium">
              TypeScript 6
            </p>
            <p class="mt-1 text-muted-foreground">
              Run <code class="font-mono">npm i -D typescript@6</code>. TypeScript 7 does not yet let Vue resolve imported types in components, so shadcn-vue components fail to compile with it.
            </p>
          </li>
          <li>
            <p class="font-medium">
              Icons from @lucide/vue
            </p>
            <p class="mt-1 text-muted-foreground">
              Installed with the block. If you chose another icon library during init, both will be in your project.
            </p>
          </li>
        </ul>
      </section>

      <section id="waitlist" class="border-t py-12 md:py-16" aria-labelledby="waitlist-title">
        <h2 id="waitlist-title" class="text-xl font-semibold tracking-tight">
          A pack of 30–40 blocks is next
        </h2>
        <p class="mt-2 max-w-xl text-sm text-muted-foreground text-pretty">
          Marketing pages, app screens and forms in the same style, for a one-time price. Leave your email and get a single message when it's out.
        </p>
        <div class="mt-6 max-w-xl">
          <WaitlistForm />
        </div>
      </section>
    </main>

    <footer class="mx-auto w-full max-w-4xl px-4 text-sm text-muted-foreground sm:px-6">
      <div class="border-t py-6">
        <a :href="REPO" class="underline-offset-4 hover:text-foreground hover:underline">Source on GitHub</a>
      </div>
    </footer>
  </div>
</template>
