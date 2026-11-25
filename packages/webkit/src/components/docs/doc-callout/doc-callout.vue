<script setup lang="ts">
  import { computed, reactive, ref, useAttrs } from 'vue'

  import { useInlineCodeCopy } from '../../../composables/use-inline-code-copy'
  import Alert from '../../feedback/alert/alert.vue'
  import DocProseCopyTip from '../doc-prose/parts/doc-prose-copy-tip.vue'

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
    note: { severity: 'info', icon: 'az az-circle-info', neutral: false },
    info: { severity: 'info', icon: 'az az-circle-info', neutral: true },
    tip: { severity: 'info', icon: 'az az-lightbulb', neutral: true },
    check: { severity: 'success', icon: 'az az-circle-check', neutral: false },
    warning: { severity: 'warning', icon: 'az az-triangle-alert', neutral: false },
    danger: { severity: 'danger', icon: 'az az-circle-x', neutral: false }
  } as const

  const attrs = useAttrs()
  const copyEl = ref<HTMLElement | null>(null)
  const copy = reactive(useInlineCodeCopy(copyEl))

  const preset = computed(() => VARIANTS[props.variant] ?? VARIANTS.note)

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-callout')

  const ROOT_CLASS =
    'bg-(--bg-surface)! data-[neutral]:border-(--border-default)! data-[neutral]:[&_i[aria-hidden=true]]:text-(--primary)! ' +
    'not-data-[neutral]:data-[severity=info]:[&_i[aria-hidden=true]]:text-(--info-mark)! ' +
    'data-[severity=success]:[&_i[aria-hidden=true]]:text-(--success-mark)! data-[severity=warning]:[&_i[aria-hidden=true]]:text-(--warning-mark)! ' +
    'data-[severity=danger]:[&_i[aria-hidden=true]]:text-(--danger-mark)!'

  const COPY_CLASS =
    'text-body-sm tracking-normal text-(--text-default) [&_:is(p,ul,ol)+:is(p,ul,ol)]:pt-(--spacing-sm) [&_ul]:list-disc [&_ul]:ps-(--spacing-lg) [&_ol]:list-decimal [&_ol]:ps-(--spacing-lg) ' +
    '[&_li+li]:pt-(--spacing-xs) [&_strong]:font-normal [&_a]:font-normal [&_a]:text-inherit! [&_a]:underline [&_a]:underline-offset-2 [&_code:not(pre_*,[data-testid])]:rounded-(--shape-control) ' +
    '[&_code:not(pre_*,[data-testid])]:inset-ring [&_code:not(pre_*,[data-testid])]:forced-colors:border [&_code:not(pre_*,[data-testid])]:px-(--spacing-2xs) ' +
    '[&_code:not(pre_*,[data-testid])]:text-label-code-sm [&_code:not(pre_*,[data-testid])]:bg-(--bg-hover) ' +
    '[&_code:not(pre_*,[data-testid])]:text-(--text-default) [&_code:not(pre_*,[data-testid])]:wrap-anywhere [&_code:not(pre_*,[data-testid])]:box-decoration-clone ' +
    'data-[severity=info]:[&_code:not(pre_*,[data-testid])]:inset-ring-(--info-border) ' +
    'data-[severity=success]:[&_code:not(pre_*,[data-testid])]:inset-ring-(--success-border) ' +
    'data-[severity=warning]:[&_code:not(pre_*,[data-testid])]:inset-ring-(--warning-border) ' +
    'data-[severity=danger]:[&_code:not(pre_*,[data-testid])]:inset-ring-(--danger-border) ' +
    'data-[neutral]:[&_code:not(pre_*,[data-testid])]:inset-ring-(--border-default)! ' +
    '[&_:not(a,pre)>code:not([data-testid])]:cursor-pointer [&_:not(a,pre)>code:not([data-testid])]:hover:ring-1 [&_:not(a,pre)>code:not([data-testid])]:hover:ring-(--border-default) ' +
    '[&_code[data-command]]:outline-none [&_code[data-command]:focus-visible]:ring-2 [&_code[data-command]:focus-visible]:ring-(--ring-color)'
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
    :class="ROOT_CLASS"
  >
    <div
      ref="copyEl"
      data-code-copy
      :data-variant="variant"
      :data-severity="preset.severity"
      :data-neutral="preset.neutral || null"
      :class="COPY_CLASS"
    >
      <slot>{{ label }}</slot>
    </div>
    <DocProseCopyTip
      :copy="copy"
      :test-id="testId"
    />
  </Alert>
</template>
