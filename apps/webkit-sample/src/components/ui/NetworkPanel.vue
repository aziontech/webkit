<script setup>
  // The art column beside the Sign Up card: the pixelate field as the ground,
  // the network claim as the copy.
  //
  // It replaces the testimonial that used to sit here. A quote is social proof —
  // it argues that other people trust the platform — and at the moment someone
  // is typing an email address the more useful argument is what they are about
  // to be standing on. The claims below are the same set the marketing site's
  // Network section carries (AzionHome.vue), so the number a visitor read on the
  // way in is the number they see while signing up. CheckInbox keeps the
  // testimonial: by then the account exists and the pitch is over.
  //
  // The panel owns its own scrim rather than dimming the banner, because the
  // banner is shared. The field is at full strength in the lower half, where the
  // chips have their own fill to sit on, and washed out under the heading, which
  // has nothing but the ground to hold it.
  import PixelateBanner from '../site/ui/banners/PixelateBanner.vue'

  // Same five claims as the site's Network section — one source of copy, quoted
  // rather than re-invented.
  const claims = [
    '100+ data centers',
    '100+ Tbps throughput',
    'High availability',
    '30 ms median latency',
    'PCI and SOC 2/3 compliant'
  ]
</script>

<template>
  <!-- No radius, no outer border, no max-width: this is a CELL of the signup
       container, and that container owns the rounding and clips the field into
       the corner. The only rule drawn here is the seam against the form half —
       a top edge while stacked, a leading edge once they sit side by side.

       The min-height applies only while stacked. Side by side the grid row
       stretches it to the form's height, and a min-height taller than that
       would push the whole container down. -->
  <aside
    class="relative isolate flex min-h-[320px] overflow-hidden border-t border-[var(--border-default)] bg-[var(--bg-canvas)] lg:min-h-0 lg:border-t-0 lg:border-l"
    aria-label="The Azion network"
  >
    <PixelateBanner />

    <!-- The scrim washes top-down: heaviest under the heading, clearing by the
         floor, where the pool is and the only things over it are chips that
         carry their own fill.

         It follows the copy, and at 4 of 12 columns the copy runs the panel's
         full width at every breakpoint — so there is no clear side to protect
         and the wash has to travel the other axis. Two shapes tried earlier
         failed for reasons worth keeping: a LEFT-TO-RIGHT wash ran its
         transition straight down the grid, and a straight edge across a regular
         lattice is a seam you can see — the dots stepped from dim to bright
         along one column. A DIAGONAL fixed that (it crosses at an angle no row
         or column shares) and was right while the panel was half the page wide
         and the copy kept to one side of it; in a narrow column it clears the
         corner the copy occupies and dims the corner it doesn't.

         What stays true from both: never wash the whole field evenly. Dimming a
         glow uniformly is how a lit field turns into a flat brown rectangle —
         measured 0.12 alpha where the design calls for 0.70. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,var(--bg-canvas)_0%,color-mix(in_srgb,var(--bg-canvas)_74%,transparent)_46%,color-mix(in_srgb,var(--bg-canvas)_18%,transparent)_100%)]"
    />

    <div
      class="relative z-10 flex flex-1 flex-col justify-between gap-[var(--spacing-xxl)] p-[var(--spacing-xl)] lg:p-[var(--spacing-xxl)]"
    >
      <header class="flex flex-col gap-[var(--spacing-md)]">
        <p
          class="text-overline-md text-[var(--text-muted)] uppercase"
        >
          The Azion network
        </p>
        <h2 class="text-balance text-heading-xl text-[var(--text-default)]">
          The most reliable infrastructure
        </h2>
        <p class="max-w-[var(--container-sm)] text-pretty text-body-md text-[var(--text-muted)]">
          Every account runs on the same distributed network from the first
          deploy — no tier to upgrade into, no region to pick.
        </p>
      </header>

      <ul class="flex flex-wrap gap-[var(--spacing-xs)]">
        <!-- The soft-accent claim chip, matching the site's Network section
             verbatim. No Tag severity ships this treatment (accent is a solid
             blue fill, primary a solid orange), so both places compose it from
             the primary token — a DS gap worth a `subtle` severity on Tag. -->
        <li
          v-for="claim in claims"
          :key="claim"
          class="inline-flex h-8 items-center rounded-[var(--shape-elements)] border border-[color-mix(in_srgb,var(--primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] px-[var(--spacing-xs)] text-label-md text-[var(--text-default)] backdrop-blur-sm"
        >
          {{ claim }}
        </li>
      </ul>
    </div>
  </aside>
</template>
