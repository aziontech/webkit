<script setup lang="ts">
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import RadioGroup from '../../../input/radio-group/radio-group.vue'
  import RadioGroupItem from '../../../input/radio-group/radio-group-item/radio-group-item.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'ObjectStorageAccessFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; read and write access is picked while it is, and set back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const OPTIONS = [
    {
      value: 'read_write',
      label: 'Read and write',
      description:
        'Workloads can serve objects and write new ones, such as uploads from a function.'
    },
    {
      value: 'read_only',
      label: 'Read only',
      description: 'Workloads can serve objects and cannot change them.'
    },
    {
      value: 'restricted',
      label: 'Restricted',
      description: 'No workload reaches the bucket. Access is through the API only.'
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    access: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'option-read_only', x: 0.9, y: 0.62 }
  const PICK: MockupCursorTarget = { key: 'option-read_write', x: 0.42, y: 0.5 }

  const REST = { cursor: IDLE, press: false, access: 'read_only' }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: PICK, forward: 160, back: 420 },
    { ...REST, cursor: PICK, press: true, forward: 620, back: 160 },
    { ...REST, cursor: PICK, press: true, access: 'read_write', forward: 140, back: 220 },
    { ...REST, cursor: PICK, access: 'read_write', forward: 180, back: 260 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:80%]"
    :active="active"
    :cursor="frame.cursor"
    cursor-name="Alex"
    :pressed="frame.press"
  >
    <div class="flex flex-col gap-(--spacing-sm) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col gap-(--spacing-2xs)">
          <FieldLabel>Workloads access</FieldLabel>
          <FieldDescription
            >The access level workloads have to the objects in this bucket.</FieldDescription
          >
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem
        v-for="(option, index) in OPTIONS"
        :key="option.value"
        :order="index + 1"
      >
        <div :data-cursor="`option-${option.value}`">
          <RadioGroup
            :model-value="frame.access"
            variant="card"
            name="object-storage-workloads-access"
          >
            <RadioGroupItem
              :value="option.value"
              :description="option.description"
              >{{ option.label }}</RadioGroupItem
            >
          </RadioGroup>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
