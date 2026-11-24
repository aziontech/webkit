<script setup lang="ts">
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import NumberInput from '../../../input/number-input/number-input.vue'
  import RadioGroup from '../../../input/radio-group/radio-group.vue'
  import RadioGroupItem from '../../../input/radio-group/radio-group-item/radio-group-item.vue'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import LegacySwitch from '../parts/legacy-switch.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'

  defineOptions({ name: 'DataStreamSamplingFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; sampling is switched on and its rate brought down while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

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

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:20%] [--console-mockup-fade-start:74%]"
    column-class="flex flex-col gap-(--spacing-lg)"
    :active="active"
    :anchor="frame.anchor || null"
    :lead="28"
    observe
  >
    <ConsoleMockupShellItem
      :order="0"
      data-anchor
    >
      <div class="flex flex-col gap-(--spacing-sm)">
        <span class="text-label-sm text-(--text-default)">Option</span>
        <RadioGroup
          model-value="all"
          variant="card"
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
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem
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
              <FieldDescription
                >Percentage of data to be collected. A value of 100% collects all data, while lower
                values collect a proportional sample.</FieldDescription
              >
            </div>
          </div>
        </Transition>
      </div>
    </ConsoleMockupShellItem>
  </MockupScrollColumn>
</template>
