<script setup lang="ts">
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { FormValue } from '../parts/form-value'

  defineOptions({
    name: 'Switch',
    inheritAttrs: false
  })

  /** Visual variant of the switch. */
  export type SwitchKind = 'default' | 'privacy'

  interface Props {
    /** Visual variant. Privacy renders a lock icon inside the handle. */
    kind?: SwitchKind
    /** Moves focus to the switch once, when it mounts. */
    autofocus?: boolean
    /** Disables interaction and applies the disabled tokens. */
    disabled?: boolean
    /** Marks the control invalid: sets aria-invalid and the danger border. An enclosing Field's invalid sets it too. */
    invalid?: boolean
    /** Form field name: while on, a hidden input submits `on` under this name, like a native checkbox. */
    name?: string
  }
  export type SwitchProps = Props

  const props = withDefaults(defineProps<Props>(), {
    kind: 'default',
    autofocus: false,
    disabled: false,
    invalid: false,
    name: ''
  })

  /** Toggled-on state. Bind with `v-model`. */
  const model = defineModel<boolean>({ default: false })

  const attrs = useAttrs()

  const {
    controlId,
    describedBy,
    labelledBy,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    labelledBy: () => attrs['aria-labelledby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-switch')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  const isChecked = computed(() => model.value === true)

  const buttonRef = ref<globalThis.HTMLButtonElement | null>(null)

  onMounted(() => {
    if (props.autofocus) buttonRef.value?.focus()
  })

  function onToggle() {
    if (isDisabled.value) return
    model.value = !isChecked.value
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (isDisabled.value) return
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      onToggle()
    }
  }
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    role="switch"
    :id="controlId"
    :aria-describedby="describedBy"
    :aria-labelledby="attrs['aria-label'] ? undefined : labelledBy"
    :aria-invalid="isInvalid || undefined"
    :aria-required="isRequired || undefined"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled || undefined"
    :disabled="isDisabled"
    :data-testid="testId"
    :data-kind="kind"
    :data-checked="isChecked || null"
    :data-disabled="isDisabled || null"
    :data-invalid="isInvalid || null"
    :class="attrs.class"
    class="group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-(--shape-elements) border border-(--border-input) bg-(--bg-surface) px-0.5 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) hover:shadow-[inset_0_0_0_999px_var(--bg-hover)] data-[invalid]:not-data-[checked]:border-(--danger-border) data-[checked]:border-transparent data-[checked]:bg-(--accent) forced-colors:border-[CanvasText] forced-colors:data-[checked]:border-[Highlight] data-[disabled]:cursor-not-allowed data-[disabled]:border-(--border-input) data-[disabled]:bg-(--bg-disabled) data-[disabled]:hover:shadow-none after:absolute after:inset-[min(0rem,calc(50%-12px))] pointer-coarse:after:inset-[min(0rem,calc(50%-22px))]"
    v-bind="passthroughAttrs"
    @click="onToggle"
    @keydown="onKeydown"
  >
    <span
      aria-hidden="true"
      class="pointer-events-none relative inline-flex h-4 w-4 items-center justify-center rounded-(--radius) bg-(--text-muted) transition-transform duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none group-data-[checked]:translate-x-3.5 rtl:group-data-[checked]:-translate-x-3.5 group-data-[checked]:bg-(--color-base-white) group-data-[disabled]:bg-(--text-disabled) forced-colors:forced-color-adjust-none forced-colors:bg-[CanvasText] forced-colors:group-data-[checked]:bg-[Highlight] forced-colors:group-data-[disabled]:bg-[GrayText]"
      :data-testid="`${testId}__handle`"
    >
      <template v-if="kind === 'privacy'">
        <i
          aria-hidden="true"
          :data-testid="`${testId}__lock`"
          class="ai ai-lock text-body-xxs leading-none text-(--bg-surface) group-data-[checked]:hidden"
        />
        <i
          aria-hidden="true"
          :data-testid="`${testId}__lock-open`"
          class="ai ai-lock-open hidden text-body-xxs leading-none text-(--color-base-black) group-data-[checked]:inline"
        />
      </template>
    </span>
    <FormValue
      :name="name"
      :value="isChecked"
      :disabled="isDisabled"
    />
  </button>
</template>
