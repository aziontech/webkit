<script setup>
  // An account's mark: the customer's own brand, when we have it.
  //
  // An account IS a company, so its mark is that company's logo — the same asset the
  // site's trust strip and client-story cards paint, read from the one registry that
  // owns them (../../../shared/ui/brand/clients/index.js). Nothing here duplicates
  // that data: this component only decides how a client mark becomes a 24px square.
  //
  // THREE ROUTES, in this order, because the marks this repo owns are three kinds of
  // thing — and each route is decided by data, never by a name:
  //
  //   1. A PURPOSE-DRAWN TILE (../../../shared/ui/brand/clients/symbols/) — a 24×24
  //      file with the brand fill and the mark already composed inside it, in the
  //      colours the brand draws them. Nothing to place: it just fills the box. This is
  //      the preferred route and the one to add to, because it is the only one that
  //      carries a multi-colour mark honestly (Caixa's orange-and-white, GPA's four
  //      greens) instead of flattening it to a silhouette.
  //   2. A WHITE SILHOUETTE + THE BRAND HEX — the four story clients in the trust-strip
  //      registry (`artwork: 'light'`: MadeiraMadeira, Renner, HeroSpark) ship their
  //      symbol as bare white paths, which would vanish on a light background. They get
  //      `brand.base` as the tile with the symbol centred on it in white — exactly how
  //      the site's own client-story cards paint them (../../../site/components/
  //      ClientStories.vue), and it needs no per-theme inversion: white on the brand's
  //      own dark fill reads on either theme.
  //   3. A COLOURED SYMBOL — Magalu's "Lu" is a 210×210 raster, 97% opaque, in the
  //      brand's cyan, so it is already a tile and fills the box edge to edge. A brand
  //      colour behind it would only ever show as a rim.
  //
  // The brand hex comes from the registry entry's `brand.base`, so it rides on `style`
  // rather than a class: a client's brand colour is a fact about the client, never a
  // token of ours, and there is no token that could hold it.
  //
  // NO LOGO, NO INVENTION. A customer whose mark this repo does not own falls back to
  // the design system Avatar's initials. Substituting some other company's logo would
  // misrepresent a real brand, and a generic glyph on half the rows says nothing about
  // which account a row is — initials at least identify it.
  import Avatar from '@aziontech/webkit/avatar'
  import { computed } from 'vue'

  // Relative, not the `@shared` alias the neighbours use: validate-references.mjs
  // resolves real paths and node_modules, not vite aliases, so the alias form is
  // blocked at write time here (see ../home/HomeWire.vue).
  import { CLIENTS } from '../../../shared/ui/brand/clients/index.js'
  import {
    clientSymbolFor,
    normalizeClientName
  } from '../../../shared/ui/brand/clients/symbols/index.js'
  import { accountInitials } from '../../lib/state/accounts.js'

  const props = defineProps({
    // Account name — what the registry is matched on.
    name: { type: String, default: '' },
    // Size token, matching OrgAvatar's scale so the two marks are interchangeable.
    size: { type: String, default: 'medium' }
  })

  // Route 1. Both registries key on the same normalized name ("Madeira Madeira" ↔
  // "MadeiraMadeira", "Itaú" → "itau"), so neither needs a table of spellings.
  const tile = computed(() => clientSymbolFor(props.name))

  // Routes 2 and 3. Only an entry that ships a `symbol` can be a mark: the trust-strip
  // `logo` is a wordmark, and a 2500×1413 lockup in a 24px square is a smudge.
  const client = computed(() => {
    if (tile.value) return null
    const key = normalizeClientName(props.name)
    return CLIENTS.find((entry) => entry.symbol && normalizeClientName(entry.name) === key) ?? null
  })

  // A white symbol needs the brand fill behind it; a coloured one is the tile.
  const isWhiteArtwork = computed(() => client.value?.artwork === 'light')

  const boxClasses =
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-(--shape-button)'

  const sizeClasses = {
    small: 'size-(--size-5)',
    medium: 'size-(--size-6)',
    large: 'size-(--size-12)'
  }

  // The centred white symbol sits at ~58% of the box — the same optical weight as the
  // 12px glyph in a 24px icon avatar, which is what it stands beside in the header.
  const symbolClasses = {
    small: 'size-3',
    medium: 'size-3.5',
    large: 'size-7'
  }
</script>

<template>
  <!-- Purpose-drawn tile: fill and mark already composed in the file. -->
  <span
    v-if="tile"
    role="img"
    :aria-label="name"
    :class="[sizeClasses[size] ?? sizeClasses.medium, boxClasses]"
  >
    <img
      :src="tile"
      alt=""
      aria-hidden="true"
      decoding="async"
      class="size-full object-cover"
    />
  </span>

  <!-- Brand hex as the tile, the client's white symbol centred on it. -->
  <span
    v-else-if="client && isWhiteArtwork"
    role="img"
    :aria-label="name"
    :style="{ backgroundColor: client.brand.base }"
    :class="[sizeClasses[size] ?? sizeClasses.medium, boxClasses]"
  >
    <img
      :src="client.symbol"
      alt=""
      aria-hidden="true"
      decoding="async"
      :class="[symbolClasses[size] ?? symbolClasses.medium, 'object-contain']"
    />
  </span>

  <!-- Coloured symbol: already a tile, so it fills the box. -->
  <span
    v-else-if="client"
    role="img"
    :aria-label="name"
    :class="[sizeClasses[size] ?? sizeClasses.medium, boxClasses]"
  >
    <img
      :src="client.symbol"
      alt=""
      aria-hidden="true"
      decoding="async"
      class="size-full object-cover"
    />
  </span>

  <!-- No mark for this company: initials, over the same box as the icon avatars. -->
  <Avatar
    v-else
    :label="accountInitials(name)"
    size="small"
    kind="square"
    class="border-(length:--border-width-default) border-(--border-default)"
  />
</template>
