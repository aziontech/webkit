<script setup lang="ts">
  import { inject, onActivated, onBeforeUnmount, onDeactivated, onMounted } from 'vue'

  import type { ConsoleLayoutCrumb } from '../console-layout.vue'
  import { type ConsoleLayoutTrail, ConsoleLayoutTrailsKey } from '../injection-key'

  defineOptions({
    name: 'ConsoleLayoutBreadcrumbs',
    inheritAttrs: false,
    render: () => null
  })

  interface Props {
    /** The page's crumbs; without a control crumb the last one is the current page. */
    items?: ConsoleLayoutCrumb[]
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => []
  })

  const slots = defineSlots<{
    /** One or more controls that end the trail, each its own crumb, such as a transparent small Select. */
    default?(): unknown
  }>()

  const trails = inject(ConsoleLayoutTrailsKey, null)

  const trail: ConsoleLayoutTrail = {
    items: () => props.items,
    hasControl: () => Boolean(slots.default),
    control: () => slots.default?.()
  }

  let shown = false

  const show = () => {
    if (!trails || shown) return
    shown = true
    trails.add(trail)
  }

  const hide = () => {
    if (!trails || !shown) return
    shown = false
    trails.remove(trail)
  }

  onMounted(show)
  onActivated(show)
  onDeactivated(hide)
  onBeforeUnmount(hide)
</script>
