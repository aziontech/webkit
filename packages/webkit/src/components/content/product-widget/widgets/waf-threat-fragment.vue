<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import LegacySwitch from '../parts/legacy-switch.vue'
  import MockupCursor from '../parts/mockup-cursor.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'WafThreatFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; SQL Injection's sensitivity is picked from its list and File Upload is switched on while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const THREATS = [
    {
      key: 'sql-injection',
      title: 'SQL Injection',
      description:
        'Detect attempts to insert a SQL query via the input data from the client to the application.'
    },
    {
      key: 'remote-file-inclusion',
      title: 'Remote File Inclusions (RFI)',
      description:
        'Detect attempts to include a remote file, usually through a script on the web server.'
    },
    {
      key: 'directory-traversal',
      title: 'Directory Traversal',
      description:
        'Prevent exploiting insufficient security sanitizing of user-supplied input file names, so that characters representing "traverse to parent directory" are passed through to the file APIs.'
    },
    {
      key: 'cross-site-scripting',
      title: 'Cross-Site Scripting (XSS)',
      description: 'Prevents the injection of client-side scripts into pages viewed by visitors.'
    },
    {
      key: 'file-upload',
      title: 'File Upload',
      description: 'Detect attempts to upload files.'
    },
    {
      key: 'evading-tricks',
      title: 'Evading Tricks',
      description: 'Prevent the use of encoding tricks to evade protection mechanisms.'
    }
  ]

  const SENSITIVITIES = [
    'Sensitivity Highest',
    'Sensitivity High',
    'Sensitivity Medium',
    'Sensitivity Low',
    'Sensitivity Lowest'
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    raised: boolean
    anchor: number
    upload: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'sensitivity', x: 0.82, y: 2.4 }
  const TRIGGER: MockupCursorTarget = { key: 'sensitivity', x: 0.35, y: 0.6 }
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })
  const SWITCH: MockupCursorTarget = { key: 'upload', x: 0.6, y: 0.6 }

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    raised: false,
    anchor: 0,
    upload: false
  }

  const PICKING = { ...REST, focused: true, open: true }
  const RAISED = { ...REST, raised: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: TRIGGER, forward: 120, back: 420 },
    { ...REST, cursor: TRIGGER, press: true, focused: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(2), highlight: 2, forward: 160, back: 300 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 460, back: 420 },
    { ...PICKING, cursor: option(1), highlight: 1, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(1),
      highlight: 1,
      press: true,
      raised: true,
      forward: 120,
      back: 220
    },
    { ...RAISED, cursor: option(1), focused: true, forward: 200, back: 260 },
    { ...RAISED, cursor: option(1), anchor: 2, forward: 360, back: 420 },
    { ...RAISED, cursor: option(1), anchor: 4, forward: 650, back: 420 },
    { ...RAISED, cursor: SWITCH, anchor: 4, forward: 520, back: 420 },
    { ...RAISED, cursor: SWITCH, anchor: 4, press: true, forward: 520, back: 120 },
    { ...RAISED, cursor: SWITCH, anchor: 4, press: true, upload: true, forward: 120, back: 160 },
    { ...RAISED, cursor: SWITCH, anchor: 4, upload: true, forward: 160, back: 120 }
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

  const enabled = (key: string) => key !== 'file-upload' || frame.value.upload

  const sensitivity = (key: string) =>
    key === 'sql-injection' && frame.value.raised ? 'Sensitivity High' : 'Sensitivity Medium'

  const picking = (key: string) => key === 'sql-injection'

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
        <span class="text-label-md text-(--text-default)">Threat Type Configuration</span>

        <ShellMockupPart
          v-for="(threat, index) in THREATS"
          :key="threat.key"
          :order="Math.min(index, 3)"
          :data-open="(picking(threat.key) && frame.open) || null"
          class="relative data-open:z-1"
          data-anchor
        >
          <div
            :data-enabled="enabled(threat.key) || null"
            class="flex items-start gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md) transition-colors duration-moderate-01 ease-productive-entrance data-enabled:border-(--primary) motion-reduce:transition-none"
          >
            <LegacySwitch
              :checked="enabled(threat.key)"
              :data-cursor="threat.key === 'file-upload' ? 'upload' : undefined"
            />
            <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
              <span class="text-label-md text-(--text-default)">{{ threat.title }}</span>
              <span class="text-body-xs text-(--text-muted)">{{ threat.description }}</span>
              <span class="mt-(--spacing-xs) flex">
                <MockupSelect
                  :value="sensitivity(threat.key)"
                  :options="picking(threat.key) ? SENSITIVITIES : []"
                  :open="picking(threat.key) && frame.open"
                  :highlight="picking(threat.key) ? frame.highlight : -1"
                  :focused="picking(threat.key) && frame.focused"
                  :data-cursor="picking(threat.key) ? 'sensitivity' : undefined"
                  :aria-label="`${threat.title} sensitivity`"
                />
              </span>
            </span>
          </div>
        </ShellMockupPart>
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
