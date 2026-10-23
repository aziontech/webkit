<script setup lang="ts">
  import { computed } from 'vue'

  import Select from '../../../inputs/select/index'

  defineOptions({ name: 'MockupSelect' })

  export type MockupSelectSide = 'bottom' | 'top'

  interface Props {
    /** The committed value the trigger shows and the list marks as selected. */
    value: string
    /** The list's options, in order. */
    options?: string[]
    /** Whether the list is open under the trigger. */
    open?: boolean
    /** Index of the option the pointer rests on; a negative index shows none. */
    highlight?: number
    /** Whether the trigger shows its focus ring. */
    focused?: boolean
    /** Which side of the trigger the list opens on. */
    side?: MockupSelectSide
    /** Accessible name of the trigger. */
    ariaLabel?: string
    /** Id of the trigger, for a label that points at it. */
    controlId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    open: false,
    highlight: -1,
    focused: false,
    side: 'bottom',
    ariaLabel: '',
    controlId: ''
  })

  defineSlots<{
    /** Content before the trigger's value, such as a variable sign. */
    prefix?(): unknown
  }>()

  const highlightStyle = computed(() => ({
    translate: `0 ${Math.max(props.highlight, 0) * 100}%`
  }))

  const shown = (value: unknown) => String(value)
</script>

<template>
  <span
    :data-focused="focused || null"
    :data-open="open || null"
    class="relative flex w-full rounded-(--shape-elements) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-focused:ring-2 data-focused:ring-offset-2 data-open:z-1 motion-reduce:transition-none"
  >
    <Select
      :model-value="value"
      :open="open"
      size="medium"
      :display-value="shown"
    >
      <Select.Trigger
        :id="controlId || undefined"
        :aria-label="ariaLabel"
      >
        <template
          v-if="$slots['prefix']"
          #iconLeft
        >
          <slot name="prefix" />
        </template>
      </Select.Trigger>

      <Transition
        enter-from-class="scale-90 opacity-0"
        enter-active-class="origin-(--popup-origin) transition-[scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        leave-to-class="scale-90 opacity-0"
        leave-active-class="origin-(--popup-origin) transition-[scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      >
        <span
          v-if="open && options.length"
          :data-side="side"
          class="absolute inset-x-0 z-1 flex flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xxs) py-(--spacing-xs) shadow-(--shadow-xs) data-[side=bottom]:top-full data-[side=bottom]:mt-1 data-[side=bottom]:[--popup-origin:top] data-[side=top]:bottom-full data-[side=top]:mb-1 data-[side=top]:[--popup-origin:bottom]"
        >
          <span class="relative isolate flex flex-col">
            <span
              :data-visible="highlight >= 0 || null"
              :style="highlightStyle"
              class="absolute inset-x-0 top-0 -z-1 h-8 rounded-(--shape-elements) bg-(--bg-hover) opacity-0 transition-[translate,opacity] duration-moderate-01 ease-productive-entrance data-visible:opacity-100 motion-reduce:transition-none"
            />
            <Select.Option
              v-for="(option, index) in options"
              :key="option"
              :value="option"
              :data-cursor="`option-${index}`"
            >
              {{ option }}
            </Select.Option>
          </span>
        </span>
      </Transition>
    </Select>
  </span>
</template>
