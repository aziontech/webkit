<script setup lang="ts">
  import Message from '@aziontech/webkit/message'
  import { computed } from 'vue'

  /**
   * A Mintlify-style admonition — Note, Tip, Warning, Danger, Check, Info,
   * Highlight — rendered on the webkit Message surface the docs frame specifies,
   * so the severity color, border, icon and radius come from the design system
   * rather than from this layer.
   *
   * EVERY SEVERITY KIND LEADS WITH ITS OWN NAME. The anatomy is a title row and
   * then the copy: "Note", "Tip", "Warning" on the first line, the sentence the
   * reader came for on the second. A glyph and a tint are a signal the eye has to
   * decode; the word is the same signal already decoded, and it gives the reader
   * a fixed place to look to decide whether this aside is for them before they
   * read it. An author with something sharper to say passes `title`, which
   * replaces the kind's name — the row is the same either way. Only `highlight`
   * ships titleless: it makes no claim about stakes, so it has no name to lead
   * with, and an author who wants a title there writes one.
   *
   * NEUTRAL KINDS CARRY NO SEVERITY: `highlight` and `tip`. The other five say
   * something about the copy's stakes — this is safe, this will bite you — and an
   * aside that only wants to draw the eye had to borrow one of those claims,
   * which is how a friendly shortcut ends up painted the same green as a
   * confirmed success. So both take the page's own surface and rule
   * (`--bg-surface` + `--border-default`) and spend their whole emphasis on the
   * glyph, in `--primary` — the Azion orange, which is the same colour in both
   * themes. `tip` keeps its lightbulb; `highlight` keeps its sparkles. Both still
   * route through `Message`, so the geometry and the copy layout stay identical
   * to their five siblings; only the surface, the rule, the glyph and the copy
   * ink are overridden — the copy in `--text-muted`, the volume an aside that
   * claims nothing speaks at — and each with `!`, because Message paints them
   * from a `data-severity` variant that outranks a plain utility.
   *
   * Message lays its copy out inside a paragraph, so a callout body is inline
   * prose: text, links, inline code, and several sentences. Blocks that need
   * their own box (lists, fenced code) belong outside the callout — and none of
   * that prose is ever bold, including a `**run**` that survived a paste: the
   * copy neutralises `strong` back to its own weight.
   *
   * IT IS PADDED WELL PAST THE MESSAGE DEFAULT. `Message`'s own inset is sized
   * for a one-line banner in an app — a validation result under a field, a status
   * strip on a page. A docs callout is a paragraph the reader stops and reads, so
   * it needs the air a paragraph needs; at the banner inset the copy crowds the
   * rule and the block reads as an alert rather than as prose. The `!` is load
   * bearing: Message paints its horizontal inset from a `data-[size]` variant,
   * which outranks a plain utility whatever the class order.
   */
  defineOptions({ name: 'DocCallout' })

  /** The admonition flavours an MDX author can write. */
  export type DocCalloutKind =
    'note' | 'info' | 'tip' | 'check' | 'warning' | 'danger' | 'highlight'

  interface Props {
    /** Which admonition this is; drives the severity color, icon and default title. */
    kind?: DocCalloutKind
    /** Lead-in shown in the same row as the glyph. Replaces the kind's own name. */
    title?: string
    /** Fallback copy when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'note',
    title: '',
    label: ''
  })

  defineSlots<{
    /** The callout copy: inline prose, links and inline code. */
    default(): unknown
  }>()

  const KINDS = {
    note: { severity: 'info', icon: 'pi pi-info-circle', title: 'Note', neutral: false },
    info: { severity: 'info', icon: 'pi pi-info-circle', title: 'Info', neutral: false },
    tip: { severity: 'info', icon: 'pi pi-lightbulb', title: 'Tip', neutral: true },
    check: { severity: 'success', icon: 'pi pi-check-circle', title: 'Check', neutral: false },
    warning: {
      severity: 'warning',
      icon: 'pi pi-exclamation-triangle',
      title: 'Warning',
      neutral: false
    },
    danger: { severity: 'danger', icon: 'pi pi-times-circle', title: 'Danger', neutral: false },
    highlight: { severity: 'info', icon: 'pi pi-sparkles', title: '', neutral: true }
  } as const

  const preset = computed(() => KINDS[props.kind] ?? KINDS.note)
  const resolvedTitle = computed(() => props.title.trim() || preset.value.title)
  const hasTitle = computed(() => resolvedTitle.value.length > 0)
</script>

<template>
  <Message
    data-doc-block
    data-doc-chrome
    :data-kind="kind"
    :data-neutral="preset.neutral || null"
    :severity="preset.severity"
    :icon="preset.icon"
    :data-testid="`doc-callout-${kind}`"
    class="items-start p-(--spacing-md)! data-[neutral]:border-(--border-default)! data-[neutral]:bg-(--bg-surface)! data-[neutral]:[&_i]:text-(--primary)!"
  >
    <!-- NO WEIGHT ANYWHERE. A callout is already the loudest thing on the page
         (its own fill, its own rule, a coloured glyph); bolding a line inside it
         emphasises against an emphasis, which reads as shouting rather than as
         hierarchy. The title separates from the copy by sitting on its own row.

         ONLY THE TITLE ROW IS THE SEVERITY'S INK — the `--<severity>-contrast`
         half of the pair whose other half fills the box, the same colour as the
         glyph beside it. That row is the signal: glyph, name and ink all saying
         one thing, in one line. THE COPY IS `--text-default`, the page's own
         prose ink, for every kind that carries a severity. It is the sentence
         the reader came for, and colouring it too spends the severity twice:
         after the first line the tint has already been read, so tinted prose
         stops being a signal and just becomes prose that is harder to read.
         Neutral ink over a tint is also the stronger contrast of the two, which
         is the right way round: the long line is the legible one. Measured over
         the six fills in both themes, the copy lands 13.31:1–18.97:1, where the
         title's severity ink runs 5.05:1–9.22:1 — enough for a two-word label,
         thin for a paragraph.

         THE NEUTRAL KINDS ARE THE EXCEPTION — `tip` and `highlight`, the two
         that claim nothing about stakes. Muted is what an aside sounds like
         when it is not claiming anything: it draws the eye with the orange
         glyph and the rule, then speaks at the volume of a footnote rather
         than of the page's own prose. The five severity kinds keep the page's
         ink, because their copy is the thing the tint promised. It costs
         contrast (3.95:1 light, 5.01:1 dark) and the `!` is load bearing,
         since the default ink beside it is a plain utility. -->
    <span
      v-if="hasTitle"
      :data-kind="kind"
      :data-severity="preset.severity"
      :data-neutral="preset.neutral || null"
      class="block data-[severity=info]:text-(--info-contrast) data-[severity=success]:text-(--success-contrast) data-[severity=warning]:text-(--warning-contrast) data-[severity=danger]:text-(--danger-contrast) data-[neutral]:text-(--text-default)!"
    >
      {{ resolvedTitle }}
    </span>
    <span
      :data-kind="kind"
      :data-title="hasTitle || null"
      :data-neutral="preset.neutral || null"
      class="block text-(--text-default) data-[neutral]:text-(--text-muted)! data-[title]:pt-(--spacing-xxs) [&_strong]:font-normal [&_code]:rounded-(--shape-flat) [&_code]:border [&_code]:border-(--border-default) [&_code]:bg-(--bg-hover) [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-label-code-sm [&_code]:text-(--text-default)"
    >
      <slot>{{ label }}</slot>
    </span>
  </Message>
</template>
