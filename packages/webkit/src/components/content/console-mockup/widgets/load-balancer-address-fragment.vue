<script setup lang="ts">
  import { computed } from 'vue'

  import IconButton from '../../../action/icon-button/icon-button.vue'
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import NumberInput from '../../../input/number-input/number-input.vue'
  import Select from '../../../input/select/index'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import LegacySwitch from '../parts/legacy-switch.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'

  defineOptions({ name: 'LoadBalancerAddressFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the form scrolls to the address weight and steps it up while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

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

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })

  const meta = computed(() => [
    { label: 'HTTP Port:', value: '80' },
    { label: 'HTTPS Port:', value: '443' },
    { label: 'Server Role:', value: 'primary' },
    { label: 'Weight:', value: String(frame.value.weight) }
  ])

  const shown = (value: unknown) => String(value)

  const FIELD_RING_CLASS =
    'flex rounded-(--shape-control) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-focused:ring-2 data-focused:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:16%] [--console-mockup-fade-start:80%]"
    column-class="flex flex-col gap-(--spacing-lg)"
    :active="active"
    :anchor="frame.anchor || null"
    :lead="24"
    observe
  >
    <ConsoleMockupShellItem
      :order="0"
      data-anchor
    >
      <div
        class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
      >
        <i
          class="az az-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted)"
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
          icon="az az-trash"
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
          :class="FIELD_RING_CLASS"
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
  </MockupScrollColumn>
</template>
