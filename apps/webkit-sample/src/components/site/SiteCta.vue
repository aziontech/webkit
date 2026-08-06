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
  import Overline from '@aziontech/webkit/overline'
  import { useRouter } from 'vue-router'

  import { SectionModule } from './foundations/components/layout/index.js'

  const router = useRouter()
  const goSignup = () => router.push('/signup')
</script>

<template>
  <SectionModule
    id="contact"
    :divided="false"
    :padded="false"
    class="scroll-mt-[var(--spacing-xxl)]"
  >
    <div class="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
      <!-- The pitch, on the raised surface. -->
      <div
        class="flex flex-col justify-between gap-[var(--spacing-xxl)] bg-[var(--bg-surface-raised)] p-[var(--spacing-xl)]"
      >
        <div class="flex flex-col gap-[var(--spacing-lg)]">
          <Overline
            prefix="//"
            show-cursor
            >Build</Overline
          >
          <!-- One heading, two tones: the claim in full contrast, its consequence
               muted. Two spans, not two headings — it is one sentence. -->
          <h2 class="m-0 text-balance text-heading-xl">
            <span class="block text-[var(--text-default)]">Build once.</span>
            <span class="block text-[var(--text-muted)]">Run anywhere.</span>
          </h2>
        </div>

        <div>
          <Button
            label="Start for free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
        </div>
      </div>

      <!-- The supporting line and the secondary action. -->
      <div
        class="flex flex-col justify-between gap-[var(--spacing-xxl)] border-t border-[var(--border-muted)] p-[var(--spacing-xl)] lg:border-l lg:border-t-0"
      >
        <p class="m-0 text-pretty text-heading-sm text-[var(--text-muted)]">
          Get a faster path to launch, less latency, and less infrastructure overhead.
        </p>
        <Button
          label="Talk to our team"
          kind="outlined"
          size="large"
          class="w-full"
          href="#"
        />
      </div>
    </div>
  </SectionModule>
</template>
