<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import FieldLabel from '../../../inputs/field/field-label/field-label.vue'
  import HelperText from '../../../inputs/helper-text/helper-text.vue'
  import NumberInput from '../../../inputs/number-input/number-input.vue'
  import RadioGroup from '../../../inputs/radio-group/radio-group.vue'
  import RadioGroupItem from '../../../inputs/radio-group/radio-group-item/radio-group-item.vue'
  import LegacySwitch from '../parts/legacy-switch.vue'
  import ShellMockup from '../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'DataStreamSamplingFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; sampling is switched on and its rate brought down while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const OPTIONS = [
    {
      value: 'all',
      label: 'All Current and Future Workloads',
      description:
        'By selecting the All Current and Future Workloads option, you can activate the Sampling option.'
    },
    {
      value: 'filtered',
      label: 'Filter Workloads',
      description: 'Select specific Workloads to filter the data collected by this stream.'
    }
  ]

  interface Frame {
    anchor: number
    sampling: boolean
    rate: number | null
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { anchor: 0, sampling: false, rate: null, forward: 0, back: 0 },
    { anchor: 1, sampling: false, rate: null, forward: 200, back: 420 },
    { anchor: 1, sampling: true, rate: null, forward: 650, back: 420 },
    { anchor: 1, sampling: true, rate: 100, forward: 320, back: 300 },
    { anchor: 1, sampling: true, rate: 10, forward: 900, back: 360 }
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 28

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
    if (reduced.value || !canHover.value) {
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
      ref="columnEl"
      :style="scrollStyle"
      class="relative flex flex-col gap-(--spacing-lg) py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
    >
      <ShellMockupPart
        :order="0"
        data-anchor
      >
        <div class="flex flex-col gap-(--spacing-sm)">
          <span class="text-label-sm text-(--text-default)">Option</span>
          <RadioGroup
            model-value="all"
            kind="card"
            name="data-stream-workloads"
            aria-label="Option"
          >
            <RadioGroupItem
              v-for="choice in OPTIONS"
              :key="choice.value"
              :value="choice.value"
              :description="choice.description"
              >{{ choice.label }}</RadioGroupItem
            >
          </RadioGroup>
        </div>
      </ShellMockupPart>

      <ShellMockupPart
        :order="1"
        data-anchor
      >
        <div class="flex flex-col">
          <span class="flex items-start gap-(--spacing-sm)">
            <LegacySwitch :checked="frame.sampling" />
            <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <span class="text-label-md text-(--text-default)">Sampling</span>
              <span class="text-body-xs text-(--text-muted)">
                Enable sampling to collect a percentage of the data instead of the entire dataset,
                optimizing resource usage.
              </span>
            </span>
          </span>

          <Transition
            enter-from-class="-translate-y-1 opacity-0"
            enter-active-class="transition-[opacity,translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
            leave-to-class="-translate-y-1 opacity-0"
            leave-active-class="transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          >
            <div
              v-if="frame.rate !== null"
              class="overflow-hidden [interpolate-size:allow-keywords]"
            >
              <div class="flex flex-col gap-(--spacing-xs) pt-(--spacing-lg)">
                <FieldLabel for="data-stream-sampling-rate">Sampling Rate (%)</FieldLabel>
                <NumberInput
                  id="data-stream-sampling-rate"
                  :model-value="frame.rate"
                  :min="0"
                  :max="100"
                  size="medium"
                  aria-label="Sampling Rate (%)"
                />
                <HelperText
                  label="Percentage of data to be collected. A value of 100% collects all data, while lower values collect a proportional sample."
                />
              </div>
            </div>
          </Transition>
        </div>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>
