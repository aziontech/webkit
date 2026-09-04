<script setup>
  // What the platform is for — azion.com/en band 7.
  //
  // Four capabilities as an ALTERNATING STACK: one full-width row per capability, copy on
  // one edge and its scene on the other, the two swapping sides down the stack. It is the
  // same module the product pages' use-case band is built from (see AzionWebApps.vue), so
  // the band reads as one of the page language's shapes rather than a layout of its own.
  //
  // The 2x2 card grid this replaced said the four were peers by putting them in a matrix;
  // the stack says it by giving each one the column's full measure in turn. The trade is
  // height — four rows instead of two — bought back by each claim getting a whole line of
  // reading width and each scene getting half the column instead of a quarter.
  //
  // Source → ours:
  //   • The category line is the source's small uppercase label, rendered as webkit's
  //     `Overline` (the page's own overline anatomy: `//` prefix, accent label, cursor).
  //   • The claim is the source's own sentence, at the section-heading step. It is an `h3`:
  //     the module above this one titles itself with a `SectionTitle` (`h2`), so these four
  //     take the level under it and the outline stays unbroken.
  //   • The action is a `MiniButton` on the source's own href. The source writes
  //     "Learn More" on the security card and "Learn more" on the other three; the casing
  //     is carried as-is rather than normalized.
  //   • The art is NOT the source's screenshot. Each row draws one of the design team's
  //     own 592x300 scenes from the Figma `Assets` file, committed beside this page and
  //     served as a hashed `<img>` — the same idiom the solution pages use for their band
  //     art. This is the one place the band's substance is ours: a screenshot of a product
  //     UI is not a thing this page language draws.
  //
  //     THE TRADE, stated because it is a real loss. These four replaced assets from
  //     webkit's Illustration registry, and a fixed export cannot do what a composed
  //     illustration did: it does not follow the theme (the scenes are drawn on
  //     `--bg-canvas`, which is what the row renders anyway), and there is no interior for
  //     a hover to drive — the rim light no longer sweeps and no gauge counts up to a
  //     perfect score. The band is quieter on hover than it was.
  //
  // Borders, per CONTAINERS.md, are drawn exactly once:
  //   • FrameBox owns the band's floor and the pair of ticks registering it. `flush` lands
  //     its top rule ON the SectionGap above instead of beside it, and `borders="y"` hands
  //     the vertical rules back to the column — which is why SectionModule passes
  //     `:divided="false"`.
  //   • The rules BETWEEN the rows are the stack's own `gap-px` over the border colour, so
  //     each row fills its own `--bg-canvas` and draws no horizontal rule of its own.
  //   • The rule between a row's two halves is drawn INSIDE the art cell, on whichever
  //     edge faces the copy, so nothing else owns it.
  import FrameBox from '@aziontech/webkit/frame-box'
  import MiniButton from '@aziontech/webkit/mini-button'
  import Overline from '@aziontech/webkit/overline'
  import { SectionModule } from '@shared/ui/layout/index.js'

  // The band's art, exported from the Figma `Assets` file at that set's own 592x300 frame
  // and committed beside this page. Vite resolves each to a hashed asset URL, exactly as
  // the marks in the CLIENTS registry are resolved. Nodes, in the order used below:
  // 1847:205772, 1864:249784, 1864:249055, 1873:185434.
  //
  // Each export is STRIPPED OF FIGMA'S CHROME, which is not cosmetic: the frames sit
  // inside a section on that file's canvas, so an unedited export carries a full-bleed
  // page-background rect plus that section's own plate — and the plate covers the entire
  // 592x300 box, which would land a grey slab in every row. Dropping those nodes, and the
  // frame's own `--bg-canvas` fill with them, is what leaves a transparent scene that
  // takes the row's own surface — the same treatment the solution pages' art gets.
  import automateThreatMitigation from '../assets/illustrations/automate-threat-mitigation.svg'
  import deploySecureMcpServer from '../assets/illustrations/deploy-secure-mcp-server.svg'
  import fastestPathToLiveWebsite from '../assets/illustrations/fastest-path-to-live-website.svg'
  import modernFrontends from '../assets/illustrations/modern-frontends.svg'

  // One row per capability, in the source's order — the source's own label, claim, action
  // label and href, unchanged. Only `illustration` moved: each row is paired with the
  // scene that DRAWS its claim, which is why the framework windows lead (the row's claim
  // is static sites and serverless applications) and the four-stage request line carries
  // the security row (its claim is WAAP, bots and programmable rules).
  const capabilities = [
    {
      key: 'modern',
      illustration: modernFrontends,
      label: 'Modern Applications',
      claim:
        'Build static sites, develop serverless applications, or modernize your legacy applications',
      actionLabel: 'Learn more',
      href: 'https://www.azion.com/en/solutions/#development'
    },
    {
      key: 'optimized',
      illustration: fastestPathToLiveWebsite,
      label: 'Optimized workloads',
      claim:
        'Accelerate applications, optimize content delivery (CDN), and process images on demand efficiently',
      actionLabel: 'Learn more',
      href: 'https://www.azion.com/en/solutions/#performance'
    },
    {
      key: 'protected',
      illustration: automateThreatMitigation,
      label: 'Protect applications and APIs',
      claim:
        'Protect web applications and APIs (WAAP), manage bots, and modernize your security in a programmable and scalable way',
      // The source's own casing on this one card.
      actionLabel: 'Learn More',
      href: 'https://www.azion.com/en/solutions/#security'
    },
    {
      key: 'ai',
      illustration: deploySecureMcpServer,
      label: 'Build AI applications',
      claim:
        'Build and deploy AI agents and AI-powered applications on a distributed platform that delivers the best value in the market',
      actionLabel: 'Learn more',
      href: 'https://www.azion.com/en/solutions/#ai'
    }
  ]
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <!-- The stack. `gap-px` over the border colour draws every rule between the rows,
           so no row draws a horizontal border of its own. -->
      <div class="grid gap-px bg-(--border-default)">
        <div
          v-for="capability in capabilities"
          :key="capability.key"
          class="group grid min-w-0 bg-(--bg-canvas) lg:grid-cols-2"
        >
          <!-- The copy is CENTRED in the row, not spread across it. The row's height is
               the scene's (592x300 at half the column), and this band's copy is three
               short parts — label, one claim, one action — so a `justify-between` column
               would strand the action ~180px under the claim with nothing between them.
               Centring hangs the three off the scene's own optical middle instead, which
               is what keeps the row reading as one thought rather than two corners. -->
          <div
            class="flex min-w-0 flex-col items-start justify-center gap-(--spacing-lg) p-(--spacing-xl)"
          >
            <!-- `-ml-1` cancels the 4px `pl-1` Overline carries, so the label starts on
                 the row's own left edge with the copy under it. -->
            <Overline
              prefix="//"
              show-cursor
              class="-ml-1"
              >{{ capability.label }}</Overline
            >
            <h3
              class="m-0 max-w-(--container-2xl) text-pretty text-heading-md text-(--text-default)"
            >
              {{ capability.claim }}
            </h3>
            <MiniButton
              :label="capability.actionLabel"
              show-icon
              icon="pi pi-arrow-right"
              :href="capability.href"
            />
          </div>

          <!-- Decorative: the claim beside it carries the meaning, so the scene takes no
               `alt` and stays hidden from assistive tech. `width`/`height` are the
               export's own frame, so the row reserves the art's box before it loads.
               The parity is the row's own `nth-child`, read here through the row's
               `group` — no index, so adding a capability keeps the rhythm. On an EVEN row
               the art moves to the start edge and draws the divider on its right; on an
               ODD row it stays on the end edge and draws it on its left. Below `lg` the
               art is always the grid's second row, so the copy leads on a phone whichever
               side it takes on a wide screen. -->
          <div
            class="flex min-w-0 items-center justify-center overflow-hidden border-t border-(--border-default) lg:border-t-0 lg:group-even:order-first lg:group-even:border-r lg:group-odd:border-l"
          >
            <img
              :src="capability.illustration"
              alt=""
              aria-hidden="true"
              width="592"
              height="300"
              class="block aspect-[592/300] w-full"
            />
          </div>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
