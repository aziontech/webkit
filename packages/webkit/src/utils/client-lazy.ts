import {
  type Component,
  defineAsyncComponent,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  onMounted,
  ref,
  ssrContextKey
} from 'vue'

export function defineClientLazy(loader: () => Promise<unknown>, face: Component): Component {
  const Loaded = defineAsyncComponent({
    loader: loader as () => Promise<Component>,
    loadingComponent: face,
    delay: 0
  })
  return defineComponent({
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      const serverRendering = inject(ssrContextKey, null) != null
      const hydrating = getCurrentInstance()?.vnode.el != null
      const ready = ref(!serverRendering && !hydrating)
      onMounted(() => {
        ready.value = true
      })
      return () => h(ready.value ? Loaded : face, attrs, slots)
    }
  })
}
