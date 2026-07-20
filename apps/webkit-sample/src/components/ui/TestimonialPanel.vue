<script setup>
// The social-proof column shared by Sign Up and Check Inbox: an eyebrow line, a
// large customer quote, the attribution, and the customer wordmark. Purely
// presentational — no props, no state — so both screens render an identical
// panel beside their card.
</script>

<template>
  <aside
    class="flex flex-col items-center gap-[var(--spacing-xl)] text-center"
    aria-label="Customer testimonial"
  >
    <p class="text-body-md text-[var(--text-muted)]">
      Trusted by market leaders across banking, e-commerce, tech, and other
      industries.
    </p>

    <figure
      class="flex max-w-[var(--container-2xl)] flex-col items-center gap-[var(--spacing-lg)]"
    >
      <blockquote class="text-heading-lg text-[var(--text-default)]">
        “With Azion, we can scale our proprietary AI models without worrying
        about infrastructure. Inspecting millions of websites daily, performing
        the fastest takedown in the market.”
      </blockquote>
      <figcaption class="text-body-md text-[var(--text-muted)]">
        Fabio Ramos, CEO of Axur
      </figcaption>
    </figure>

    <!-- Customer wordmark, rendered from type tokens (no external asset). -->
    <p class="text-heading-sm text-[var(--text-default)]">
      <span class="text-[var(--text-muted)]" aria-hidden="true">///</span>AXUR
    </p>
  </aside>
</template>
