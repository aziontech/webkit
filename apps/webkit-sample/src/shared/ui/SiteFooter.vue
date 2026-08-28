<script setup>
  // Marketing site footer — the azion.com/pt-br footer, composed from the DS
  // `Footer` (@aziontech/webkit/footer) in the anatomy its Storybook "Default"
  // story documents: four link columns, then a row carrying the social icon
  // buttons at the left and the status indicator + language select at the right,
  // then the signature band with the brand mark beside its tagline, and finally
  // the component's own closing band.
  //
  // The component owns all of that — the canvas shell, the 5xl measure, the 2→4
  // column grid at `md`, the framed gutters that carry the page frame out to the
  // viewport edges from `xl`, the per-column dividers, and the closing band that
  // finishes the frame at the bottom of the page. This file supplies only content.
  //
  // The one site-specific thing left is the OPEN of that frame: a full-bleed rule
  // above the footer, built on the HERO's own logic. The hero is a full-bleed band
  // that owns the page's top rule edge to edge; this rule is its mirror at the
  // bottom, so the vertical pair SectionContainer draws down the page turns the
  // corner instead of stopping at it. The footer draws no top rule of its own, so
  // there are never two at that pixel — and a full-bleed rule is correct under a
  // page that closes with a spacer AND under one that just ends (the Hub), which a
  // 5xl rule was not. The band above must simply not draw a bottom rule; the
  // closing spacer on the landings is a borderless FrameBox for exactly that reason.
  //
  // Every column link is a `#` anchor for the demo; the social buttons point at the
  // real profiles, as the story does.
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { onBeforeUnmount, ref } from 'vue'

  const columns = [
    {
      label: 'Products',
      links: [
        'Functions',
        'Cache',
        'Object Storage',
        'SQL Database',
        'WAF',
        'Edge DNS',
        'Data Stream'
      ]
    },
    {
      label: 'Solutions',
      links: [
        'Web Apps',
        'AI',
        'Application Security',
        'Financial Services',
        'Retail',
        'Technology'
      ]
    },
    {
      label: 'Developers',
      links: [
        'Documentation',
        'API Reference',
        'Dev Tools',
        'Release Notes',
        'Marketplace',
        'Status'
      ]
    },
    {
      label: 'Company',
      links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact']
    }
  ]

  const socials = [
    { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
    {
      icon: 'pi pi-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    { icon: 'pi pi-youtube', label: 'Azion on YouTube', href: 'https://www.youtube.com/aziontech' },
    { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
    {
      icon: 'pi pi-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
    { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
  ]

  // WHICH PLACEMENT the DS Footer takes, so the same content can close both shells this
  // app has. `site` (the default here) is the marketing page, whose hero, sections and
  // footer share one measure and one frame; the docs shell passes `content`, because its
  // reading zone is not a framed column and a footer that drew that frame would draw one
  // nothing above it continues. One file, one set of links — the placement is the only
  // thing that differs, which is the whole point of the prop.
  defineProps({
    kind: { type: String, default: 'site' }
  })

  // THE VALUE IS THE LABEL, capitalized. `Select`'s trigger renders the selected VALUE,
  // not the option's label — it has no map from one to the other — so a `pt-br` value under
  // a `PT-BR` label put lower-case text in the control while the open list showed upper.
  // Two spellings of one language is the kind of thing a footer is read for, so the model
  // carries the string the reader sees.
  // WHERE THE MARK SITS, by width. From `lg` it leads the social row; below that it takes
  // the footer's own SIGNATURE band — which is the Figma Mobile variant's anatomy, and the
  // reason that band exists. Two things make it a media query rather than a CSS breakpoint:
  // the two placements are different BANDS of the footer, which no `hidden`/`block` pair can
  // move an element between; and the signature band renders whenever its slot is provided,
  // so hiding its content on desktop would leave an empty 100px band with corner marks. A
  // conditional `<template #brand>` withholds the slot itself, and the band goes with it.
  //
  // `lg`, matching where the mark starts leading the social row: from `md` that band is only
  // half the footer (it shares its grid row with the status pair), which is too narrow to
  // hold the mark and seven 40px buttons on one line — measured two icon lines from 768 to
  // 895. Below `lg` the social row is icons alone, centred.
  const wideQuery = globalThis.matchMedia?.('(min-width: 1024px)')
  const brandLeadsSocialRow = ref(wideQuery?.matches ?? true)
  const onWideQueryChange = (event) => {
    brandLeadsSocialRow.value = event.matches
  }
  wideQuery?.addEventListener('change', onWideQueryChange)
  onBeforeUnmount(() => wideQuery?.removeEventListener('change', onWideQueryChange))

  // The mark's treatment, in one place because it is rendered in two: the same one every
  // other brand redirect in the app carries (the site nav, the docs bar, the console rail
  // and its mobile header) — one opacity transition on hover, and a focus ring.
  const BRAND_LINK_CLASS =
    'inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'

  const language = ref('EN')

  const languageOptions = ['EN', 'PT-BR', 'ES']
</script>

<template>
  <div class="w-full border-t border-(--border-default)">
    <!-- `site` caps the bands at --layout-measure-site and draws the frame: the side
         rules, the gutters and the closing band. The marketing page's hero band and every
         SectionContainer above resolve to that same measure, which is the only reason the
         rules running down the page are continuous. `content` draws no frame and runs the
         bands full bleed across the zone that holds them — right for the docs shell, wrong
         under a page that is a framed column.

         The `border-t` above is NOT frame apparatus and stays in both: it is the hairline
         that separates the footer from whatever ended above it, which both shells want. -->
    <Footer
      :kind="kind"
      aria-label="Footer"
    >
      <Footer.Column
        v-for="column in columns"
        :key="column.label"
        :title="column.label"
      >
        <Footer.Link
          v-for="link in column.links"
          :key="link"
          href="#"
        >
          {{ link }}
        </Footer.Link>
      </Footer.Column>

      <template #social>
        <!-- THE BRAND LEADS THE SOCIAL ROW, from `lg` up. It is the only thing in this
             footer that names the company — there is no signature band at these widths —
             and the row it leads is already the one a reader scans for "who is this and
             where else do they live".

             `size="small"` (16px) rather than the `large` it takes in the signature band:
             here the wordmark sits on the SOCIAL GLYPHS' optical line (`IconButton` renders
             a 16px glyph inside its 40px box), so the row reads as one line of marks instead
             of a logo with icons parked beside it. The `mr-(--spacing-xs)` keeps it off the
             icons' own 4px pitch — the brand is not one of them.

             Below `lg` it is not here at all: it moves to the signature band (see the
             `#brand` slot and `brandLeadsSocialRow`), so the icons get the whole row and
             centre on it. -->
        <a
          v-if="brandLeadsSocialRow"
          href="#"
          aria-label="Azion home"
          :class="BRAND_LINK_CLASS"
          class="mr-(--spacing-xs)"
        >
          <Brand size="small" />
        </a>

        <IconButton
          v-for="social in socials"
          :key="social.label"
          kind="transparent"
          :icon="social.icon"
          :aria-label="social.label"
          :href="social.href"
          target="_blank"
        />
      </template>

      <template #status>
        <StatusIndicator
          severity="success"
          label="All Systems Operational"
        />
      </template>

      <template #language>
        <!-- THE GLOBE NAMES THE CONTROL WITHOUT SPENDING A WORD ON IT. A bare `EN` in a
             footer row reads as a label until you click it; the glyph is what says this is
             the language switch, which is why every site puts one here. It rides the
             trigger's own `iconLeft` slot rather than a wrapper, so it sits inside the
             control's border and on its `--spacing-xs` gap, and `aria-hidden` keeps it out
             of the accessible name — the `aria-label` already carries that. -->
        <div class="w-28">
          <Select
            v-model="language"
            placeholder="Language"
          >
            <Select.Trigger aria-label="Language">
              <template #iconLeft>
                <i
                  class="pi pi-globe text-(--text-muted)"
                  aria-hidden="true"
                />
              </template>
            </Select.Trigger>
            <Select.Content>
              <Select.Option
                v-for="option in languageOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </Select.Option>
            </Select.Content>
          </Select>
        </div>
      </template>

      <!-- THE SIGNATURE BAND, ON MOBILE ONLY. Below `lg` the mark lives here rather than in
           the social row — the Figma Mobile variant's anatomy, and what this band is for.
           The slot is CONDITIONAL, not hidden: the footer opens the band whenever `brand` or
           `tagline` is provided, so a `lg:hidden` mark inside it would still leave an empty
           100px band with corner marks on every desktop page. Withholding the slot withholds
           the band.

           No `#tagline` at any width. It was a marketing line sitting alone in the band, and
           with the mark leading the social row on desktop there was nothing for it to sit
           beside; what closes the footer is the frame's own band.

           `size="small"` at both placements, so the mark is one size in this footer wherever
           it lands.

           `mx-auto` CENTRES IT ON BOTH AXES OF THIS BAND, which takes two shapes: it is a
           `flex-col items-start` stack below `md` and a `flex-row justify-between` from it,
           and with no tagline beside it the mark is the band's only child — pinned left in
           either one. An auto inline margin absorbs the free space in both, because flexbox
           lets auto margins override `align-items` in the cross axis and `justify-content` in
           the main one; `self-center` would only have covered the stacked case. -->
      <template
        v-if="!brandLeadsSocialRow"
        #brand
      >
        <a
          href="#"
          aria-label="Azion home"
          :class="BRAND_LINK_CLASS"
          class="mx-auto"
        >
          <Brand size="small" />
        </a>
      </template>
    </Footer>
  </div>
</template>
