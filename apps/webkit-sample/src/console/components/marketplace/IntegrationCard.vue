<script setup>
  // Integration catalog card. One component, two anatomies driven by `featured`:
  //
  //  • featured=false → compact, horizontal: vendor mark on the left, title +
  //    "by {vendor}" and description on the right, with the type Tag pinned
  //    top-right. This is the dense grid card.
  //  • featured=true  → spotlight, vertical & centered: a larger vendor mark on
  //    top, then the centered title / vendor / description, a faint accent glow,
  //    and a raised surface. This is the "Featured" row at the top of the panel.
  //
  // Both are clickable (button semantics) and emit `select`.
  import CardBox from '@aziontech/webkit/card-box'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import Tag from '@aziontech/webkit/tag'

  defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    // Who publishes it, rendered as "by {vendor}". PASS `''` TO OMIT THE BYLINE: a
    // framework starter is not published by anybody in the sense this line means — the
    // row IS the framework — and sixteen rows each saying "by Azion" is a column of the
    // same three words down the band.
    vendor: { type: String, default: 'Azion' },
    // Optional brand icon class (`ai-cor ai-*`). When empty, falls back to the
    // Azion Marketplace vendor mark.
    icon: { type: String, default: '' },
    // What the MARK needs to survive the dark theme — the Next.js logo is a black disc
    // that reads as a hole in the tile until it is inverted. Comes from the catalog
    // (../../lib/data/frameworks.js → `DARK_INK_MARKS`); empty for every other mark.
    markClass: { type: String, default: '' },
    // Short type label shown in the corner Tag (e.g. "Integration").
    badge: { type: String, default: 'Integration' },
    // THE RESOURCES A RUN OF IT CREATES, in the order it creates them — rendered as a
    // chain under the description ('Application → Workload → Connector'). For a template
    // row, this is the fact the corner Tag used to spend itself on: the technology is
    // already in the mark and in the sentence, while what the run will leave in the
    // account was visible nowhere until the deploy log streamed it past. Empty on an
    // integration, which provisions nothing of its own.
    creates: { type: Array, default: () => [] },
    // Switches the card anatomy: spotlight (true) vs. dense grid card (false).
    featured: { type: Boolean, default: false }
  })

  const emit = defineEmits(['select'])

  const activate = (event) => emit('select', event)
</script>

<template>
  <CardBox
    class="group relative cursor-pointer transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    :class="
      featured ? 'bg-(--bg-surface-raised) hover:border-(--border-strong)' : 'hover:bg-(--bg-hover)'
    "
    role="button"
    tabindex="0"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate"
  >
    <template #content>
      <!-- Featured accent glow, faded in on hover, behind the content. -->
      <span
        v-if="featured"
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-10 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-20 motion-reduce:transition-none"
        style="background: radial-gradient(120% 90% at 50% 0%, var(--primary), transparent 62%)"
      />

      <!-- Corner type Tag — ABSOLUTE only in the spotlight, where the content is a
           centered column with room above it. In the dense anatomy it is a real flex
           item of the row instead (below), because an absolute corner tag reserves its
           room with a right padding on the row: `pr-(--spacing-xl)` is 24px, and no tag
           in this catalog is that narrow, so any title long enough to reach the corner
           ran UNDER it (measured with "Functions Starter Kit" + a "JavaScript" tag —
           the vendor line was half-covered). A tag in the flow cannot be overlapped by
           anything. -->
      <Tag
        v-if="featured && badge"
        class="absolute right-(--spacing-md) top-(--spacing-md) z-10"
        severity="primary"
        size="small"
        :label="badge"
      />

      <!-- ── Spotlight anatomy: centered column ── -->
      <div
        v-if="featured"
        class="relative z-[1] flex flex-col items-center gap-(--spacing-md) px-(--spacing-sm) py-(--spacing-lg) text-center"
      >
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
        >
          <i
            v-if="icon"
            :class="[icon, markClass]"
            class="text-[1.25rem] leading-none text-(--text-default)"
            aria-hidden="true"
          />
          <AzionLogoMin
            v-else
            class="h-5 w-auto"
            aria-label="Azion Marketplace"
          />
        </span>
        <div class="flex flex-col items-center gap-(--spacing-xxs)">
          <h3 class="text-heading-xs text-(--text-default)">{{ title }}</h3>
          <span
            v-if="vendor"
            class="text-body-xs text-(--text-muted)"
            >by {{ vendor }}</span
          >
        </div>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          {{ description }}
        </p>
      </div>

      <!-- ── Dense anatomy: logo left, text right ── -->
      <div
        v-else
        class="flex items-start gap-(--spacing-md)"
      >
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
        >
          <i
            v-if="icon"
            :class="[icon, markClass]"
            class="text-[1.25rem] leading-none text-(--text-default)"
            aria-hidden="true"
          />
          <AzionLogoMin
            v-else
            class="h-5 w-auto"
            aria-label="Azion Marketplace"
          />
        </span>
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
          <div class="flex flex-wrap items-baseline gap-x-(--spacing-xs)">
            <h3 class="text-label-md text-(--text-default)">{{ title }}</h3>
            <span
              v-if="vendor"
              class="text-body-xs text-(--text-muted)"
              >by {{ vendor }}</span
            >
          </div>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
          <!-- The chain, last: it is what the row promises, read after the sentence that
               says what the thing is. A CHAIN rather than the tag row the cards wear
               (./TemplateCard.vue) — a row is horizontal and 287px wide, where four tags
               cost two lines and four arrow-joined names cost one, and the arrows say the
               extra thing a tag cannot: the order the run creates them in.
               The arrows are `aria-hidden` and the lead word is the accessible one, so a
               screen reader reads "Creates Application Workload Connector" instead of
               three nouns with no verb. -->
          <!-- `gap-(--spacing-xxs)`, NOT the axis-specific `gap-x-(--spacing-xxs)`:
               measured, the axis form of the paren shorthand emits no CSS at all in this
               build (`column-gap: normal`), so the chain rendered as one word —
               "CreatesApplication→Workload". Both spellings compile, lint and type-check
               identically; only the DOM tells them apart. The two-axis form is also what
               the wrapped chain wants, since a second line needs the row gap. -->
          <p
            v-if="creates.length"
            class="mt-(--spacing-xxs) flex flex-wrap items-center gap-(--spacing-xxs) text-body-xs text-(--text-muted)"
          >
            <!-- The lead word takes the line's own muted ink, not the disabled token:
                 `--text-disabled` measures ~2:1 on the dark card surface, which is
                 legible for a SEPARATOR (the arrows below, aria-hidden) and not for a
                 word that has to be read for the rest of the line to mean anything. -->
            <span>Creates</span>
            <template
              v-for="(resource, index) in creates"
              :key="resource"
            >
              <span
                v-if="index"
                aria-hidden="true"
                class="text-(--text-disabled)"
                >→</span
              >
              <span>{{ resource }}</span>
            </template>
          </p>
        </div>
        <!-- The type Tag, in the flow: `shrink-0` so it keeps its width and the text
             column wraps against it instead of under it. -->
        <Tag
          v-if="badge"
          class="shrink-0"
          severity="info"
          size="small"
          :label="badge"
        />
      </div>
    </template>
  </CardBox>
</template>
