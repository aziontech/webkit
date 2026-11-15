<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import NumberInput from '../../../input/number-input/number-input.vue'
  import Select from '../../../input/select/index'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import LegacySwitch from '../parts/legacy-switch.vue'

  defineOptions({ name: 'LoadBalancerAddressFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the form scrolls to the address weight and steps it up while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  interface Frame {
    anchor: number
    weight: number
    focused: boolean
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { anchor: 0, weight: 1, focused: false, forward: 0, back: 0 },
    { anchor: 1, weight: 1, focused: false, forward: 200, back: 420 },
    { anchor: 1, weight: 1, focused: true, forward: 650, back: 300 },
    { anchor: 1, weight: 2, focused: true, forward: 480, back: 300 },
    { anchor: 1, weight: 3, focused: true, forward: 420, back: 300 },
    { anchor: 1, weight: 3, focused: false, forward: 620, back: 300 }
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 24

  const wanted = () => props.active && (props.hovered || !canHover.value)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const columnEl = ref<globalThis.HTMLElement | null>(null)
  const offsets = ref<number[]>([0, 0])

  const measure = () => {
    const anchors = columnEl.value?.querySelectorAll<globalThis.HTMLElement>('[data-anchor]')
    if (!anchors?.length) return
    offsets.value = [...anchors].map((anchor) => anchor.offsetTop)
  }

  const atRest = computed(() => frame.value.anchor === 0)

  const scrollStyle = computed(() => ({
    translate: `0 ${atRest.value ? 0 : LEAD - (offsets.value[frame.value.anchor] ?? 0)}px`
  }))

  const meta = computed(() => [
    { label: 'HTTP Port:', value: '80' },
    { label: 'HTTPS Port:', value: '443' },
    { label: 'Server Role:', value: 'primary' },
    { label: 'Weight:', value: String(frame.value.weight) }
  ])

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
    if (reduced.value) {
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
    if (columnEl.value) observer.observe(columnEl.value)
    measure()
  })

  onScopeDispose(() => {
    halt()
    observer?.disconnect()
  })

  const shown = (value: unknown) => String(value)
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    shell="legacy"
    :fade="atRest ? 'bottom' : 'y'"
    class="[--console-mockup-fade-edge:16%] [--console-mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="columnEl"
      :style="scrollStyle"
      class="relative flex flex-col gap-(--spacing-lg) py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
    >
      <ConsoleMockupShellItem
        :order="0"
        data-anchor
      >
        <div
          class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
        >
          <i
            class="ai ai-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
            <span class="truncate text-body-sm text-(--text-default)">origin-aws.example.com</span>
            <span class="flex flex-wrap gap-x-(--spacing-xs)">
              <span
                v-for="pair in meta"
                :key="pair.label"
                class="flex gap-(--spacing-2xs)"
              >
                <span class="text-body-xs text-(--text-muted)">{{ pair.label }}</span>
                <span class="text-label-sm text-(--text-default)">{{ pair.value }}</span>
              </span>
            </span>
          </span>
          <IconButton
            icon="ai ai-trash"
            variant="outline"
            size="small"
            ariaLabel="Remove address"
          />
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="1">
        <span class="flex items-center gap-(--spacing-sm)">
          <span class="text-label-sm text-(--text-default)">Load Balancer Settings</span>
          <span class="h-0 flex-1 border-t border-(--border-default)" />
        </span>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem
        :order="2"
        data-anchor
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <FieldLabel for="address-server-role">Server Role</FieldLabel>
          <Select
            model-value="Primary"
            size="medium"
            :display-value="shown"
          >
            <Select.Trigger
              id="address-server-role"
              aria-label="Server Role"
            />
          </Select>
          <FieldDescription
            >Define the role of the server in the load balancing setup.</FieldDescription
          >
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="3">
        <div class="flex flex-col gap-(--spacing-xs)">
          <FieldLabel for="address-weight">Weight</FieldLabel>
          <span
            :data-focused="frame.focused || null"
            class="flex rounded-(--shape-control) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-focused:ring-2 data-focused:ring-offset-2 motion-reduce:transition-none"
          >
            <NumberInput
              id="address-weight"
              :model-value="frame.weight"
              size="medium"
              show-buttons
              aria-label="Weight"
            />
          </span>
          <FieldDescription>Higher weights allocate more traffic to this address.</FieldDescription>
        </div>
      </ConsoleMockupShellItem>

      <span class="flex items-center gap-(--spacing-sm)">
        <LegacySwitch :checked="true" />
        <span class="text-label-md text-(--text-default)">Active</span>
      </span>
    </div>
  </ConsoleMockupShell>
</template>
