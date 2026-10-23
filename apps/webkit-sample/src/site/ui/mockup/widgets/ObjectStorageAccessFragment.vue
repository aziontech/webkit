<script setup lang="ts">
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ObjectStorageAccessFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; read and write access is picked while it is, and set back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

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
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative"
    >
      <div class="flex flex-col gap-(--spacing-sm) py-(--spacing-xs)">
        <MockupPart :order="0">
          <div class="flex flex-col gap-(--spacing-xxs)">
            <Label label="Workloads access" />
            <HelperText label="The access level workloads have to the objects in this bucket." />
          </div>
        </MockupPart>

        <MockupPart
          v-for="(option, index) in OPTIONS"
          :key="option.value"
          :order="index + 1"
        >
          <div :data-cursor="`option-${option.value}`">
            <FieldRadioBlock
              :model-value="frame.access"
              :value="option.value"
              name="object-storage-workloads-access"
              :label="option.label"
              :description="option.description"
            />
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
