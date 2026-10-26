# Ivyblocks

Free [shadcn-vue](https://www.shadcn-vue.com) blocks for Nuxt and Vue. Install a block with one command; the code lands in your project and follows your theme.

**Previews and install commands:** https://ivyblocks.netlify.app

## Blocks

| Block | Install |
| --- | --- |
| Pricing | `npx shadcn-vue@latest add https://ivyblocks.netlify.app/r/pricing-01.json` |
| Hero | `npx shadcn-vue@latest add https://ivyblocks.netlify.app/r/hero-01.json` |
| Sign in and sign up | `npx shadcn-vue@latest add https://ivyblocks.netlify.app/r/auth-01.json` |
| Settings | `npx shadcn-vue@latest add https://ivyblocks.netlify.app/r/settings-01.json` |
| Dashboard shell | `npx shadcn-vue@latest add https://ivyblocks.netlify.app/r/dashboard-shell-01.json` |

Blocks are installed into `components/blocks/<name>/` under your `components` alias, together with the shadcn-vue components they use.

## Requirements

- Nuxt 4, or Vue 3 with Vite, and Tailwind CSS 4
- shadcn-vue set up in the project (`npx shadcn-vue@latest init`)
- TypeScript 6 (`npm i -D typescript@6`). With TypeScript 7, Vue can't resolve imported prop types and shadcn-vue components fail to compile.
- Icons come from `@lucide/vue` and are installed with the block.

## Develop locally

```bash
npm install
npm run dev              # previews at http://localhost:3000
npm run registry:build   # rebuild public/r/*.json after changing a block
```

## License

[MIT](./LICENSE)
