<script setup>
  // What the platform is for — azion.com/en band 7.
  //
  // Four cards in a 2×2 hairline grid, and nothing else in the band: the source states
  // these as the page's own argument, with no title band over them and no supporting
  // copy beside them. Each card is one shape — category label, the claim, one action,
  // and the artwork standing on the card's floor.
  //
  // Source → ours:
  //   • The category line is the source's small uppercase label, rendered as webkit's
  //     `Overline` (the page's own overline anatomy: `//` prefix, accent label, cursor).
  //   • The claim is the source's own sentence, at the section-heading step. It is an
  //     `h3`: this band has no heading of its own, so the cards sit under the page's
  //     `h1` without an `h2` in between — and skipping a level is what breaks a heading
  //     outline, so the cards take the level they are.
  //   • The action is a `MiniButton` on the source's own href. The source writes
  //     "Learn More" on the security card and "Learn more" on the other three; the
  //     casing is carried as-is rather than normalized.
  //   • The art is NOT the source's screenshot. Each card names an asset from webkit's
  //     Illustration registry, so the scenes are built from the same parts (rim light,
  //     nodes, connectors) as every other illustration in the system and follow both
  //     themes for free. This is the one place the band's substance is ours: a
  //     screenshot of a product UI is not a thing this page language draws.
  //
  // Borders, per CONTAINERS.md, are drawn exactly once:
  //   • FrameBox owns the band's floor and the pair of ticks registering it. `flush`
  //     lands its top rule ON the SectionGap above instead of beside it, and
  //     `borders="y"` hands the vertical rules back to the column — which is why
  //     SectionModule passes `:divided="false"`.
  //   • Every internal rule is the divider grid's own `gap-px` over the border colour,
  //     which is why each cell fills its own `--bg-canvas` and none draws a border.
  //   • The only rule a cell draws is the one above its illustration panel, dividing the
  //     copy from the art. That edge is inside the cell, so nothing else owns it.
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import MiniButton from '@aziontech/webkit/mini-button'
  import Overline from '@aziontech/webkit/overline'
  import { CardGrid, SectionModule } from '@shared/ui/layout/index.js'

  import { AiAgentsScene } from '../ui/index.js'

  // One cell per capability, in the source's order. `illustration` names an asset in the
  // webkit Illustration registry, loaded on demand — so a page that never renders this
  // band pays for none of them. Each name is chosen for what the asset DRAWS, which is
  // why `build` (a site shipping beside the mark) leads and `optimize-application` (a
  // site with its scores on a tray) carries the performance cell.
  const capabilities = [
    {
      key: 'modern',
      illustration: 'build',
      label: 'Modern Applications',
      claim:
        'Build static sites, develop serverless applications, or modernize your legacy applications',
      actionLabel: 'Learn more',
      href: 'https://www.azion.com/en/solutions/#development'
    },
    {
      key: 'optimized',
      illustration: 'optimize-application',
      label: 'Optimized workloads',
      claim:
        'Accelerate applications, optimize content delivery (CDN), and process images on demand efficiently',
      actionLabel: 'Learn more',
      href: 'https://www.azion.com/en/solutions/#performance'
    },
    {
      key: 'protected',
      illustration: 'waf-rules',
      label: 'Protect applications and APIs',
      claim:
        'Protect web applications and APIs (WAAP), manage bots, and modernize your security in a programmable and scalable way',
      // The source's own casing on this one card.
      actionLabel: 'Learn More',
      href: 'https://www.azion.com/en/solutions/#security'
    },
    {
      key: 'ai',
      // The only cell whose artwork is not a registered asset: it draws the five AI coding
      // agents, whose brand marks are this app's to hold, not the design system's. See
      // AiAgentsScene.
      scene: AiAgentsScene,
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
      <!-- Two columns, two rows — the source's own 2×2. Below `sm` the grid falls to one
           column and the four cards read in order. -->
      <CardGrid
        variant="divider"
        :columns="2"
        :mobile-columns="1"
      >
        <article
          v-for="capability in capabilities"
          :key="capability.key"
          class="group/capability flex min-w-0 flex-col bg-(--bg-canvas)"
        >
          <!-- The copy half hangs from the cell's top edge; `flex-1` hands the row's
               slack here rather than to the art, so both panels in a row stay one
               height when their claims differ in length. -->
          <div class="flex flex-1 flex-col items-start gap-(--spacing-lg) p-(--spacing-xl)">
            <!-- `-ml-1` cancels the 4px `pl-1` Overline carries, so the label starts on
                 the cell's own left edge with the copy under it. -->
            <Overline
              prefix="//"
              show-cursor
              class="-ml-1"
              >{{ capability.label }}</Overline
            >
            <h3 class="m-0 text-pretty text-heading-md text-(--text-default)">
              {{ capability.claim }}
            </h3>
            <div class="mt-auto">
              <MiniButton
                :label="capability.actionLabel"
                show-icon
                icon="pi pi-arrow-right"
                :href="capability.href"
              />
            </div>
          </div>

          <!-- Fixed height, never stretched: the grid sizes every cell in a row to the
               tallest one, and a growable panel would hand that slack to the art — so two
               panels in the same row would end up different heights whenever their claims
               differ in length. `shrink-0` + a fixed height parks the slack in the copy
               above instead, which is what keeps both panels in a row on one line. -->
          <div
            class="flex h-[clamp(180px,20vw,258px)] shrink-0 items-center justify-center overflow-hidden border-t border-(--border-default) bg-(--bg-surface-raised)"
          >
            <!-- Decorative: the claim above already carries the meaning, so the
                 illustration takes no `ariaLabel` and stays hidden from assistive tech.

                 Hovering the cell sweeps the rim light around the scene: the theme's
                 `illustration-rim-sweep` utility re-declares the rim ramp here so its
                 angle animates (it is frozen at 135° in the `:root` copy), and the whole
                 cell — not just the art — is the target, since the copy is part of the
                 same card. The utility ships the animation paused, so hover only sets it
                 running and leaving freezes the light where it is.

                 The same hover raises `--illustration-gauge-target` to a perfect score:
                 any gauge in the scene inherits it and counts its arc and its number up
                 from the resting measurement the asset ships (and back down on leave).
                 Only the optimized-workloads scene has gauges; on the other three the
                 variable is inert. -->
            <component
              :is="capability.scene ?? Illustration"
              :name="capability.illustration"
              class="illustration-rim-sweep group-hover/capability:[animation-play-state:running] group-hover/capability:[--illustration-gauge-target:100] motion-reduce:animate-none"
            />
          </div>
        </article>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
