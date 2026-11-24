import { getCurrentInstance, onMounted, type Ref, ref } from 'vue'

/**
 * Whether a `<Teleport to="body">` may render into its target yet.
 *
 * SSR hosts such as Astro drop Vue's teleport buffer, so `<body>` carries no teleport
 * anchors. A teleport hydrated there binds its placeholder to an unrelated node, and the
 * next open crashes in `insertBefore`, which stalls every overlay on the page. Bind the
 * result to the teleport's `disabled` prop (`:disabled="!teleportReady"`) so the server
 * and the hydration pass both render it inline, then hand it to `<body>` once mounted.
 *
 * - Server: false, so the teleport renders inline.
 * - Hydration: false until mounted (Vue sets `vnode.el` before setup only when hydrating).
 * - Client-only mount: true from the first render, so nothing moves after mount.
 */
export function useMounted(): Readonly<Ref<boolean>> {
  const hydrating = getCurrentInstance()?.vnode.el != null
  const mounted = ref(typeof window !== 'undefined' && !hydrating)
  onMounted(() => {
    mounted.value = true
  })
  return mounted
}
