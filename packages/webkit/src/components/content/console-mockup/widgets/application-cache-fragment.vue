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

  defineOptions({ name: 'ApplicationCacheFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the form switches to override and scrolls through its fields while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const BEHAVIORS = [
    {
      value: 'honor',
      label: 'Honor cache policies',
      description:
        "Honor cache policies from the origin or define a new maximum cache TTL in Azion's data centers. If a TTL isn't received from the origin, cache will be maintained at a default TTL."
    },
    {
      value: 'override',
      label: 'Override cache behavior',
      description: "Customize the cache behavior by overriding the origin server's cache policies."
    }
  ]

  interface Frame {
    behavior: string
    anchor: number
    stale: boolean
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { behavior: 'honor', anchor: 0, stale: false, forward: 0, back: 0 },
    { behavior: 'override', anchor: 0, stale: false, forward: 200, back: 420 },
    { behavior: 'override', anchor: 1, stale: false, forward: 650, back: 420 },
    { behavior: 'override', anchor: 2, stale: false, forward: 900, back: 420 },
    { behavior: 'override', anchor: 2, stale: true, forward: 450, back: 300 },
    { behavior: 'override', anchor: 3, stale: true, forward: 800, back: 120 }
  ]

  const { frame, step, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:24%]"
    column-class="flex flex-col gap-(--spacing-lg)"
    :active="active"
    :anchor="step === 0 ? null : frame.anchor"
    :lead="72"
    observe
  >
    <div class="flex flex-col gap-(--spacing-xs)">
      <FieldLabel
        for="browser-max-age"
        required
        >Max Age</FieldLabel
      >
      <NumberInput
        id="browser-max-age"
        :model-value="600"
        size="medium"
        show-buttons
        aria-label="Browser Max Age"
      />
      <FieldDescription
        >Maximum time (in seconds) content can be cached by the browser.</FieldDescription
      >
    </div>

    <ConsoleMockupShellItem
      :order="0"
      data-anchor
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <span class="text-label-sm text-(--text-default)">Cache Behavior</span>
        <RadioGroup
          :model-value="frame.behavior"
          name="cache-behavior"
          aria-label="Cache Behavior"
        >
          <RadioGroupItem
            v-for="behavior in BEHAVIORS"
            :key="behavior.value"
            :value="behavior.value"
            :description="behavior.description ?? ''"
            >{{ behavior.label }}</RadioGroupItem
          >
        </RadioGroup>
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem
      :order="1"
      data-anchor
    >
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel
          for="cache-max-age"
          required
          >Max Age</FieldLabel
        >
        <NumberInput
          id="cache-max-age"
          :model-value="3600"
          size="medium"
          show-buttons
          aria-label="Max Age"
        />
        <FieldDescription
          >Maximum time (in seconds) content is cached in Azion's data centers. Minimum of 3
          seconds.</FieldDescription
        >
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem
      :order="2"
      data-anchor
    >
      <span class="flex items-start gap-(--spacing-sm)">
        <LegacySwitch :checked="frame.stale" />
        <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <span class="text-label-md text-(--text-default)">Stale cache</span>
          <span class="text-body-xs text-(--text-muted)">
            Enable stale cache to serve expired content temporarily while fetching updated content
            from the origin.
          </span>
        </span>
      </span>
    </ConsoleMockupShellItem>

    <div
      data-anchor
      class="flex flex-col gap-(--spacing-lg)"
    >
      <span class="flex items-start gap-(--spacing-sm)">
        <LegacySwitch :checked="true" />
        <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <span class="text-label-md text-(--text-default)">Large file optimization</span>
          <span class="text-body-xs text-(--text-muted)">
            Optimize caching for large files by splitting them into smaller fragments for efficient
            delivery.
          </span>
        </span>
      </span>
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel for="cache-offset">Offset (KB)</FieldLabel>
        <NumberInput
          id="cache-offset"
          :model-value="1024"
          size="medium"
          aria-label="Offset (KB)"
        />
        <FieldDescription
          >Specifies the fragment size (in KB) for large file optimization. Fixed at 1024
          KB.</FieldDescription
        >
      </div>
    </div>
  </MockupScrollColumn>
</template>
