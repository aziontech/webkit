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
    /** Overrides the satisfied glyph for this rule alone. Empty string renders none. */
    icon?: string
    /** Overrides the unmet-and-invalid glyph for this rule alone. Empty string renders none. */
    invalidIcon?: string
    /** Overrides the not-yet-satisfied glyph for this rule alone. Empty string renders none. */
    pendingIcon?: string
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
    /** Glyph for a rule not yet satisfied. Empty by default: nothing shows while typing. */
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
    pendingIcon: '',
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
      // A rule may override any of the three glyphs for itself; `''` means "render none",
      // so `??` (not `||`) is what lets an entry opt out without falling back to the prop.
      const icon =
        state === 'met'
          ? (requirement.icon ?? props.icon)
          : state === 'failed'
            ? (requirement.invalidIcon ?? props.invalidIcon)
            : (requirement.pendingIcon ?? props.pendingIcon)

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
        // `w-0 min-w-full`, not `w-full`: the row must fill the field but never size it.
        // A chip grows when its glyph arrives, which grows the row's max-content, and any
        // ancestor that sizes to content would pass that on to the input — the field
        // visibly changed width as rules started passing. `w-0` drops the row's own width
        // contribution to nothing while `min-w-full` still stretches it across the field,
        // so the width authority stays with the input and the label.
        // `contain: inline-size` is what lets the glyph be conditional AND the field hold
        // its width. A chip necessarily changes width when its glyph mounts, and without
        // containment that fed the ancestor's intrinsic width: measured 353.4px to 368.0px
        // on the input in an auto-width host as the rules started passing. Containment
        // computes this row's inline size without its contents, so it contributes nothing
        // upward and takes its width from the field instead: measured 203.0px to 203.0px.
        // `w-0 min-w-full` was tried first and does not work (the cyclic min-width is
        // resolved from the content). The field is therefore sized by its label and input,
        // never by the rule chips, and a rule showing no glyph leaves no gap.
        'flex w-full [contain:inline-size] flex-wrap content-center items-center gap-[var(--spacing-xs)]',
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
      <!-- The 14px box is ALWAYS rendered; only the glyph inside it is conditional. That
           is the one thing that keeps a chip a constant width, and a constant chip is the
           only way the field never changes width: measured in an auto-width host, mounting
           the box on demand took the input from 353.4px to 368.0px, and with the box
           reserved it stays at 368.0px. `w-0 min-w-full` and `contain: inline-size` were
           both tried on the row instead and neither helped, because the row's content
           still feeds the ancestor's intrinsic width. The cost is a small gap before the
           label while a rule shows no glyph, which is the price of the guarantee. Only
           `opacity` and `transform` animate; neither participates in layout. -->
      <i
        v-if="requirement.icon"
        :class="requirement.icon"
        class="flex shrink-0 items-center justify-center size-[14px] scale-75 opacity-0 transition-[opacity,transform] duration-fast-02 ease-productive-entrance group-data-[state=failed]:scale-100 group-data-[state=failed]:opacity-100 group-data-[state=met]:scale-100 group-data-[state=met]:opacity-100 group-data-[state=unmet]:scale-100 group-data-[state=unmet]:opacity-60 motion-reduce:transition-none"
        aria-hidden="true"
      />
      {{ requirement.label }}
    </span>
  </div>
</template>
