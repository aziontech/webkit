<script setup lang="ts">
  import Message from '@aziontech/webkit/message'
  import { computed } from 'vue'

  import { renderInline } from '../lib/inline'

  /**
   * A Mintlify-style admonition — Note, Tip, Warning, Danger, Check, Info —
   * rendered on the webkit Message surface the docs frame specifies, so the
   * severity color, border, icon and radius come from the design system rather
   * than from this layer.
   *
   * THE ANATOMY IS A GLYPH AND THE COPY, NOTHING ELSE. A callout used to lead
   * with its kind's own name — "Note", "Tip", "Warning" on a first row, the
   * sentence under it — and an author could replace that name with a `title`.
   * Both are gone. The name repeated what the glyph and the tint already say,
   * cost a line of vertical space on every aside, and pushed the sentence the
   * reader came for down the box; a titled callout also stopped reading as an
   * interruption in the prose and started reading as a little card. One row of
   * inline prose beside the glyph is the whole component, for every kind.
   *
   * ONE KIND CARRIES NO SEVERITY: `tip`. The other five say something about the
   * copy's stakes — this is safe, this will bite you — and an aside that only
   * wants to draw the eye had to borrow one of those claims, which is how a
   * friendly shortcut ends up painted the same green as a confirmed success. So
   * `tip` takes the page's own surface and rule (`--bg-surface` +
   * `--border-default`) and spends its whole emphasis on the glyph, in
   * `--primary` — the Azion orange, which is the same colour in both themes. It
   * still routes through `Message`, so the geometry and the copy layout stay
   * identical to its five siblings; only the surface, the rule and the glyph are
   * overridden, and each with `!`, because Message paints them from a
   * `data-severity` variant that outranks a plain utility.
   *
   * THERE WAS A SECOND NEUTRAL KIND, `highlight` — the same surface, the same
   * rule, the same orange emphasis, a sparkles glyph instead of a lightbulb.
   * Two names for one aside is a choice an author has to make and cannot get
   * right, and the pages proved it: `<Highlight>` and `<Tip>` were used
   * interchangeably for the same kind of sentence. It is gone; that sentence is
   * written `<Tip>`.
   *
   * A LINK AND AN INLINE CODE CHIP BELONG TO THE BOX THEY SIT IN. A link takes
   * the copy's own ink (`text-inherit`, so it is `--text-default` in every kind)
   * and carries its affordance in the underline plus medium weight — the
   * page's blue link ink over a tinted fill is the one place the callout would
   * read as three colours at once. A code chip takes the severity family too: a
   * 10% wash of `--<severity>-contrast` for the fill and `--<severity>-border`
   * for the rule, so it reads a step deeper than the box instead of punching the
   * page's neutral chip through the tint. Its ink stays `--text-default`, the
   * copy's — measured over the eight fills that lands 10.05:1–14.43:1, where the
   * severity ink on the same chip drops to 4.03:1 in dark danger. `tip` has no
   * family to draw from, so its chip is the page's own (`--border-default` +
   * `--bg-hover`); its link needs no adjustment, because the copy it inherits is
   * already `--text-default`.
   *
   * Message lays its copy out inside a paragraph, so a callout body is inline
   * prose: text, links, inline code, and several sentences. Blocks that need
   * their own box (lists, fenced code) belong outside the callout — and none of
   * that prose is ever bold, including a `**run**` that survived a paste: the
   * copy neutralises `strong` back to its own weight.
   *
   * ITS GEOMETRY IS MESSAGE'S OWN, UNOVERRIDDEN. The banner shape a docs
   * callout wants turns out to be the shape `Message` already ships: one row,
   * `flex-wrap` + `items-center` on the box so a trailing control could sit
   * beside the copy, `items-start` + `min-w-0` on the glyph/copy pair inside so
   * the glyph pins to the first line of a paragraph that wraps, a
   * `--spacing-sm` gap on both, `break-words`, the button radius, and the
   * medium inset (`px-(--spacing-sm)` / `py-1.5`, `min-h-9`) at 14px copy. An
   * earlier version paid `p-(--spacing-md)!` for "the air a paragraph needs"
   * and got a block that read as a card sitting in the prose instead of as an
   * aside inside it. Nothing here overrides the geometry — only the neutral
   * kind's surface, rule and glyph.
   */
  defineOptions({ name: 'DocCallout' })

  /** The admonition flavours an MDX author can write. */
  export type DocCalloutKind = 'note' | 'info' | 'tip' | 'check' | 'warning' | 'danger'

  interface Props {
    /** Which admonition this is; drives the severity color and the icon. */
    kind?: DocCalloutKind
    /** Copy, when it comes from data rather than a slot. Rendered as inline prose. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'note',
    label: ''
  })

  /*
   * `label` IS PROSE, NOT A STRING — the same decision DocFrame's caption makes. A note
   * that names a file, a header or a command has a code span in it, and a callout whose
   * copy comes from data (a page that renders one callout per row of a list) has no slot
   * to write that span in. So the prop renders through the layer's own inline renderer,
   * and a backtick in it becomes the same `code` element a paragraph's would.
   *
   * A functional component rather than the `v-for` a slot would use: inline markdown
   * yields bare strings for the text between the markup, and a string handed to `is` is
   * read as a component NAME, not as text — the copy would come out empty. Defined once
   * so its identity is stable across renders.
   */
  const LabelText = () => renderInline(props.label)

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

  const preset = computed(() => KINDS[props.kind] ?? KINDS.note)
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
    class="data-[neutral]:border-(--border-default)! data-[neutral]:bg-(--bg-surface)! data-[neutral]:[&_i]:text-(--primary)!"
  >
    <!-- NO WEIGHT IN THE PROSE. A callout is already the loudest thing on the
         page (its own fill, its own rule, a coloured glyph); bolding a line
         inside it emphasises against an emphasis, which reads as shouting
         rather than as hierarchy — so a `strong` that survived a paste is
         neutralised. A link is the one exception: it gives up the page's link
         ink to sit in the box's own colour, so medium weight plus the underline
         is all the affordance it has left.

         THE COPY IS `--text-default`, the page's own prose ink, for every kind
         — the five that carry a severity and the neutral `tip` alike. It is the
         sentence the reader came for, and tinting it would spend the severity
         twice: the fill and the glyph have already been read by the time the eye
         reaches the words, so tinted prose stops being a signal and just becomes
         prose that is harder to read. Neutral ink over a tint is also the
         stronger contrast of the two, which is the right way round for the only
         line in the box. Measured over the six fills in both themes, the copy
         lands 13.31:1–18.97:1.

         `tip` USED TO SPEAK IN `--text-muted`, on the theory that an aside
         claiming nothing about stakes should also speak quieter. It read as an
         aside that had been dimmed rather than one that was calm, and it was the
         only copy in the component below AA (3.95:1 light, 5.01:1 dark) — a box
         whose whole job is to draw the eye, set in the page's quietest ink. The
         surface, the rule and the glyph already say it carries no severity; the
         words say what they say at the same volume as every other callout. -->
    <span
      :data-kind="kind"
      :data-severity="preset.severity"
      :data-neutral="preset.neutral || null"
      class="block text-(--text-default) [&_strong]:font-normal [&_a]:font-normal [&_a]:text-inherit! [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-(--shape-elements) [&_code]:border [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-label-code-sm [&_code]:text-(--text-default) data-[severity=info]:[&_code]:border-(--info-border) data-[severity=info]:[&_code]:bg-(--info-contrast)/10 data-[severity=success]:[&_code]:border-(--success-border) data-[severity=success]:[&_code]:bg-(--success-contrast)/10 data-[severity=warning]:[&_code]:border-(--warning-border) data-[severity=warning]:[&_code]:bg-(--warning-contrast)/10 data-[severity=danger]:[&_code]:border-(--danger-border) data-[severity=danger]:[&_code]:bg-(--danger-contrast)/10 data-[neutral]:[&_code]:border-(--border-default)! data-[neutral]:[&_code]:bg-(--bg-hover)!"
    >
      <slot><LabelText /></slot>
    </span>
  </Message>
</template>
