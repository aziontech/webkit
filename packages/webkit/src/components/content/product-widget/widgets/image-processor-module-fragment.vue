<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import Tag from '../../../tag/tag.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import LegacySwitch from '../parts/legacy-switch.vue'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'ImageProcessorModuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the list scrolls to Image Processor and switches it on while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const MODULES = [
    {
      key: 'application-accelerator',
      title: 'Application Accelerator',
      subtitle: 'Optimize protocols and manage dynamic content delivery.',
      locked: false
    },
    {
      key: 'cache',
      title: 'Cache',
      subtitle: 'Customize advanced cache settings.',
      locked: true
    },
    {
      key: 'functions',
      title: 'Functions',
      subtitle: 'Build low-latency functions that run close to users.',
      locked: false
    },
    {
      key: 'image-processor',
      title: 'Image Processor',
      subtitle: 'Enable dynamic image editing options.',
      locked: false
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    anchor: number
    enabled: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'functions', x: 5.2, y: 1.6 }
  const SWITCH: MockupCursorTarget = { key: 'image-processor', x: 0.6, y: 0.6 }

  const REST = { cursor: IDLE, press: false, anchor: 0, enabled: false }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, anchor: 1, forward: 200, back: 420 },
    { ...REST, anchor: 1, cursor: SWITCH, forward: 650, back: 420 },
    { ...REST, anchor: 1, cursor: SWITCH, press: true, forward: 520, back: 120 },
    { ...REST, anchor: 1, cursor: SWITCH, press: true, enabled: true, forward: 120, back: 160 },
    { ...REST, anchor: 1, cursor: SWITCH, enabled: true, forward: 160, back: 120 }
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 150

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)
  const column = ref<globalThis.HTMLElement | null>(null)
  const offsets = ref<number[]>([])

  const measure = () => {
    const anchors = column.value?.querySelectorAll<globalThis.HTMLElement>('[data-anchor]')
    if (!anchors?.length) return
    offsets.value = [...anchors].map((anchor) => anchor.offsetTop)
  }

  const { position } = useMockupCursor(stage, () => frame.value.cursor, column)

  const atRest = computed(() => frame.value.anchor === 0)

  const scrollStyle = computed(() => ({
    translate: `0 ${atRest.value ? 0 : LEAD - (offsets.value[frame.value.anchor] ?? 0)}px`
  }))

  const enabled = (key: string) => key !== 'image-processor' || frame.value.enabled

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null
  let observer: globalThis.ResizeObserver | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced) {
      step.value = target
      return
    }
    measure()
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onMounted(() => {
    observer = new globalThis.ResizeObserver(measure)
    if (column.value) observer.observe(column.value)
    measure()
  })

  onScopeDispose(() => {
    halt()
    observer?.disconnect()
  })
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    :fade="atRest ? 'bottom' : 'y'"
    class="[--mockup-fade-edge:20%] [--mockup-fade-start:74%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative"
    >
      <div
        ref="column"
        :style="scrollStyle"
        class="relative flex flex-col gap-(--spacing-sm) py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
      >
        <span
          data-anchor
          class="text-label-md text-(--text-default)"
        >
          Default Modules
        </span>

        <ShellMockupPart
          v-for="(module, index) in MODULES"
          :key="module.key"
          :order="index"
          :data-anchor="module.key === 'image-processor' || undefined"
        >
          <div
            :data-enabled="enabled(module.key) || null"
            class="flex items-start gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md) transition-colors duration-moderate-01 ease-productive-entrance data-enabled:border-(--primary) motion-reduce:transition-none"
          >
            <LegacySwitch
              :checked="enabled(module.key)"
              :disabled="module.locked"
              :data-cursor="module.key"
            />
            <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
              <span class="text-label-md text-(--text-default)">{{ module.title }}</span>
              <span class="text-body-xs text-(--text-muted)">{{ module.subtitle }}</span>
              <span
                v-if="module.locked"
                class="mt-(--spacing-xs) flex"
              >
                <Tag
                  label="Automatically enabled in all accounts."
                  icon="pi pi-lock"
                  severity="secondary"
                  size="small"
                />
              </span>
            </span>
          </div>
        </ShellMockupPart>

        <div class="flex flex-col gap-(--spacing-xs) pt-(--spacing-md)">
          <span class="text-label-md text-(--text-default)">Subscription modules</span>
          <span class="flex">
            <Button
              label="Contact sales"
              kind="outlined"
              size="medium"
              icon="pi pi-shopping-cart"
            />
          </span>
        </div>
      </div>

      <MockupCursor
        name="Bianca"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
