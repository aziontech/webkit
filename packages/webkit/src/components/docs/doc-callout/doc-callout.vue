<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useInlineCodeCopy } from '../../../composables/use-inline-code-copy'
  import { usePortalLocale } from '../../../composables/use-translate'
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
    note: { severity: 'info', icon: 'az az-circle-info', neutral: false },
    info: { severity: 'info', icon: 'az az-circle-info', neutral: false },
    tip: { severity: 'info', icon: 'az az-lightbulb', neutral: true },
    check: { severity: 'success', icon: 'az az-circle-check', neutral: false },
    warning: { severity: 'warning', icon: 'az az-triangle-alert', neutral: false },
    danger: { severity: 'danger', icon: 'az az-circle-x', neutral: false }
  } as const

  const attrs = useAttrs()
  const copyEl = ref<HTMLElement | null>(null)
  const { tipFor, tipLabel, tipLeft, tipTop, announcement } = useInlineCodeCopy(copyEl)
  const portalLocale = usePortalLocale()

  const preset = computed(() => VARIANTS[props.variant] ?? VARIANTS.note)

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-callout')
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
      ref="copyEl"
      data-code-copy
      :data-variant="variant"
      :data-severity="preset.severity"
      :data-neutral="preset.neutral || null"
      class="text-(--text-default) [&_:is(p,ul,ol)+:is(p,ul,ol)]:pt-(--spacing-sm) [&_ul]:list-disc [&_ul]:ps-(--spacing-lg) [&_ol]:list-decimal [&_ol]:ps-(--spacing-lg) [&_li+li]:pt-(--spacing-xs) [&_strong]:font-normal [&_a]:font-normal [&_a]:text-inherit! [&_a]:underline [&_a]:underline-offset-2 [&_code:not(pre_*)]:rounded-(--shape-control) [&_code:not(pre_*)]:inset-ring [&_code:not(pre_*)]:forced-colors:border [&_code:not(pre_*)]:px-(--spacing-2xs) [&_code:not(pre_*)]:text-label-code-sm [&_code:not(pre_*)]:text-(--text-default) [&_code:not(pre_*)]:wrap-anywhere [&_code:not(pre_*)]:box-decoration-clone data-[severity=info]:[&_code:not(pre_*)]:inset-ring-(--info-border) data-[severity=info]:[&_code:not(pre_*)]:bg-(--info-foreground)/10 data-[severity=success]:[&_code:not(pre_*)]:inset-ring-(--success-border) data-[severity=success]:[&_code:not(pre_*)]:bg-(--success-foreground)/10 data-[severity=warning]:[&_code:not(pre_*)]:inset-ring-(--warning-border) data-[severity=warning]:[&_code:not(pre_*)]:bg-(--warning-foreground)/10 data-[severity=danger]:[&_code:not(pre_*)]:inset-ring-(--danger-border) data-[severity=danger]:[&_code:not(pre_*)]:bg-(--danger-foreground)/10 data-[neutral]:[&_code:not(pre_*)]:inset-ring-(--border-default)! data-[neutral]:[&_code:not(pre_*)]:bg-(--bg-hover)! [&_:not(a,pre)>code:not([data-testid])]:cursor-pointer [&_:not(a,pre)>code:not([data-testid])]:hover:ring-1 [&_:not(a,pre)>code:not([data-testid])]:hover:ring-(--border-default) [&_code[data-command]]:outline-none [&_code[data-command]:focus-visible]:ring-2 [&_code[data-command]:focus-visible]:ring-(--ring-color)"
    >
      <slot>{{ label }}</slot>
    </div>
    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <span
          v-if="tipFor"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          role="tooltip"
          :data-testid="`${testId}__copy-tip`"
          :style="{ left: `${tipLeft}px`, top: `${tipTop}px` }"
          class="pointer-events-none fixed z-(--z-control-overlay) -translate-x-1/2 -translate-y-[calc(100%+var(--spacing-2xs))] rounded-(--shape-control) bg-(--bg-contrast) px-(--spacing-xs) py-(--spacing-2xs) text-body-xs whitespace-nowrap text-(--text-contrast)"
          >{{ tipLabel }}</span
        >
      </Transition>
      <span
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        aria-live="polite"
        class="sr-only"
        :data-testid="`${testId}__copy-status`"
        >{{ announcement }}</span
      >
    </Teleport>
  </Alert>
</template>
