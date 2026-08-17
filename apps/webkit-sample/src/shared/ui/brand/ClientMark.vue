<script setup>
  // A client logo, placed correctly on both themes.
  //
  // Every surface that paints a client mark — the hero trust strip, the client-story
  // cards, the benefit cells — needs the same two-route rule, so it lives here once
  // (the rule itself is documented in ./clients/index.js):
  //
  //   • `logo` + `logoLight` — two real assets. Both are in the DOM and CSS reveals
  //     exactly one, so the light theme gets the mark's true brand colors instead of
  //     a filtered approximation.
  //   • `logo` + `artwork`   — one asset, inverted only on the theme where it would
  //     otherwise vanish.
  //
  // The theme is read from `[data-theme=dark]` on the document root — the attribute
  // the theme package keys its variables off. Tailwind's stock `dark:` variant is NOT
  // used: it follows `prefers-color-scheme`, which says nothing about the app's chosen
  // theme, so a manual toggle would leave these marks inverted the wrong way.
  //
  // `colored` opts out of the swap and pins the brand-colour file on BOTH themes —
  // for a surface that wants the mark as the brand draws it rather than as a flat
  // silhouette. It only changes marks that ship a colour asset; a client whose only
  // file is white artwork still gets the per-theme filter, since there is no colour
  // version to show.
  //
  // `monochrome` overrides both routes and paints the mark as a single flat
  // silhouette — black on light, white on dark — for a surface that shows a LIST of
  // clients, where per-brand colour reads as noise rather than as accuracy. One
  // asset, one filter, no per-client data; the reasoning is in ./clients/index.js
  // next to the filter itself.
  //
  // Geometry belongs to the caller: pass it through `mark`, since a strip, a card and
  // a benefit cell each set the mark at a different height.
  import { artworkFilter, MONOCHROME_FILTER } from './clients/index.js'

  defineProps({
    // A CLIENTS entry: { name, logo?, logoLight?, artwork? }.
    client: {
      type: Object,
      required: true
    },
    // Geometry classes for the <img> — height, max-width, object-fit.
    mark: {
      type: String,
      default: 'h-10 w-auto max-w-52 object-contain'
    },
    // Show the brand-colour asset on both themes instead of swapping by theme.
    colored: {
      type: Boolean,
      default: false
    },
    // Paint every mark in one ink (a flat silhouette) instead of its own colours.
    monochrome: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <!-- One ink, both themes. Checked FIRST: it is a deliberate override of the two
       routes below, and it needs only one of the assets — whichever exists — since
       the filter erases the difference between them anyway. -->
  <img
    v-if="monochrome && (client.logo || client.logoLight)"
    :src="client.logo || client.logoLight"
    :alt="client.name"
    decoding="async"
    :class="[mark, MONOCHROME_FILTER]"
  />

  <!-- Colour-pinned: the brand file, unfiltered, on either theme. -->
  <img
    v-else-if="colored && client.logoLight"
    :src="client.logoLight"
    :alt="client.name"
    decoding="async"
    :class="mark"
  />

  <!-- Two-asset mark: both rendered, CSS shows one per theme. -->
  <template v-else-if="client.logo && client.logoLight">
    <img
      :src="client.logo"
      :alt="client.name"
      decoding="async"
      :class="[mark, 'hidden [[data-theme=dark]_&]:block']"
    />
    <img
      :src="client.logoLight"
      alt=""
      aria-hidden="true"
      decoding="async"
      :class="[mark, 'block [[data-theme=dark]_&]:hidden']"
    />
  </template>

  <!-- Single-asset mark: inverted only on the theme that needs it. -->
  <img
    v-else-if="client.logo"
    :src="client.logo"
    :alt="client.name"
    decoding="async"
    :class="[mark, artworkFilter(client)]"
  />

  <!-- No asset yet: the typographic wordmark keeps the list complete. -->
  <span
    v-else
    class="whitespace-nowrap text-heading-xxs tracking-tight"
    >{{ client.name }}</span
  >
</template>
