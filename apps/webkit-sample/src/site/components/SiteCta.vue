<script setup>
  // Closing CTA band — Figma `Illustrations` node 365:114207.
  //
  // Two columns at the design's 894/383 split (7fr/3fr): the pitch on a raised
  // surface, then the supporting line and the secondary action on the canvas beside
  // it. Both columns push their button to the floor, which is what makes the two
  // actions share a baseline at any height.
  //
  // Figma → ours, where the two disagree:
  //   • The left panel's `#141414` fill is exactly `--bg-surface-raised`, and `#999`
  //     on the second headline line is exactly `--text-muted`, so both map straight
  //     across rather than being carried over as hex.
  //   • The design rounds the panel's left corners by 4px. This page's language keeps
  //     section bands square (CONTAINERS.md: grid cells and bands are `--shape-flat`),
  //     and a 4px radius is below the system's own `--shape-elements` step anyway, so
  //     the band stays square here. Recorded rather than silently inherited.
  //   • Its buttons are raw fills; ours are `Button` kinds — `secondary` is the light
  //     fill the design shows, `outlined` the bordered dark one.
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Overline from '@aziontech/webkit/overline'
  import { SectionModule } from '@shared/ui/layout/index.js'
  import { useRouter } from 'vue-router'

  // Every string is a prop so the band can close a second page in that page's own
  // language (the pt-BR pricing page does). The defaults ARE the homepage's copy, so a
  // caller that passes nothing renders exactly what this band has always rendered.
  defineProps({
    // Accent label above the headline.
    eyebrow: { type: String, default: 'Build' },
    // First line of the headline, in full contrast.
    title: { type: String, default: 'Build once.' },
    // Second line, muted — the consequence of the first. One sentence, two tones.
    titleMuted: { type: String, default: 'Run anywhere.' },
    // The supporting line in the right column.
    description: {
      type: String,
      default: 'Get a faster path to launch, less latency, and less infrastructure overhead.'
    },
    // The band's own action, and the secondary one beside it.
    primaryLabel: { type: String, default: 'Start for free' },
    secondaryLabel: { type: String, default: 'Talk to our team' }
  })

  const router = useRouter()
  const goSignup = () => router.push('/signup')
</script>

<template>
  <SectionModule
    id="contact"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <!-- The band is a registration frame like every other brick in the column — without
         one it drew no rules and no ticks at all, so the closing pitch was the one section
         that floated between its neighbours instead of being registered to them. `flush`
         leaves the rule above to the SectionGap, `borders="y"` hands the vertical rules
         back to the column, and `marks="bottom"` ticks the one junction nothing else
         draws: this band's own floor. -->
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <!-- The pitch, on the raised surface. -->
        <div
          class="flex flex-col justify-between gap-(--spacing-xxl) bg-(--bg-surface-raised) p-(--spacing-xl)"
        >
          <div class="flex flex-col gap-(--spacing-lg)">
            <Overline
              prefix="//"
              show-cursor
              >{{ eyebrow }}</Overline
            >
            <!-- One heading, two tones: the claim in full contrast, its consequence
                 muted. Two spans, not two headings — it is one sentence. -->
            <h2 class="m-0 text-balance text-heading-xl">
              <span class="block text-(--text-default)">{{ title }}</span>
              <span class="block text-(--text-muted)">{{ titleMuted }}</span>
            </h2>
          </div>

          <div>
            <Button
              :label="primaryLabel"
              kind="secondary"
              size="large"
              @click="goSignup"
            />
          </div>
        </div>

        <!-- The supporting line and the secondary action. The rule between the halves is
             this cell's, at the frame's own `--border-default`: an internal divider a step
             lighter than the band's rules met them mid-line at the two junctions. -->
        <div
          class="flex flex-col justify-between gap-(--spacing-xxl) border-t border-(--border-default) p-(--spacing-xl) lg:border-l lg:border-t-0"
        >
          <p class="m-0 text-pretty text-heading-sm text-(--text-muted)">
            {{ description }}
          </p>
          <Button
            :label="secondaryLabel"
            kind="outlined"
            size="large"
            class="w-full"
            href="#"
          />
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
