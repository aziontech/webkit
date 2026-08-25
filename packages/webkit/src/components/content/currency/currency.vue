<script setup lang="ts">
  // Currency — one monetary amount, typeset as three parts.
  //
  // The symbol, the figure and the trailing period/unit are three separate spans on
  // purpose: money is not a string. The symbol wants to sit tight against the figure,
  // the figure carries the type scale, and the unit has to be visually subordinate to
  // both — which a single formatted string ("$20 per month") cannot express, and which
  // is why every screen that hand-rolled one ended up spelling money differently.
  //
  // ── THE SIZE LADDER IS A READING DISTANCE ──
  //
  // `small` is an amount inside a table row or a list cell (16px). `medium` is an
  // amount stated as a fact on a card (24px). `large` is the headline figure of a
  // pricing card (56px at `md` and up). They are the house `small | medium | large`
  // ladder, so the step names mean here what they mean on every other component.
  //
  // ── THE SUFFIX CARRIES THE CODE FACE ──
  //
  // `text-label-code-*` rather than `text-label-*`: the unit is a machine-readable
  // qualifier on a number, and the code face is how this system typesets those
  // everywhere else. It also settles the alignment problem for free — those tokens
  // ship `line-height: 1`, so the unit's box is its own text and nothing else, which
  // is what lets `large` bottom-align it against the figure predictably.
  //
  // At `large` the suffix is bottom-aligned and lifted by one `--spacing-md`, not
  // centred: a 56px numeral centred against a 14px unit puts the unit at the numeral's
  // waist, where it reads as two unrelated pieces of text instead of one amount. The
  // lift lands the unit's baseline within ~3px of the figure's.
  //
  // `whitespace-nowrap` on the root, inherited by all three parts: an amount is one
  // token to a reader, so it must never break — not between the symbol and the figure,
  // not inside the figure, and not inside the unit. It also means the amount is allowed
  // to be wider than the prose measure of whatever contains it (a 56px "$2.000" beside
  // its unit exceeds a 256px column), which is correct — the measure exists to set the
  // line length of the sentences, not to fold the price.
  //
  // ── ONE `data-size`, READ BY THE PARTS THROUGH A NAMED GROUP ──
  //
  // The variant lives on the root as `data-size` and the three text spans read it via
  // `group-data-[size=…]/currency:`. A NAMED group (`group/currency`), not a bare one,
  // so a consumer who wraps the amount in their own `.group` cannot have their state
  // resolve against these classes — an unnamed `group-*` matches any `.group`
  // ancestor, which would make the amount's typography depend on its surroundings.
  //
  // ── THE AMOUNT HAS ITS OWN TYPE TOKENS ──
  //
  // `text-amount-sm` / `-md` / `-lg`, not the `text-label-lg` / `text-heading-md` /
  // `text-heading-2xl` this borrowed before. Same size ramp, same leading, same weight —
  // the tokens exist for the one property borrowing could not carry: the amount's
  // `-0.08em` negative tracking, which the design specifies at every size (−1.28px @16px,
  // −1.92px @24px, −4.48px @56px). That is one proportional ratio, so it is `em` and it
  // lives in the token rather than here: the tracking scale is absolute (`rem`) by design
  // and holds no equivalent step, and a per-instance `tracking-*` override is refused by
  // the `tracking-raw` guardrail. Dedicated tokens rather than tracking on the borrowed
  // ones, because `text-heading-2xl` sets every hero headline in the system and a hero is
  // prose, not a numeral.
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Currency',
    inheritAttrs: false
  })

  /** Reading distance of the amount, on the house size ladder. */
  export type CurrencySize = 'small' | 'medium' | 'large'

  interface CurrencyProps {
    /** Monetary value content. */
    value?: string
    /** Text displayed before the value. Empty hides the symbol entirely. */
    prefix?: string
    /** Text displayed after the value. Empty hides the unit entirely. */
    suffix?: string
    /** Size token; affects typography and the gap between the figure and the suffix. */
    size?: CurrencySize
  }

  withDefaults(defineProps<CurrencyProps>(), {
    value: '',
    prefix: '$',
    suffix: '',
    size: 'small'
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'content-currency')
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="group/currency inline-flex items-center whitespace-nowrap data-[size=small]:gap-(--spacing-xxs) data-[size=medium]:gap-(--spacing-xs) data-[size=large]:items-end data-[size=large]:gap-(--spacing-xs)"
  >
    <!-- Symbol and figure are one group so the root's gap separates the AMOUNT from
         its unit, not the symbol from its digits. At `large` the symbol sits flush
         against the figure — at 56px a 4px gap reads as a word space. -->
    <span
      class="inline-flex items-center gap-(--spacing-xxs) group-data-[size=large]/currency:gap-0"
    >
      <span
        v-if="prefix"
        class="text-(--text-default) group-data-[size=small]/currency:text-amount-sm group-data-[size=medium]/currency:text-amount-md group-data-[size=large]/currency:text-amount-lg"
        :data-testid="`${testId}__prefix`"
      >
        {{ prefix }}
      </span>
      <span
        class="text-(--text-default) group-data-[size=small]/currency:text-amount-sm group-data-[size=medium]/currency:text-amount-md group-data-[size=large]/currency:text-amount-lg"
        :data-testid="`${testId}__value`"
      >
        {{ value }}
      </span>
    </span>
    <span
      v-if="suffix"
      class="text-(--text-muted) group-data-[size=small]/currency:text-label-code-sm group-data-[size=medium]/currency:text-label-code-md group-data-[size=large]/currency:text-label-code-md group-data-[size=large]/currency:pb-(--spacing-md)"
      :data-testid="`${testId}__suffix`"
    >
      {{ suffix }}
    </span>
  </span>
</template>
