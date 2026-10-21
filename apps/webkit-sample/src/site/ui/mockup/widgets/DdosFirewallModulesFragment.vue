<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import LegacySwitch from '../LegacySwitch.vue'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'DdosFirewallModulesFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the modules scroll to Network Shield, which is switched on beside the always-on DDoS module while it is, and back off after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const MODULES = [
    {
      key: 'ddos',
      title: 'DDoS Protection Unmetered',
      description:
        'Mitigate large and complex network, transport, presentation, and application-layer DDoS attacks.',
      locked: true
    },
    {
      key: 'functions',
      title: 'Functions',
      description: 'Build low-latency functions that run close to users.',
      locked: false
    },
    {
      key: 'network-shield',
      title: 'Network Shield',
      description:
        'Create lists to configure a programmable security perimeter for inbound and outbound traffic.',
      locked: false
    },
    {
      key: 'waf',
      title: 'Web Application Firewall',
      description: 'Protect applications against threats and attacks.',
      locked: false
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    shield: boolean
    anchor: number
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'ddos', x: 8, y: 3 }
  const SWITCH: MockupCursorTarget = { key: 'network-shield', x: 0.6, y: 0.6 }

  const REST = { cursor: IDLE, press: false, shield: false, anchor: 0 }
  const SCROLLED = { ...REST, anchor: 1 }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...SCROLLED, forward: 160, back: 420 },
    { ...SCROLLED, cursor: SWITCH, forward: 650, back: 420 },
    { ...SCROLLED, cursor: SWITCH, press: true, forward: 520, back: 120 },
    { ...SCROLLED, cursor: SWITCH, press: true, shield: true, forward: 120, back: 160 },
    { ...SCROLLED, cursor: SWITCH, shield: true, forward: 160, back: 120 }
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 28

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

  const enabled = (key: string) =>
    key === 'network-shield' ? frame.value.shield : key !== 'functions'

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
    class="[--mockup-fade-edge:18%] [--mockup-fade-start:78%]"
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
        <span class="text-label-md text-(--text-default)">Modules</span>

        <MockupPart
          v-for="(module, index) in MODULES"
          :key="module.key"
          :order="index"
          data-anchor
        >
          <div
            :data-enabled="enabled(module.key) || null"
            :data-locked="module.locked || null"
            class="flex items-start gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md) transition-colors duration-moderate-01 ease-productive-entrance data-enabled:border-(--primary) data-locked:border-[color-mix(in_srgb,var(--primary)_40%,transparent)] motion-reduce:transition-none"
          >
            <LegacySwitch
              :checked="enabled(module.key)"
              :disabled="module.locked"
              :data-cursor="module.key"
            />
            <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
              <span class="text-label-md text-(--text-default)">{{ module.title }}</span>
              <span class="text-body-xs text-(--text-muted)">{{ module.description }}</span>
              <span
                v-if="module.locked"
                class="mt-(--spacing-xs) flex"
              >
                <Tag
                  label="Automatically enabled in all accounts"
                  icon="pi pi-lock"
                  severity="secondary"
                  size="small"
                />
              </span>
            </span>
          </div>
        </MockupPart>
      </div>

      <MockupCursor
        name="Rafael"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
