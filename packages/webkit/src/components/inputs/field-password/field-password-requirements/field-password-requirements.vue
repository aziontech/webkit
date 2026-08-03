<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'

  defineOptions({
    name: 'FieldPasswordRequirements',
    inheritAttrs: false
  })

  /**
   * One password rule. The rule carries its test, not its result: this component owns
   * the value, so it evaluates every rule against the current one and re-renders as the
   * user types. A pre-computed boolean would freeze the chips at whatever the consumer
   * passed, which is decoration rather than validation.
   */
  export interface PasswordRequirement {
    /** Text shown inside the chip. */
    label: string
    /** Pattern or predicate the current value must satisfy for the rule to be met. */
    test: RegExp | ((value: string) => boolean)
  }

  /** Per-chip state. `failed` is an unmet rule once the field is showing errors. */
  export type PasswordRequirementState = 'unmet' | 'met' | 'failed'

  interface Props {
    /** Rules rendered as chips, one per entry. An empty array renders nothing. */
    requirements?: PasswordRequirement[]
    /** Caption that opens the row and names the group for assistive tech. */
    title?: string
    /** Value every rule is evaluated against. */
    value?: string
    /** Id the caption carries so the group can point at it with aria-labelledby. */
    titleId?: string
    /** Switches every unmet rule to the error treatment; set it after a failed submit. */
    invalid?: boolean
    /** Glyph for a satisfied rule. */
    icon?: string
    /** Glyph for a rule not yet satisfied. */
    pendingIcon?: string
    /** Glyph for an unmet rule while `invalid` is set. */
    invalidIcon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    requirements: () => [],
    title: 'Must contain:',
    value: '',
    titleId: '',
    invalid: false,
    icon: 'pi pi-check',
    pendingIcon: 'pi pi-circle',
    invalidIcon: 'pi pi-times'
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-password-requirements'
  )

  /**
   * A `g`-flagged pattern carries `lastIndex` between calls, so `test()` would alternate
   * true/false on the same value. Rebuild it without the flag.
   */
  const evaluated = computed(() =>
    props.requirements.map((requirement: PasswordRequirement) => {
      const met =
        typeof requirement.test === 'function'
          ? requirement.test(props.value)
          : (requirement.test.global
              ? new RegExp(requirement.test.source, requirement.test.flags.replace('g', ''))
              : requirement.test
            ).test(props.value)

      const state: PasswordRequirementState = met ? 'met' : props.invalid ? 'failed' : 'unmet'
      const icon =
        state === 'met' ? props.icon : state === 'failed' ? props.invalidIcon : props.pendingIcon

      return { label: requirement.label, met, state, icon }
    })
  )
</script>

<template>
  <div
    v-bind="attrs"
    role="group"
    :aria-labelledby="titleId || undefined"
    :data-testid="testId"
    :class="
      cn(
        'flex w-full flex-wrap content-center items-center gap-[var(--spacing-xs)]',
        attrs.class as string | undefined
      )
    "
  >
    <span
      :id="titleId || undefined"
      :data-testid="`${testId}-title`"
      class="shrink-0 leading-none text-label-sm text-[var(--text-default)]"
    >
      {{ title }}
    </span>
    <span
      v-for="requirement in evaluated"
      :key="requirement.label"
      :data-validated="requirement.met || null"
      :data-state="requirement.state"
      :data-testid="`${testId}-chip`"
      class="group inline-flex shrink-0 items-center justify-center gap-[var(--spacing-xxs)] min-h-5 p-[var(--spacing-xxs)] rounded-[var(--shape-elements)] leading-none text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=unmet]:bg-[var(--bg-surface-raised)] data-[state=unmet]:text-[var(--text-muted)] data-[state=met]:bg-[var(--success)] data-[state=met]:text-[var(--text-default)] data-[state=failed]:bg-[var(--danger)] data-[state=failed]:text-[var(--danger-contrast)]"
    >
      <!-- Every state carries a glyph, so the box is never blank and a chip is the same
           width whichever state it is in. Mounting the glyph only on satisfaction is what
           made a chip grow, push the row along, and re-wrap it mid-transition; leaving the
           box empty for unmet rules read as a gap before the label. Only `opacity` and
           `transform` animate: both composited, neither in layout, so no motion here can
           change a size or move a line break. -->
      <i
        :class="requirement.icon"
        class="flex shrink-0 items-center justify-center size-[14px] scale-75 opacity-60 transition-[opacity,transform] duration-fast-02 ease-productive-entrance group-data-[state=failed]:scale-100 group-data-[state=failed]:opacity-100 group-data-[state=met]:scale-100 group-data-[state=met]:opacity-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
      {{ requirement.label }}
    </span>
  </div>
</template>
