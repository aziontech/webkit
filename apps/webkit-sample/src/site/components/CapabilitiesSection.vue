<script setup>
  // What you build on the platform — the copy-beside-bento band from Figma (node 1626:7014).
  //
  // Shape: a three-column hairline grid. The first column spans both rows and holds the
  // section's whole argument (overline → headline → description → one CTA); the other two
  // hold a 2x2 of capabilities, each an illustration panel over its own caption. The copy
  // is a GRID CELL here, not a centered SectionTitle header — that is the only structural
  // difference from the other bands on this page, and it is what makes the four
  // capabilities read as the substance OF the headline rather than as a list below it.
  //
  // Borders, per CONTAINERS.md, are drawn exactly once:
  //   • FrameBox owns the band's top rule and the four registration squares. `flush` lands
  //     that rule ON the SectionGap above instead of beside it, and `borders="y"` hands the
  //     vertical rules back to the column, so SectionModule passes `:divided="false"`.
  //   • Every internal rule is the divider grid's own `gap-px` over the border colour —
  //     which is why each cell fills its own `--bg-canvas` and none draws a border.
  //   • The only rule a cell draws is the one under its illustration panel, dividing the
  //     art from the caption. That edge is inside the cell, so nothing else owns it.
  //
  // The art is not redrawn here: each panel names an asset from webkit's Illustration
  // registry, so the scenes are built from the same parts (rim light, nodes, connectors)
  // as every other illustration in the system and follow both themes for free.
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import Overline from '@aziontech/webkit/overline'
  import { CardGrid, SectionModule } from '@shared/ui/layout/index.js'

  import { AiAgentsScene } from '../ui/index.js'

  // One cell per capability. `illustration` names an asset in the webkit Illustration
  // registry, loaded on demand — so a page that never renders this band pays for none of
  // them. Each name is chosen for what the asset DRAWS, which is why `build` (a site
  // shipping beside the mark) leads and `optimize-application` (a site with its scores on
  // a tray) carries the performance cell.
  const capabilities = [
    {
      key: 'modern',
      illustration: 'build',
      title: 'Modern Applications',
      description:
        'Build static sites, develop serverless applications, or modernize your legacy applications'
    },
    {
      key: 'optimized',
      illustration: 'optimize-application',
      title: 'Optimized workloads',
      description:
        'Accelerate applications, optimize content delivery (CDN), and process images on demand efficiently'
    },
    {
      key: 'protected',
      illustration: 'waf-rules',
      title: 'Protect applications and APIs',
      description:
        'Protect web applications and APIs (WAAP), manage bots, and modernize your security in a programmable and scalable way'
    },
    {
      key: 'ai',
      // The only cell whose artwork is not a registered asset: it draws the five AI coding
      // agents, whose brand marks are this app's to hold, not the design system's. See
      // AiAgentsScene.
      scene: AiAgentsScene,
      title: 'Build AI applications',
      description:
        'Build and deploy AI agents and AI-powered applications on a distributed platform that delivers the best value in the market'
    }
  ]
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <!-- `flush` + `marks="bottom"`: the SectionGap above draws the rule they share and
         ticks its corners, so this band adds neither a second hairline nor a second
         square beside them — it owns only its own floor. -->
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <!-- Three columns at `lg`. Below that the copy takes the full width and the
           capabilities fall into the 2x2 the grid already gives them, so the band never
           degrades into a single tall file of four panels. -->
      <CardGrid
        variant="divider"
        :columns="3"
        :mobile-columns="1"
      >
        <!-- ── The argument ────────────────────────────────────────────────────
             Spans both rows of the bento at `lg` so the copy sits against all four
             capabilities at once. Its own vertical rhythm is two gaps, not one: the
             block of copy holds together at `lg`, and the CTA stands off it at `xl`. -->
        <div
          class="flex flex-col justify-start gap-[var(--spacing-xl)] bg-[var(--bg-canvas)] p-[var(--spacing-xl)] sm:col-span-2 lg:col-span-1 lg:row-span-2"
        >
          <div class="flex flex-col gap-[var(--spacing-lg)]">
            <!-- The page's overline anatomy — `//` prefix, accent label, blinking cursor —
                 configured on webkit's Overline. `-ml-1` cancels the 4px `pl-1` the
                 component carries, so the label starts on the cell's own left edge. -->
            <Overline
              prefix="//"
              show-cursor
              class="-ml-1"
              >Build on Azion</Overline
            >
            <!-- The headline does not enumerate the four cells — they are right beside it
                 and do that themselves. It states the claim they prove. -->
            <h2 class="m-0 text-balance text-heading-xl text-[var(--text-default)]">
              Everything your workload needs, on one platform
            </h2>
            <p class="m-0 text-pretty text-heading-sm text-[var(--text-muted)]">
              Build, accelerate, protect, and run AI on the same distributed network — without
              stitching four providers together to do it.
            </p>
          </div>

          <div class="flex items-center gap-[var(--spacing-md)]">
            <Button
              label="Read the docs"
              kind="outlined"
              size="large"
              href="/site/docs"
            />
          </div>
        </div>

        <!-- ── The capabilities ────────────────────────────────────────────────
             Art over caption. The panel is a surface inside the canvas cell, closed by
             the one rule the cell owns; the caption sits on the canvas below it, on the
             same 48px inset as the copy column so the whole band shares one padding. -->
        <article
          v-for="capability in capabilities"
          :key="capability.key"
          class="group/capability flex flex-col bg-[var(--bg-canvas)]"
        >
          <!-- Fixed height, never stretched: the grid sizes every cell in a row to the
               tallest one, and a growable panel would hand that slack to the art — so two
               panels in the same row would end up different heights whenever their captions
               differ in length. `shrink-0` + a fixed height parks the slack under the
               caption instead, which is what keeps all four panels on one line. -->
          <div
            class="flex h-[clamp(180px,20vw,258px)] shrink-0 items-center justify-center overflow-hidden border-b border-[var(--border-default)] bg-[var(--bg-surface-raised)]"
          >
            <!-- Decorative: the caption beneath already carries the meaning, so the
                 illustration takes no `ariaLabel` and stays hidden from assistive tech.

                 Hovering the cell sweeps the rim light around the scene: the theme's
                 `illustration-rim-sweep` utility re-declares the rim ramp here so its
                 angle animates (it is frozen at 135° in the `:root` copy), and the whole
                 cell — not just the art — is the target, since the caption is part of the
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

          <div class="flex flex-col gap-[var(--spacing-xxs)] p-[var(--spacing-xl)]">
            <h3 class="m-0 text-pretty text-heading-xs text-[var(--text-default)]">
              {{ capability.title }}
            </h3>
            <p class="m-0 text-pretty text-heading-xxs text-[var(--text-muted)]">
              {{ capability.description }}
            </p>
          </div>
        </article>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
