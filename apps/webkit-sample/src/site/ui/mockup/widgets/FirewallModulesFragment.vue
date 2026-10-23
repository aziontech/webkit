<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import LegacySwitch from '../LegacySwitch.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'FirewallModulesFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; Network Shield and then Web Application Firewall are switched on while it is, and back off after. */
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
      key: 'network',
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
    scrolled: boolean
    network: boolean
    waf: boolean
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { scrolled: false, network: false, waf: false, forward: 0, back: 0 },
    { scrolled: true, network: false, waf: false, forward: 200, back: 420 },
    { scrolled: true, network: true, waf: false, forward: 700, back: 420 },
    { scrolled: true, network: true, waf: true, forward: 520, back: 360 }
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 28

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const column = ref<globalThis.HTMLElement | null>(null)
  const anchorTop = ref(0)

  const measure = () => {
    anchorTop.value =
      column.value?.querySelector<globalThis.HTMLElement>('[data-anchor]')?.offsetTop ?? 0
  }

  const scrollStyle = computed(() => ({
    translate: `0 ${frame.value.scrolled ? LEAD - anchorTop.value : 0}px`
  }))

  const enabled = (key: string) => {
    if (key === 'network') return frame.value.network
    if (key === 'waf') return frame.value.waf
    return true
  }

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
    :fade="frame.scrolled ? 'y' : 'bottom'"
    class="[--mockup-fade-edge:16%] [--mockup-fade-start:74%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
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
        :data-anchor="module.key === 'network' || undefined"
      >
        <div
          :data-enabled="enabled(module.key) || null"
          class="flex items-start gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md) transition-colors duration-moderate-01 ease-productive-entrance data-enabled:border-(--primary) motion-reduce:transition-none"
        >
          <LegacySwitch
            :checked="enabled(module.key)"
            :disabled="module.locked"
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
                severity="info"
                size="small"
              />
            </span>
          </span>
        </div>
      </MockupPart>

      <span class="mt-(--spacing-sm) text-label-md text-(--text-default)">Debug Rules</span>
      <span class="flex items-start gap-(--spacing-sm)">
        <LegacySwitch :checked="true" />
        <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-md text-(--text-default)">Active</span>
          <span class="text-body-xs text-(--text-muted)">
            Rules that were successfully executed will be shown under the $traceback field in Data
            Streaming and Real-Time Events or the $stacktrace variable in GraphQL.
          </span>
        </span>
      </span>
    </div>
  </ShellMockup>
</template>
