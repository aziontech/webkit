<script setup>
  // Marketing site footer — the azion.com/pt-br footer, composed from the DS
  // `Footer` (@aziontech/webkit/footer) in the anatomy its Storybook "Default"
  // story documents: four link columns, then a row carrying the social icon
  // buttons at the left and the status indicator + language select at the right,
  // then the signature band with the brand mark beside its tagline, and finally
  // the component's own closing band.
  //
  // The component owns all of that — the canvas shell, the 5xl measure, the 2→4
  // column grid at `md`, the framed gutters that carry the page frame out to the
  // viewport edges from `xl`, the per-column dividers, and the closing band that
  // finishes the frame at the bottom of the page. This file supplies only content.
  //
  // The one site-specific thing left is the OPEN of that frame: a full-bleed rule
  // above the footer, built on the HERO's own logic. The hero is a full-bleed band
  // that owns the page's top rule edge to edge; this rule is its mirror at the
  // bottom, so the vertical pair SectionContainer draws down the page turns the
  // corner instead of stopping at it. The footer draws no top rule of its own, so
  // there are never two at that pixel — and a full-bleed rule is correct under a
  // page that closes with a spacer AND under one that just ends (the Hub), which a
  // 5xl rule was not. The band above must simply not draw a bottom rule; the
  // closing spacer on the landings is a borderless FrameBox for exactly that reason.
  //
  // Every column link is a `#` anchor for the demo; the social buttons point at the
  // real profiles, as the story does.
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

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

  const socials = [
    { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
    {
      icon: 'pi pi-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    { icon: 'pi pi-youtube', label: 'Azion on YouTube', href: 'https://www.youtube.com/aziontech' },
    { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
    {
      icon: 'pi pi-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
    { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
  ]

  const language = ref('en')

  const languageOptions = [
    { value: 'en', label: 'EN' },
    { value: 'pt-br', label: 'PT-BR' },
    { value: 'es', label: 'ES' }
  ]
</script>

<template>
  <div class="w-full border-t border-(--border-default)">
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

      <template #social>
        <IconButton
          v-for="social in socials"
          :key="social.label"
          kind="transparent"
          :icon="social.icon"
          :aria-label="social.label"
          :href="social.href"
          target="_blank"
        />
      </template>

      <template #status>
        <StatusIndicator
          severity="success"
          label="All Systems Operational"
        />
      </template>

      <template #language>
        <div class="w-24">
          <Select
            v-model="language"
            placeholder="Language"
          >
            <Select.Trigger aria-label="Language" />
            <Select.Content>
              <Select.Option
                v-for="option in languageOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </div>
      </template>

      <template #brand>
        <a
          href="#"
          aria-label="Azion home"
        >
          <Brand size="large" />
        </a>
      </template>

      <template #tagline>The web platform for modern workloads</template>
    </Footer>
  </div>
</template>
