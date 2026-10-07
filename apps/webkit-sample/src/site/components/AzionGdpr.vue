<script setup>
  // Translated page — https://resend.com/security/gdpr, block for block, per
  // .claude/skills/site-design-translate. Rendered inside SiteLayout (website nav + footer, no
  // console sidebar), reached at /site/gdpr.
  //
  // ── THE SOURCE'S SHAPE ──
  // The live page is a flat article, not a typical marketing page of hero/cards/grids: an H1 +
  // one line, an "Ask AI to explain" utility band, then 16 question/answer sections with no
  // shared "FAQ" heading of their own — each question already IS a heading. That shape maps
  // cleanly onto this design system's own FAQ pattern (see AzionPricing.vue's `Accordion` FAQ,
  // the one place in this codebase already built for exactly this content shape), rather than 16
  // separate framed modules, which is the single form decision this translation makes.
  //
  //   hero        BannerContainer hero, one viewport, centered HeroTitle — no eyebrow, no
  //               actions: the source's hero has neither.
  //   ask-ai      SectionModule (first, :divided="false") — title + description + a row of 4
  //               secondary buttons, one per tool. None of the four has a mark in the shared
  //               brand registry, so every button carries the same generic `pi-sparkles` glyph
  //               rather than a fabricated brand logo (see migration.md).
  //   spacer      SectionGap hatch
  //   faq         SectionModule (:divided="false", :padded="false") wrapping one `Accordion` of
  //               the 16 Q&A sections, in source order — copy lives in ../data/gdpr.js.
  //   spacer      the closing, borderless spacer (see AzionCompliance.vue) — the footer below
  //               opens with its own full-bleed rule, so a bordered spacer here would double it.
  //
  // ── THE REBRAND, AND WHAT COULD NOT CARRY OVER VERBATIM ──
  // See the header comment in ../data/gdpr.js for both: every "Resend" in the source becomes
  // "Azion" (a user-confirmed choice, made after the risk of asserting unverified compliance
  // claims about a real company was flagged), and every link the source points at a Resend-only
  // page (the DPA document, the Documents portal, the subprocessors list, the cookie policy,
  // Terms, Privacy Policy) renders as plain text instead of a fabricated route.
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import { ASK_AI_LINKS, GDPR_FAQ } from '../data/gdpr.js'

  const LINK_CLASS =
    'rounded-(--shape-elements) text-(--text-default) underline decoration-(--border-strong) underline-offset-2 transition-colors duration-150 ease-out hover:text-(--primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none'
</script>

<template>
  <!-- ══ The hero ═══════════════════════════════════════════════════════════════
       Hero owns the full-bleed band and the page's top rule. The source's own hero
       is a short, plain band (title + one line, no art, no actions) — ours is still one
       viewport, this site's own rule for every hero regardless of the source's height. -->
  <Hero
    texture="dots"
    texture-fade="bottom"
    kind="screen"
    align="center"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <HeroTitle
      centered
      title="GDPR"
      description="Azion is GDPR compliant. We have made it a priority to protect your data."
    />
  </Hero>

  <!-- ══ The framed column ══════════════════════════════════════════════════════ -->
  <SectionContainer max-width="site">
    <!-- ── Ask AI to explain ─────────────────────────────────────────────────── -->
    <SectionModule
      :divided="false"
      title="Ask AI to explain"
      description="Get a concise, human-readable summary of this security page."
    >
      <div class="flex flex-wrap gap-(--spacing-sm)">
        <Button
          v-for="tool in ASK_AI_LINKS"
          :key="tool.label"
          :label="tool.label"
          kind="secondary"
          size="small"
          icon="pi pi-sparkles"
          :href="tool.href"
          target="_blank"
        />
      </div>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── The 16 questions, in source order ─────────────────────────────────── -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <Accordion
          type="single"
          collapsible
          size="large"
        >
          <Accordion.Item
            v-for="(item, index) in GDPR_FAQ"
            :id="item.id"
            :key="item.id"
            :value="item.id"
            :class="[
              'border-(--border-default) data-[state=open]:border-b',
              index === GDPR_FAQ.length - 1 && 'border-b-0 data-[state=open]:border-b-0'
            ]"
          >
            <Accordion.Trigger
              class="border-b-0! py-(--spacing-md) data-[state=open]:min-h-0 data-[state=open]:pb-0"
            >
              <span class="text-body-md text-(--text-default)">{{ item.question }}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              <div
                class="flex max-w-(--container-2xl) flex-col gap-(--spacing-sm) px-(--spacing-lg) pt-(--spacing-xs) pb-(--spacing-md)"
              >
                <template
                  v-for="(block, bi) in item.body"
                  :key="bi"
                >
                  <p
                    v-if="block.type === 'p'"
                    class="m-0 text-body-sm text-(--text-muted)"
                  >
                    <template
                      v-for="(seg, si) in block.segments"
                      :key="si"
                    >
                      <a
                        v-if="seg.href"
                        :href="seg.href"
                        :target="seg.external ? '_blank' : undefined"
                        :rel="seg.external ? 'noopener noreferrer' : undefined"
                        :class="LINK_CLASS"
                        >{{ seg.text }}</a
                      >
                      <template v-else>{{ seg.text }}</template>
                    </template>
                  </p>
                  <ul
                    v-else-if="block.type === 'ul'"
                    class="m-0 list-disc space-y-(--spacing-xxs) pl-(--spacing-lg) text-body-sm text-(--text-muted)"
                  >
                    <li
                      v-for="(li, li_i) in block.items"
                      :key="li_i"
                    >
                      <template
                        v-for="(seg, si) in li"
                        :key="si"
                      >
                        <a
                          v-if="seg.href"
                          :href="seg.href"
                          :target="seg.external ? '_blank' : undefined"
                          :rel="seg.external ? 'noopener noreferrer' : undefined"
                          :class="LINK_CLASS"
                          >{{ seg.text }}</a
                        >
                        <template v-else>{{ seg.text }}</template>
                      </template>
                    </li>
                  </ul>
                </template>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </FrameBox>
    </SectionModule>

    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
</template>
