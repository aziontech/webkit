<script setup>
  // Client stories — azion.com/en band 17.
  //
  // Eleven clients, each linking to its success case, three of them carrying the story
  // headline the source writes for it. The source lays this out as a photo-and-logo
  // mosaic of mismatched tiles; here it is one hairline grid of equal cells, because
  // that is what this page language draws (CONTAINERS.md § the hairline box grid) — the
  // CONTENT is the eleven clients, their eleven links, and the three headlines, and all
  // of it is here.
  //
  // Source → ours:
  //   • Every cell is a link to the source's own success-case URL, so the whole grid is
  //     reachable by keyboard and every client is a target — on the source, a logo-only
  //     tile is a link with no accessible text, which is exactly what the mark's `alt`
  //     fixes here.
  //   • A cell with a story states it, and closes on the source's own "Learn more".
  //     A cell without one is its mark, centred.
  //   • THE STORY CELL WEARS THE CLIENT'S BRAND when the registry has that client's
  //     colours — the fill and its two ellipses come from `ui/clients/index.js`, never
  //     from a literal here: a brand's colour is a fact about the client, like its logo
  //     file. Magalu is the one story client of the three that ships them; Netshoes and
  //     GPA are photographs on the source, and a photograph is not something this
  //     language draws, so those two cells stay on canvas with their mark and their
  //     headline. Recorded rather than substituted with a stock image.
  //   • ASSET GAP, recorded: NZN and Zoop have no mark in this repo. They render as
  //     typographic wordmarks (ClientMark's own fallback), so the list of eleven stays
  //     complete instead of quietly becoming nine.
  import FrameBox from '@aziontech/webkit/frame-box'
  import MiniButton from '@aziontech/webkit/mini-button'
  import { CardGrid, SectionModule } from '@shared/ui/layout/index.js'

  import { ClientMark, CLIENTS } from '../ui/index.js'

  const byName = (name) => CLIENTS.find((client) => client.name === name)

  // The card face, from the client's own colours: the flat brand fill, then the two
  // ellipses the design floats over it — top-left and bottom-centre.
  const cardFace = (client) => ({
    background: [
      `radial-gradient(354px 354px at -15% -15%, ${client.brand.glow}, transparent 70%)`,
      `radial-gradient(354px 354px at 45% 115%, ${client.brand.glow}, transparent 70%)`,
      client.brand.base
    ].join(', ')
  })

  // The eleven, in the source's order, with the source's URLs. `story` is present only
  // on the three the source writes a headline for.
  const stories = [
    {
      key: 'netshoes',
      name: 'Netshoes',
      story: 'Netshoes automatically blocks more than 4 million threats in six months',
      href: 'https://www.azion.com/en/success-case/netshoes/'
    },
    {
      key: 'dafiti',
      name: 'Dafiti',
      href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/'
    },
    {
      key: 'agibank',
      name: 'Agibank',
      href: 'https://www.azion.com/en/success-case/agibank/'
    },
    { key: 'renner', name: 'Renner', href: 'https://www.azion.com/en/success-case/renner/' },
    {
      key: 'magalu',
      name: 'Magalu',
      story: 'See how Magalu ensures high availability for hundreds of global‑scale applications',
      href: 'https://www.azion.com/en/success-case/magalu/'
    },
    { key: 'fourbank', name: 'Fourbank', href: 'https://www.azion.com/en/success-case/fourbank/' },
    {
      key: 'gpa',
      name: 'GPA',
      story: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
      href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/'
    },
    {
      key: 'madeira',
      name: 'MadeiraMadeira',
      href: 'https://www.azion.com/en/success-case/madeiramadeira/'
    },
    { key: 'exame', name: 'Exame', href: 'https://www.azion.com/en/success-case/exame/' },
    {
      key: 'zoop',
      name: 'Zoop',
      href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/'
    },
    {
      key: 'nzn',
      name: 'NZN',
      href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/'
    }
  ]

  // Resolved once, so the template reads as one loop over cells rather than a lookup per
  // cell. A story cell is painted in the client's brand only when the registry ships it.
  const cells = stories.map((entry) => {
    const client = byName(entry.name)
    return {
      ...entry,
      client: client ?? { name: entry.name },
      face: entry.story && client?.brand ? cardFace(client) : null
    }
  })
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <!-- `flush` leaves the rule above to the SectionGap, `borders="y"` hands the vertical
         rules back to the column, and `marks="bottom"` ticks the one junction nothing
         else draws: this band's floor. Every cell inside draws nothing — the seams are
         the grid's own `gap-px` over the border colour. -->
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <CardGrid
        variant="divider"
        :columns="4"
        :mobile-columns="2"
      >
        <!-- ONE ANCHOR PER CELL, and which element it is depends on what the cell holds.
             A story cell closes on `MiniButton`, whose root IS an `<a>` — so the cell
             itself is a plain `div`, or the two would nest (invalid, and a keyboard would
             stop on the same destination twice). A mark-only cell has no such action, so
             the cell is the anchor and the mark's `alt` is its accessible name. -->
        <component
          :is="cell.story ? 'div' : 'a'"
          v-for="cell in cells"
          :key="cell.key"
          :href="cell.story ? undefined : cell.href"
          class="group/story flex min-h-[clamp(180px,18vw,240px)] min-w-0 flex-col bg-(--bg-canvas) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
          :class="
            cell.story
              ? 'justify-between gap-(--spacing-xl)'
              : 'items-center justify-center hover:bg-(--bg-surface-raised)'
          "
          :style="cell.face ?? undefined"
        >
          <!-- A story cell signs itself at the top and states the headline on its floor;
               a mark-only cell centres the mark, so the row reads as a grid of clients
               with three of them speaking. -->
          <ClientMark
            :client="cell.client"
            :mark="
              cell.story
                ? 'h-6 w-auto max-w-32 object-contain object-left'
                : 'h-8 w-auto max-w-36 object-contain'
            "
            :monochrome="!cell.face"
          />

          <div
            v-if="cell.story"
            class="flex flex-col items-start gap-(--spacing-md)"
          >
            <p class="m-0 text-pretty text-body-md text-(--text-default)">{{ cell.story }}</p>
            <MiniButton
              label="Learn more"
              show-icon
              icon="pi pi-arrow-right"
              :href="cell.href"
            />
          </div>
        </component>

        <!-- ELEVEN CELLS DO NOT FILL A GRID OF FOUR (or of two). The wrapper's background
             IS the hairline — the seams are `gap-px` showing it through — so the twelfth
             slot is not empty space, it is a solid block of border colour closing the
             band. One filler cell on the canvas absorbs it, at both column counts, and
             it is decorative: there is nothing in it to reach. -->
        <div
          class="bg-(--bg-canvas)"
          aria-hidden="true"
        />
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
