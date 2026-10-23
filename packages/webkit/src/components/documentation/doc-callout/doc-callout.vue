<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Message from '../../feedback/message/message.vue'

  // A Mintlify-style admonition on the webkit Message surface; geometry is Message's
  // own. Anatomy: a glyph plus prose (a sentence, or short paragraphs and a list), no
  // title row; DocProse stops at data-doc-chrome, so the prose rhythm is laid out here.
  // `tip` is the one severity-free kind: page surface and rule, emphasis on the glyph
  // alone; each override is important because Message's data-severity variant outranks it.
  defineOptions({ name: 'DocCallout', inheritAttrs: false })

  /** The admonition flavours an MDX author can write. */
  export type DocCalloutKind = 'note' | 'info' | 'tip' | 'check' | 'warning' | 'danger'

  interface Props {
    /** Which admonition this is; drives the severity color and the icon. */
    kind?: DocCalloutKind
    /** Fallback copy when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'note',
    label: ''
  })

  defineSlots<{
    /** The callout copy: prose with links and inline code, or paragraphs and a list, laid out by the callout since DocProse stops at its edge. */
    default(): unknown
  }>()

  const KINDS = {
    note: { severity: 'info', icon: 'pi pi-info-circle', neutral: false },
    info: { severity: 'info', icon: 'pi pi-info-circle', neutral: false },
    tip: { severity: 'info', icon: 'pi pi-lightbulb', neutral: true },
    check: { severity: 'success', icon: 'pi pi-check-circle', neutral: false },
    warning: { severity: 'warning', icon: 'pi pi-exclamation-triangle', neutral: false },
    danger: { severity: 'danger', icon: 'pi pi-times-circle', neutral: false }
  } as const

  const attrs = useAttrs()

  const preset = computed(() => KINDS[props.kind] ?? KINDS.note)

  // A consumer-supplied data-testid wins; otherwise the derived fallback. The kind
  // stays readable on data-kind, so a test can still target one flavour.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-callout')
</script>

<template>
  <Message
    v-bind="$attrs"
    data-doc-block
    data-doc-chrome
    :data-kind="kind"
    :data-neutral="preset.neutral || null"
    :severity="preset.severity"
    :icon="preset.icon"
    :data-testid="testId"
    class="data-[neutral]:border-(--border-default)! data-[neutral]:bg-(--bg-surface)! data-[neutral]:[&_i]:text-(--primary)!"
  >
    <!-- No weight in the prose: a strong that survived a paste is neutralised — bolding
         inside a callout emphasises against an emphasis. A link gives up the page's link
         ink for the box's own colour, so weight plus underline is its whole affordance.
         Copy and chip ink stay --text-default in every kind (measured 13.31:1–18.97:1 and
         10.05:1+). Block rhythm is set here: DocProse excludes data-doc-chrome subtrees. -->
    <div
      :data-kind="kind"
      :data-severity="preset.severity"
      :data-neutral="preset.neutral || null"
      class="text-(--text-default) [&_:is(p,ul,ol)+:is(p,ul,ol)]:pt-(--spacing-sm) [&_ul]:list-disc [&_ul]:pl-(--spacing-lg) [&_ol]:list-decimal [&_ol]:pl-(--spacing-lg) [&_li+li]:pt-(--spacing-xs) [&_strong]:font-normal [&_a]:font-normal [&_a]:text-inherit! [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-(--shape-elements) [&_code]:border [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-label-code-sm [&_code]:text-(--text-default) data-[severity=info]:[&_code]:border-(--info-border) data-[severity=info]:[&_code]:bg-(--info-contrast)/10 data-[severity=success]:[&_code]:border-(--success-border) data-[severity=success]:[&_code]:bg-(--success-contrast)/10 data-[severity=warning]:[&_code]:border-(--warning-border) data-[severity=warning]:[&_code]:bg-(--warning-contrast)/10 data-[severity=danger]:[&_code]:border-(--danger-border) data-[severity=danger]:[&_code]:bg-(--danger-contrast)/10 data-[neutral]:[&_code]:border-(--border-default)! data-[neutral]:[&_code]:bg-(--bg-hover)!"
    >
      <slot>{{ label }}</slot>
    </div>
  </Message>
</template>
