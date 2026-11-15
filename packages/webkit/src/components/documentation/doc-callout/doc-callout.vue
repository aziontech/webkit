<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Alert from '../../feedback/alert/alert.vue'

  defineOptions({ name: 'DocCallout', inheritAttrs: false })

  /** The admonition flavours an MDX author can write. */
  export type DocCalloutVariant = 'note' | 'info' | 'tip' | 'check' | 'warning' | 'danger'

  export interface DocCalloutProps {
    /** Which admonition this is; drives the severity color and the icon. */
    variant?: DocCalloutVariant
    /** Fallback copy when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<DocCalloutProps>(), {
    variant: 'note',
    label: ''
  })

  defineSlots<{
    /** The callout copy: prose with links and inline code, or paragraphs and a list, laid out by the callout since DocProse stops at its edge. */
    default(): unknown
  }>()

  const VARIANTS = {
    note: { severity: 'info', icon: 'ai ai-circle-info', neutral: false },
    info: { severity: 'info', icon: 'ai ai-circle-info', neutral: false },
    tip: { severity: 'info', icon: 'ai ai-lightbulb', neutral: true },
    check: { severity: 'success', icon: 'ai ai-circle-check', neutral: false },
    warning: { severity: 'warning', icon: 'ai ai-triangle-alert', neutral: false },
    danger: { severity: 'danger', icon: 'ai ai-circle-x', neutral: false }
  } as const

  const attrs = useAttrs()

  const preset = computed(() => VARIANTS[props.variant] ?? VARIANTS.note)

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-callout')
</script>

<template>
  <Alert
    v-bind="$attrs"
    data-doc-block
    data-doc-chrome
    :data-variant="variant"
    :data-neutral="preset.neutral || null"
    :severity="preset.severity"
    :icon="preset.icon"
    :data-testid="testId"
    class="data-[neutral]:border-(--border-default)! data-[neutral]:bg-(--bg-surface)! data-[neutral]:[&_i]:text-(--primary)!"
  >
    <div
      :data-variant="variant"
      :data-severity="preset.severity"
      :data-neutral="preset.neutral || null"
      class="text-(--text-default) [&_:is(p,ul,ol)+:is(p,ul,ol)]:pt-(--spacing-sm) [&_ul]:list-disc [&_ul]:ps-(--spacing-lg) [&_ol]:list-decimal [&_ol]:ps-(--spacing-lg) [&_li+li]:pt-(--spacing-xs) [&_strong]:font-normal [&_a]:font-normal [&_a]:text-inherit! [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-(--shape-control) [&_code]:border [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-label-code-sm [&_code]:text-(--text-default) data-[severity=info]:[&_code]:border-(--info-border) data-[severity=info]:[&_code]:bg-(--info-foreground)/10 data-[severity=success]:[&_code]:border-(--success-border) data-[severity=success]:[&_code]:bg-(--success-foreground)/10 data-[severity=warning]:[&_code]:border-(--warning-border) data-[severity=warning]:[&_code]:bg-(--warning-foreground)/10 data-[severity=danger]:[&_code]:border-(--danger-border) data-[severity=danger]:[&_code]:bg-(--danger-foreground)/10 data-[neutral]:[&_code]:border-(--border-default)! data-[neutral]:[&_code]:bg-(--bg-hover)!"
    >
      <slot>{{ label }}</slot>
    </div>
  </Alert>
</template>
