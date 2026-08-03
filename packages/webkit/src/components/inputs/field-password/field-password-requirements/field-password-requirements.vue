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

  interface Props {
    /** Rules rendered as chips, one per entry. An empty array renders nothing. */
    requirements?: PasswordRequirement[]
    /** Caption that opens the row and names the group for assistive tech. */
    title?: string
    /** Value every rule is evaluated against. */
    value?: string
    /** Id the caption carries so the group can point at it with aria-labelledby. */
    titleId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    requirements: () => [],
    title: 'Must contain:',
    value: '',
    titleId: ''
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

      return { label: requirement.label, met }
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
      :data-testid="`${testId}-chip`"
      class="group inline-flex shrink-0 items-center justify-center gap-[var(--spacing-xxs)] min-h-5 p-[var(--spacing-xxs)] rounded-[var(--shape-elements)] leading-none text-label-sm bg-[var(--bg-surface-raised)] text-[var(--text-muted)] transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[validated]:bg-[var(--success)] data-[validated]:text-[var(--text-default)]"
    >
      <!-- The glyph is always in flow, never mounted on satisfaction, so a chip is the
           same width whether its rule is met or not. Inserting it on demand is what made
           the chip grow, push every chip after it, and re-wrap the row mid-animation. It
           animates on `opacity` and `transform` only: both are composited and neither
           takes part in layout, so no motion here can change a size or move a line
           break. The box is reserved with a fixed `size`, not by the icon's content. -->
      <i
        class="pi pi-check flex shrink-0 items-center justify-center size-[14px] text-[var(--success-contrast)] scale-75 opacity-0 transition-[opacity,transform] duration-fast-02 ease-productive-entrance group-data-[validated]:scale-100 group-data-[validated]:opacity-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
      {{ requirement.label }}
    </span>
  </div>
</template>
