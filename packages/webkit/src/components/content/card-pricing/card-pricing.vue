<script setup lang="ts">
  // CardPricing — one tier of a pricing table.
  //
  // What it is called, what it costs, what that price includes, and the one action
  // that moves the account onto it. The card owns the typographic hierarchy of a price
  // — an OVERLINE plan name, the amount as the headline figure, the billing caveat
  // under it in muted body copy — so a row of tiers reads as one comparison instead of
  // three differently-typeset cards.
  //
  // ── `slotPosition` IS THE COMPOSITION AXIS ──
  //
  // `bottom` — the compact tier. Name, a `medium` amount and the caveat stack at the
  // top, the action follows, the slot sits under it. The card is sized by its own
  // content, for a row a reader scans.
  //
  // `middle` — the full tier. The amount becomes the `large` headline figure, the
  // caveat moves up to `body-md`, the slot GROWS to fill the card, and the action is
  // pinned to the bottom edge. That is what puts a row of `middle` cards' buttons on
  // one line whatever each tier's feature list holds — `justify-between` plus the grid's
  // own stretch, not a hand-tuned margin per tier.
  //
  // It carried a `min-h-[483px]` floor as well, and that floor was the bug: a grid row
  // already stretches every card to the tallest one, so the only thing a fixed floor adds
  // is the difference between it and the content — 110px of dead air between the last
  // bullet and the button, in every card, on the page the number was picked for. The
  // height a row of cards should have is the height of its tallest card; nothing else
  // knows that number, least of all a literal in this file (and an arbitrary px length is
  // forbidden besides — DESIGN.md § Forbidden). A lone `middle` card is still not tiny:
  // the pricing region floors at `min-h-16` and the slot at `min-h-40`.
  //
  // `kind` decides only whether the card draws its own surface (`contained`) or sits on
  // the one behind it (`transparent`). It never changes the composition.
  //
  // ── THE PLAN NAME IS AN OVERLINE ──
  //
  // `text-overline-md` on an `<h3>`: the token already carries the display face, the
  // uppercase transform and the widest tracking step, so "PRO" reads as a LABEL on the
  // card rather than as a title competing with the price beneath it. It stays an `<h3>`
  // for the document outline — the tier IS the section heading — while looking like an
  // overline, which is exactly what the token is for.
  //
  // This flipped once: the card briefly used `text-heading-md` in sentence case, on the
  // argument that the console names a tier in sentence case everywhere else. The design
  // (`3605:2260`) settles it as the overline, so the divergence is closed rather than
  // recorded.
  //
  // ── ONE PROSE REGION, UNDER THE PRICE ──
  //
  // Name (+ tag), amount, then ONE muted paragraph — the pricing caveat. The card used
  // to carry a second paragraph above the amount as well, and with `aligned` reserving a
  // band for each, a row of tiers showed two two-line muted blocks around every price
  // doing the same visual job. The Figma component (`3605:2260`) has a single prose
  // region, `Pricing Details`, and it sits below the amount — so that is the one the
  // card keeps. A tier's positioning sentence belongs to whatever the consumer puts in
  // the slot, not to a second caveat band.
  //
  // ── `aligned` — A ROW OF CARDS READS AS A COMPARISON, NOT THREE CARDS ──
  //
  // The caveat is content-sized by default, which is right for one card and wrong for
  // three side by side: a tier with a two-line caveat and a tier with none push their
  // feature lists onto different lines, and the reader's eye has to re-find the row on
  // every column. Nothing about that is fixable by the consumer — the region is inside
  // this component.
  //
  // `aligned` reserves the caveat's band so the feature list starts on the same line in
  // every card of the row, whether or not the tier fills it. The reservation is in `lh`
  // (the region's OWN line box), not pixels, so it follows the type token instead of
  // hard-coding a height that a scale change would silently break.
  //
  // The band is `3lh`, and that number comes from the design, which fixes it at 64px:
  // `body-md` is a 22px line box, so three lines is 66px — the nearest whole line to the
  // design — and two is 44px, twenty short. It shipped as `2lh` and the shortfall was
  // invisible until a tier's caveat actually ran to three lines: at the region's 256px
  // measure a 53-character sentence does, it overflowed the reserved band, and it pushed
  // that one column's feature list 22px below the other two. A prop whose only job is to
  // align a row cannot fail on the copy the row is for, so the reservation is the design's
  // band and not the shortest copy that happened to fit it.
  //
  // It is opt-in because reserving empty lines is wrong for a lone card. Set it on EVERY
  // card in the row — a row where one card opts out is a row that does not align. A caveat
  // that runs past three lines still pushes the row down, like any overflow; that is the
  // honest failure, and the alternative (clipping) hides copy the reader needs.
  //
  // ── VARIANTS ON `data-*`, READ THROUGH NAMED GROUPS ──
  //
  // The two axes live on the root as `data-slot-position` / `data-kind`, and every
  // region reads them via `group-data-[…]/card:`. NAMED groups, so a consumer's own
  // `.group` wrapper cannot resolve against these classes. This replaces the
  // `computed(() => [...])` class presets the file used to carry — variants belong on
  // the element, not in a JS dictionary (`.claude/rules/styling.md`).
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Tag from '../../tag/tag.vue'
  import Currency from '../currency/currency.vue'

  defineOptions({
    name: 'CardPricing',
    inheritAttrs: false
  })

  /** Which composition the card is — see the block comment above. */
  export type CardPricingSlotPosition = 'bottom' | 'middle'
  /** Whether the card draws its own surface. */
  export type CardPricingKind = 'contained' | 'transparent'

  interface CardPricingProps {
    /** plan Title. */
    planTitle?: string
    /** pricing Details. */
    pricingDetails?: string
    /** show Pricing Details. */
    showPricingDetails?: boolean
    /** show Tag. */
    showTag?: boolean
    /** tag Label. */
    tagLabel?: string
    /** Reserves the caveat's band so a row of cards aligns row-for-row. Set it on every card in the row. */
    aligned?: boolean
    /** slot Position. */
    slotPosition?: CardPricingSlotPosition
    /** card Style. */
    kind?: CardPricingKind
    /** value. */
    value?: string
    /** prefix. */
    prefix?: string
    /** suffix. */
    suffix?: string
    /** show Prefix. */
    showPrefix?: boolean
    /** show Suffix. */
    showSuffix?: boolean
    /** action Label. */
    actionLabel?: string
  }

  const props = withDefaults(defineProps<CardPricingProps>(), {
    planTitle: 'Pro',
    pricingDetails: '',
    showPricingDetails: true,
    showTag: false,
    tagLabel: 'Popular',
    aligned: false,
    slotPosition: 'bottom',
    kind: 'contained',
    value: '20',
    prefix: '$',
    suffix: '/ mon',
    showPrefix: true,
    showSuffix: true,
    actionLabel: 'Label'
  })

  defineSlots<{
    actions?: () => unknown
    default?: () => unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'content-card-pricing')

  const isMiddle = computed(() => props.slotPosition === 'middle')

  // The headline figure grows with the composition: a fact on a compact card
  // (`medium`), the card's own headline on the full one (`large`).
  const currencySize = computed(() => (isMiddle.value ? 'large' : 'medium'))

  // `showPrefix` / `showSuffix` are the card's switches; Currency itself hides a part
  // by receiving an empty string, so the booleans are resolved here rather than
  // duplicated as a second pair of props on Currency.
  const currencyPrefix = computed(() => (props.showPrefix ? props.prefix : ''))
  const currencySuffix = computed(() => (props.showSuffix ? props.suffix : ''))
</script>

<template>
  <article
    v-bind="$attrs"
    :data-testid="testId"
    :data-slot-position="slotPosition"
    :data-kind="kind"
    :data-aligned="aligned || null"
    class="group/card flex w-full flex-col items-start overflow-clip p-(--spacing-lg) data-[slot-position=bottom]:gap-(--spacing-lg) data-[slot-position=middle]:justify-between data-[kind=contained]:rounded-(--shape-card) data-[kind=contained]:border-(length:--border-width-default) data-[kind=contained]:border-(--border-default) data-[kind=contained]:bg-(--bg-surface)"
  >
    <!-- The upper block. On `middle` it is the growing region (the slot inside it
         takes the slack), which is what leaves the action pinned to the card's
         bottom edge. On `bottom` it is content-sized. -->
    <div
      class="flex w-full flex-col items-start group-data-[slot-position=bottom]/card:shrink-0 group-data-[slot-position=middle]/card:min-h-px group-data-[slot-position=middle]/card:flex-1 group-data-[slot-position=middle]/card:gap-(--spacing-lg)"
    >
      <!-- Name, amount and caveat are ONE column capped at 256px: the caveat is a
           sentence about the price directly above it, so it wraps on the price's
           measure instead of running the full width of the card. -->
      <div
        class="flex w-full max-w-[256px] shrink-0 flex-col items-start group-data-[slot-position=bottom]/card:gap-(--spacing-xs) group-data-[slot-position=middle]/card:gap-(--spacing-md)"
        :data-testid="`${testId}__header`"
      >
        <div class="flex min-h-6 w-full shrink-0 items-center gap-(--spacing-xs)">
          <h3
            class="text-overline-md text-(--text-default) [word-break:break-word]"
            :data-testid="`${testId}__title`"
          >
            {{ planTitle }}
          </h3>
          <Tag
            v-if="showTag"
            severity="primary"
            :label="tagLabel"
            :data-testid="`${testId}__tag`"
          />
        </div>

        <div
          class="flex w-full shrink-0 flex-col items-start gap-(--spacing-xxs) group-data-[slot-position=bottom]/card:min-h-11 group-data-[slot-position=middle]/card:min-h-16"
          :data-testid="`${testId}__pricing`"
        >
          <Currency
            :size="currencySize"
            :value="value"
            :prefix="currencyPrefix"
            :suffix="currencySuffix"
            :data-testid="`${testId}__currency`"
          />
          <!-- One step up the type scale on `middle`: it is the card's supporting
               line, read at the same distance as the 56px figure above it. -->
          <p
            v-if="(showPricingDetails && pricingDetails) || aligned"
            class="text-(--text-muted) [word-break:break-word] group-data-[aligned]/card:min-h-[3lh] group-data-[slot-position=bottom]/card:text-body-sm group-data-[slot-position=middle]/card:text-body-md"
            :data-testid="`${testId}__pricing-details`"
          >
            {{ showPricingDetails ? pricingDetails : '' }}
          </p>
        </div>
      </div>

      <!-- `middle` only: the slot is inside the growing block and takes its slack. -->
      <div
        v-if="isMiddle"
        class="min-h-40 w-full flex-1"
        :data-testid="`${testId}__slot`"
      >
        <slot />
      </div>
    </div>

    <!-- The action. On `middle` it is the card's last child, so `justify-between` on
         the root pins it to the bottom edge; the top padding keeps it off the slot.
         That padding is `--spacing-xl`, one step ABOVE the card's own padding: the action
         is the only region separated from the content by a decision rather than by a rule,
         so it gets the wider step — 24px at base, 32 from `sm`, 48 from `xl`. `--spacing-md`
         put the button 16px under the last bullet and 24 off the card's floor, reading as
         attached to the list rather than as the card's conclusion. -->
    <div
      class="flex w-full shrink-0 items-start gap-(--spacing-md) group-data-[slot-position=middle]/card:pt-(--spacing-xl)"
      :data-testid="`${testId}__actions`"
    >
      <slot name="actions">
        <Button
          v-if="actionLabel"
          :kind="isMiddle ? 'secondary' : 'outlined'"
          size="large"
          :label="actionLabel"
          class="w-full"
          :data-testid="`${testId}__action`"
        />
      </slot>
    </div>

    <!-- `bottom` only: the slot follows the action, outside the upper block. -->
    <div
      v-if="!isMiddle"
      class="min-h-40 w-full shrink-0"
      :data-testid="`${testId}__slot`"
    >
      <slot />
    </div>
  </article>
</template>
