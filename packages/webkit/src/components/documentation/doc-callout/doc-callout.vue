<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Message from '../../feedback/message/message.vue'

  // A Mintlify-style admonition on the webkit Message surface; geometry is Message's
  // own, unoverridden. Anatomy is a glyph plus one row of inline prose — no title row.
  // `tip` is the one severity-free kind: it takes the page's own surface and rule and
  // spends its emphasis on the glyph alone, each override marked important because
  // Message paints those from a data-severity variant that outranks a plain utility.
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
    /** The callout copy: inline prose, links and inline code. */
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
         inside a callout emphasises against an emphasis. A link gives up the page's
         link ink to sit in the box's own colour, so weight plus underline is its whole
         affordance. Copy and chip ink stay the page's default for every kind: measured,
         13.31:1–18.97:1 for copy, 10.05:1+ for chips (severity ink fell to 4.03:1). -->
    <span
      :data-kind="kind"
      :data-severity="preset.severity"
      :data-neutral="preset.neutral || null"
      class="block text-(--text-default) [&_strong]:font-normal [&_a]:font-normal [&_a]:text-inherit! [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-(--shape-elements) [&_code]:border [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-label-code-sm [&_code]:text-(--text-default) data-[severity=info]:[&_code]:border-(--info-border) data-[severity=info]:[&_code]:bg-(--info-contrast)/10 data-[severity=success]:[&_code]:border-(--success-border) data-[severity=success]:[&_code]:bg-(--success-contrast)/10 data-[severity=warning]:[&_code]:border-(--warning-border) data-[severity=warning]:[&_code]:bg-(--warning-contrast)/10 data-[severity=danger]:[&_code]:border-(--danger-border) data-[severity=danger]:[&_code]:bg-(--danger-contrast)/10 data-[neutral]:[&_code]:border-(--border-default)! data-[neutral]:[&_code]:bg-(--bg-hover)!"
    >
      <slot>{{ label }}</slot>
    </span>
  </Message>
</template>
