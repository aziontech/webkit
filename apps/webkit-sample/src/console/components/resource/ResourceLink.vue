<script setup>
  // The console's CROSS-RESOURCE LINK — one name that leaves this screen for another.
  //
  // The shape is the deployment page's (pages/deployments/DeploymentDetail.vue, which
  // is the reference this component was lifted from), and it is three rules, not one:
  //
  //   1. EVERY EXTERNAL MARK SAYS WHERE IT GOES. The glyph announces that the name
  //      leaves this page; the TOOLTIP names the page it leaves for, so the reader
  //      decides before the click instead of after.
  //   2. THE MARK IS A FIXED 12px `pi-external-link`, never sized from the text around
  //      it. A mark that inherits its size becomes a heading-sized arrow inside a
  //      heading, and the console had one of those.
  //   3. NO ROUTE, NO MARK, NO TOOLTIP. A glyph that leads nowhere is worse than no
  //      glyph, and a tooltip promising a destination on a name that opens nothing is
  //      worse than silence — so a link with neither `to` nor `href` renders as plain
  //      truncating text.
  //
  // It was extracted because the same ten lines had been re-typed at a dozen call
  // sites, and they had drifted on all three axes at once: four different glyphs, four
  // different icon sizes (including one that inherited a heading's), underline at rest
  // in some and on hover in others, and a tooltip in two of twelve.
  //
  // THE LEADING PRODUCT GLYPH IS THE CALLER'S. A workload row leads with
  // `ai ai-workloads`, a domain cell with `ai ai-domains` — that mark identifies the
  // FIELD and varies by context, so it sits beside this component rather than inside
  // it, exactly as the reference page composes it.
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  const props = defineProps({
    /** The name to show — the resource the reader recognises. */
    label: { type: String, default: '' },
    /** In-app destination, as `router-link`'s `to`. Mutually exclusive with `href`. */
    to: { type: [String, Object], default: null },
    /** Off-app destination. Opens in a new tab. Mutually exclusive with `to`. */
    href: { type: String, default: '' },
    /**
     * The module the `to` route lands in — `Workloads`, `Applications`. It is the
     * second half of the tooltip ("Open <label> in Workloads"), which is the whole
     * reason the tooltip is worth having, so an in-app link should always pass it.
     */
    module: { type: String, default: '' },
    /** Replaces the derived tooltip outright, when neither phrasing fits. */
    tooltip: { type: String, default: '' }
  })

  const isLink = computed(() => Boolean(props.to || props.href))

  // Off-app is an anchor, in-app is a route, and a name with neither destination is
  // not a link at all — it is text that happens to sit where a link usually goes.
  const tag = computed(() => {
    if (props.href) return 'a'
    return props.to ? 'router-link' : 'span'
  })

  // An off-app name opens a tab; an in-app one lands in a named module. Both say where
  // they go — that is rule 1 — and a link with no destination gets no promise at all.
  const tooltipText = computed(() => {
    if (props.tooltip) return props.tooltip
    if (!isLink.value) return ''
    if (props.href) return `Open ${props.label} in a new tab`
    return props.module ? `Open ${props.label} in ${props.module}` : `Open ${props.label}`
  })
</script>

<template>
  <!-- `shrink!` is not decoration. Tooltip's trigger wrapper is a flat
       `inline-flex w-fit shrink-0`, and a consumer class merges into that by
       concatenation rather than through `cn` — so an un-important `shrink` and the
       component's own `shrink-0` set the same property at the same specificity and
       stylesheet order decides, which is a coin flip. Without the override the
       wrapper refuses to shrink inside a flex table cell, the name never reaches its
       `truncate`, and the cell overflows instead (measured on the Workloads domain
       column at 1100px: all ten rows overflowing). -->
  <Tooltip
    :text="tooltipText"
    :disabled="!isLink"
    class="min-w-0 shrink!"
  >
    <component
      :is="tag"
      :to="tag === 'router-link' ? to : undefined"
      :href="href || undefined"
      :target="href ? '_blank' : undefined"
      :rel="href ? 'noopener noreferrer' : undefined"
      class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
      @click.stop
    >
      <!-- Underlined on HOVER, not at rest: a console list is mostly links, and
           underlining every one of them at rest turns the column into noise. -->
      <span
        class="truncate underline-offset-2"
        :class="isLink ? 'group-hover/link:underline' : ''"
      >
        {{ label }}
      </span>
      <!-- The tooltip is pointer- and focus-only, so the one fact a screen reader
           cannot otherwise get — that this leaves the app — is said in text. -->
      <span
        v-if="href"
        class="sr-only"
        >{{ ' (opens in a new tab)' }}</span
      >
      <i
        v-if="isLink"
        class="pi pi-external-link shrink-0 text-body-xs leading-none"
        aria-hidden="true"
      />
    </component>
  </Tooltip>
</template>
