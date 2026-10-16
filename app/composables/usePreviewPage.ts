/**
 * Preview pages only: sets the tab title and applies `?theme=dark`.
 * The class is computed so it also applies on statically generated pages,
 * where the query is only known in the browser.
 */
export function usePreviewPage(title: string) {
  const route = useRoute()
  useHead({
    title,
    htmlAttrs: { class: computed(() => route.query.theme === 'dark' ? 'dark' : '') },
  })
  return route
}
