<script setup>
  // Marketing site footer — the azion.com/pt-br footer, now composed from the DS
  // `Footer` (@aziontech/webkit/footer) instead of a hand-built grid. The component
  // owns the anatomy: the canvas shell, the 5xl measure, the 2→4 column grid at `md`,
  // the per-column dividers and the social bar under its hairline. This file supplies
  // only content — four link columns, the brand and social cluster, and the legal bar.
  //
  // Two site-specific things it still owns:
  //
  //   · the CLOSE of the page frame, built on the HERO's own logic. The hero is a
  //     full-bleed band that owns the page's top rule edge to edge; the footer is its
  //     mirror at the bottom — a `w-full` rule OPENS the container, then a FrameBox at the
  //     column's 5xl measure FINISHES it, so the vertical pair SectionContainer draws down
  //     the page turns the corner instead of stopping at it. The frame is therefore always
  //     `flush`: the band's own rule is the one at that pixel, never two.
  //
  //     This is also why the footer needs no prop for its neighbour. A full-bleed rule is
  //     correct under a page that closes with a spacer AND under one that just ends (the
  //     Hub) — which a 5xl `border-t` was not, since it stopped short of that page's own
  //     7xl column. The band above must simply not draw a bottom rule; the closing spacer
  //     on the landings is a borderless FrameBox for exactly that reason.
  //   · the legal bar, which the DS anatomy has no region for. It rides in `social-end`
  //     opposite the brand, which is the only cluster shaped to hold it.
  //
  // Every link is a `#` anchor for the demo.
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
  import FrameBox from '@aziontech/webkit/frame-box'
  import IconButton from '@aziontech/webkit/icon-button'

  const columns = [
    {
      label: 'Products',
      links: [
        'Functions',
        'Cache',
        'Object Storage',
        'SQL Database',
        'WAF',
        'Edge DNS',
        'Data Stream'
      ]
    },
    {
      label: 'Solutions',
      links: [
        'Web Apps',
        'AI',
        'Application Security',
        'Financial Services',
        'Retail',
        'Technology'
      ]
    },
    {
      label: 'Developers',
      links: [
        'Documentation',
        'API Reference',
        'Dev Tools',
        'Release Notes',
        'Marketplace',
        'Status'
      ]
    },
    {
      label: 'Company',
      links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact']
    }
  ]

  const legal = ['Terms of Use', 'Privacy', 'Cookies', 'Security']

  const socials = [
    { icon: 'ai ai-x', label: 'X' },
    { icon: 'ai ai-medium', label: 'Medium' },
    { icon: 'pi pi-github', label: 'GitHub' },
    { icon: 'pi pi-linkedin', label: 'LinkedIn' }
  ]

  const year = new Date().getFullYear()
</script>

<template>
  <div class="w-full border-t border-(--border-default)">
    <FrameBox
      flush
      marks="bottom"
      class="mx-auto w-full max-w-(--container-5xl)"
    >
      <Footer aria-label="Footer">
        <Footer.Column
          v-for="column in columns"
          :key="column.label"
          :title="column.label"
        >
          <Footer.Link
            v-for="link in column.links"
            :key="link"
            href="#"
          >
            {{ link }}
          </Footer.Link>
        </Footer.Column>

        <template #social-start>
          <Brand
            kind="default"
            size="small"
          />
          <div class="flex items-center gap-(--spacing-xxs)">
            <IconButton
              v-for="social in socials"
              :key="social.label"
              :icon="social.icon"
              :aria-label="social.label"
              kind="transparent"
              size="medium"
              href="#"
            />
          </div>
        </template>

        <template #social-end>
          <span class="text-body-xs text-(--text-muted)">
            © {{ year }} Azion Technologies. All rights reserved.
          </span>
          <Footer.Link
            v-for="item in legal"
            :key="item"
            href="#"
          >
            {{ item }}
          </Footer.Link>
        </template>
      </Footer>
    </FrameBox>
  </div>
</template>
