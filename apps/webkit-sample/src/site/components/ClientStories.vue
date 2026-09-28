<script setup>
  // Client stories — azion.com/en band 17.
  //
  // Eight clients, each linking to its success case, two of them carrying the story
  // headline the source writes for it. The source lays this out as a mosaic of mismatched
  // tiles; here it is the same mosaic on one collapsed hairline grid, drawn by BentoGrid
  // with no gutter between the tiles (CONTAINERS.md § the hairline box grid).
  //
  // Source → ours:
  //   • The tracks are the source's: a two-by-two story tile leading, one tall story
  //     tile down the mosaic, and single tiles for the rest. Eight cells over twelve
  //     tracks, so the rectangle closes with nothing left bare.
  //   • Every cell is a link to the source's own success-case URL, so the whole grid is
  //     reachable by keyboard and every client is a target — on the source, a logo-only
  //     tile is a link with no accessible text, which is exactly what the mark's `alt`
  //     fixes here.
  //   • A cell with a story states it, and closes on the source's own "Learn more".
  //     A cell without one is its mark, centred.
  //   • THE STORY CELL WEARS THE CLIENT'S BRAND when the registry has that client's
  //     colours — the fill and its two ellipses come from `ui/clients/index.js`, never
  //     from a literal here: a brand's colour is a fact about the client, like its logo
  //     file. Neither story client ships them today; Netshoes and
  //     GPA stand on the source's own photograph, dropped in `clients/photos/` and found
  //     by name — under a scrim that ends on the canvas, so the headline keeps its
  //     contrast. A story cell with no photograph falls back to the dot texture.
  //   • The two tiles the source paints in its own accent are painted in OURS, which
  //     is the one colour on this page that is not the client's to state. Their marks go
  //     to the knockout ink measured for a filled surface (6.71:1 on --primary).
  import BentoGrid from '@aziontech/webkit/bento-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionModule from '@aziontech/webkit/section-module'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import { ClientMark, clientPhoto, CLIENTS } from '../ui/index.js'

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

  // The eight, in the source's order, with the source's URLs. DOM order is placement
  // order: the grid auto-places each cell in the next free track, so this list IS the
  // mosaic. `story` is present only on the two the source writes a headline for.
  const stories = [
    {
      key: 'netshoes',
      name: 'Netshoes',
      span: '2',
      rows: '2',
      fill: 'surface',
      texture: true,
      story: 'Netshoes automatically blocks more than 4 million threats in six months',
      href: 'https://www.azion.com/en/success-case/netshoes/'
    },
    {
      key: 'dafiti',
      name: 'Dafiti',
      fill: 'white',
      href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/'
    },
    {
      key: 'agibank',
      name: 'Agibank',
      href: 'https://www.azion.com/en/success-case/agibank/'
    },
    { key: 'renner', name: 'Renner', href: 'https://www.azion.com/en/success-case/renner/' },
    {
      key: 'gpa',
      name: 'GPA',
      stacked: true,
      rows: '2',
      fill: 'surface',
      story: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
      href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/'
    },
    {
      key: 'fourbank',
      name: 'Fourbank',
      fill: 'primary',
      href: 'https://www.azion.com/en/success-case/fourbank/'
    },
    { key: 'exame', name: 'Exame', href: 'https://www.azion.com/en/success-case/exame/' },
    {
      key: 'nzn',
      name: 'NZN',
      fill: 'primary',
      href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/'
    }
  ]

  // A stacked lockup (wordmark over a mark) is squarer than a wordmark, so one shared
  // height renders it at half the optical weight of its neighbours. It takes a taller step.
  const markGeometry = (cell) =>
    cell.story
      ? `relative z-10 ${cell.stacked ? 'h-9' : 'h-6'} w-auto max-w-32 object-contain object-left`
      : `relative z-10 ${cell.stacked ? 'h-12' : 'h-8'} w-auto max-w-36 object-contain`

  // Resolved once, so the template reads as one loop over cells rather than a lookup per
  // cell. A story cell is painted in the client's brand only when the registry ships it.
  const cells = stories.map((entry) => {
    const client = byName(entry.name)
    const branded = Boolean(entry.story && client?.brand)
    const fill = branded ? 'brand' : (entry.fill ?? 'canvas')
    return {
      ...entry,
      span: entry.span ?? '1',
      rows: entry.rows ?? '1',
      fill,
      filled: fill === 'primary' || fill === 'white',
      lead: entry.span === '2',
      client: client ?? { name: entry.name },
      face: branded ? cardFace(client) : null,
      photo: entry.story ? clientPhoto(client) : ''
    }
  })
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <!-- `flush` leaves the rule above to the SectionGap and `borders="y"` hands the
         vertical rules back to the column; `marks="all"` registers every corner, as the
         grid's cells do. The grid is `flush` for the same reason — it lays its outer
         rules onto the column's instead of beside them. -->
    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <BentoGrid
        flush
        :columns="4"
        :mobile-columns="2"
        aria-label="Client stories"
      >
        <BentoGrid.Cell
          v-for="cell in cells"
          :key="cell.key"
          :span="cell.span"
          :rows="cell.rows"
          kind="none"
          :padded="false"
          class="min-h-[clamp(180px,18vw,240px)]"
        >
          <!-- ONE ANCHOR PER CELL, and which element it is depends on what the cell holds.
               A story cell closes on `MiniButton`, whose root IS an `<a>` — so the cell
               itself is a plain `div`, or the two would nest (invalid, and a keyboard would
               stop on the same destination twice). A mark-only cell has no such action, so
               the cell is the anchor and the mark's `alt` is its accessible name. -->
          <component
            :is="cell.story ? 'div' : 'a'"
            :href="cell.story ? undefined : cell.href"
            :data-fill="cell.fill"
            class="relative flex h-full min-w-0 flex-col overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:bg-(--color-orange-600) data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--color-base-white)"
            :class="
              cell.story ? 'justify-between gap-(--spacing-xl)' : 'items-center justify-center'
            "
            :style="cell.face ?? undefined"
          >
            <img
              v-if="cell.photo"
              :src="cell.photo"
              alt=""
              aria-hidden="true"
              decoding="async"
              loading="lazy"
              class="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div
              v-if="cell.photo"
              aria-hidden="true"
              class="absolute inset-0 z-0 [background-image:linear-gradient(to_top,var(--bg-canvas)_0%,color-mix(in_srgb,var(--bg-canvas)_90%,transparent)_38%,color-mix(in_srgb,var(--bg-canvas)_46%,transparent)_70%,color-mix(in_srgb,var(--bg-canvas)_16%,transparent)_100%)]"
            />
            <TextureMaterial
              v-else-if="cell.texture"
              kind="dots"
              size="large"
              fade="vignette"
            />

            <!-- A story cell signs itself at the top and states the headline on its floor;
                 a mark-only cell centres the mark, so the row reads as a grid of clients
                 with two of them speaking. -->
            <ClientMark
              :client="cell.client"
              :mark="markGeometry(cell)"
              :monochrome="cell.fill !== 'brand' && !cell.filled"
              :knockout="cell.filled"
            />

            <div
              v-if="cell.story"
              class="relative z-10 flex flex-col items-start gap-(--spacing-md)"
            >
              <p
                class="m-0 text-(--text-default)"
                :class="cell.lead ? 'text-heading-md' : 'text-pretty text-body-lg'"
              >
                {{ cell.story }}
              </p>
              <MiniButton
                label="Learn more"
                show-icon
                icon="pi pi-angle-right"
                :href="cell.href"
              />
            </div>
          </component>
        </BentoGrid.Cell>
      </BentoGrid>
    </FrameBox>
  </SectionModule>
</template>
