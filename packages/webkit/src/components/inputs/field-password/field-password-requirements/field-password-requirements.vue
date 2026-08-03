<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import type { PasswordRequirement } from '../password-requirements'

  defineOptions({
    name: 'FieldPasswordRequirements',
    inheritAttrs: false
  })

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

      // `key` is the stable identity a consumer removes a rule by; the label is localizable
      // and only stands in when a rule carries no key of its own.
      return { key: requirement.key || requirement.label, label: requirement.label, met }
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
        // `w-full`: the row spans the field, and the field keeps the width authority — the
        // chips wrap inside it instead of widening it.
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
      :key="requirement.key"
      :data-validated="requirement.met || null"
      :data-testid="`${testId}-chip`"
      class="inline-flex shrink-0 items-center justify-center gap-[var(--spacing-xxs)] min-h-5 p-[var(--spacing-xxs)] rounded-[var(--shape-elements)] leading-none text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none bg-[var(--bg-surface-raised)] text-[var(--text-muted)] data-[validated]:bg-[var(--success)] data-[validated]:text-[var(--text-default)]"
    >
      <!-- Two treatments, matching Figma, and nothing about either is configurable: a
           satisfied rule gets `var(--success)` plus the check glyph, an unsatisfied one gets
           `var(--bg-surface-raised)` and no glyph at all. The glyph is conditional, so an
           unsatisfied chip reserves no box and carries no empty space; the chip is therefore
           wider once it is satisfied, which is what the design shows. -->
      <i
        v-if="requirement.met"
        class="pi pi-check flex shrink-0 items-center justify-center size-[14px]"
        aria-hidden="true"
      />
      {{ requirement.label }}
    </span>
  </div>
</template>
