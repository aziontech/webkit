<script setup>
  // The product catalogue, grouped the way azion.com groups it — Build, Store, Protect, Observe —
  // with one registered illustration per product.
  //
  // Every cell's artwork is `<Illustration name="…" />`: an asset composed from the webkit
  // illustration parts, not an exported SVG. That is the whole point of the section — the same
  // assets that live in Storybook are what ships on the page, so a product's picture cannot
  // drift from the system that draws it.
  //
  // EVERY `name` BELOW IS A KEY THE REGISTRY ACTUALLY SHIPS, and that has to be checked by
  // hand: `Illustration` falls back to a `PLACE DESIGN ASSET` placeholder for a name it does
  // not know, silently — no warning, no error, and a grid of twelve placeholders looks
  // deliberate until you compare it with the registry. This component carried twelve invented
  // names (`functions`, `sql-database`, `bot-manager`, …) from the day it was written and
  // nothing caught it, because nothing routed it.
  //
  // THE ONE LOOSE PAIRING is Object Storage: the registry ships no storage asset, so the cell
  // takes `saas-platforms`. Recorded rather than papered over.
  //
  // Layout follows CONTAINERS.md: a framed column owning `border-x`, a stack of modules each
  // owning their `border-t`, and edge-to-edge `CardGrid kind="divider"` bodies whose 1px gaps
  // are the internal rules. No cell draws a border of its own, and none is rounded.
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'

  defineProps({
    // When false, render only the module stack — no framed column — so a host page that already
    // owns a SectionContainer can drop these modules straight into its own frame.
    framed: { type: Boolean, default: true }
  })

  const groups = [
    {
      key: 'build',
      title: 'Build',
      description: 'Code, media, and inference running at the edge, close to whoever asks.',
      products: [
        {
          name: 'build-applications',
          title: 'Functions',
          body: 'Run code at the edge, with no server to maintain.'
        },
        {
          name: 'ai-applications',
          title: 'AI Inference',
          body: 'Inference and agents right next to your data.'
        },
        {
          name: 'fastest-path-to-live-website',
          title: 'Image Processor',
          body: 'One origin, every format negotiated at delivery.'
        }
      ]
    },
    {
      key: 'store',
      title: 'Store',
      description: 'Data persisted where the request lands, not in a distant region.',
      products: [
        {
          name: 'distributed-apis',
          title: 'SQL Database',
          body: 'A distributed relational database, queried at the edge.'
        },
        {
          name: 'saas-platforms',
          title: 'Object Storage',
          body: 'Objects served from the point closest to the user.'
        },
        {
          name: 'implement-api-gateway-security',
          title: 'Credentials',
          body: 'Per-environment keys, rotated with zero downtime.'
        }
      ]
    },
    {
      key: 'protect',
      title: 'Protect',
      description: 'Traffic inspected before it ever reaches your origin.',
      products: [
        {
          name: 'programmable-security',
          title: 'WAF',
          body: 'Rules applied at the edge, ahead of your backend.'
        },
        {
          name: 'automate-threat-mitigation',
          title: 'Bot Manager',
          body: 'Bots identified and stopped on the way in.'
        },
        {
          name: 'dns-protection',
          title: 'Network Shield',
          body: 'The entire network as your defense perimeter.'
        }
      ]
    },
    {
      key: 'observe',
      title: 'Observe',
      description: 'Every request recorded, every decision traceable.',
      products: [
        {
          name: 'live-debugging',
          title: 'Real-Time Metrics',
          body: 'Latency and volume in real time, with no sampling.'
        },
        {
          name: 'runtime',
          title: 'Edge Pulse',
          body: 'Perceived quality measured in the real browser.'
        },
        {
          name: 'infrastructure-as-code',
          title: 'Deploy Path',
          body: 'From branch to production, with a preview at every step.'
        }
      ]
    }
  ]
</script>

<template>
  <component :is="framed ? SectionContainer : 'div'">
    <!-- The rule between two modules belongs to the lower one. Framed, this component is its own
         column and its first group opens it (no rule above); unframed, it stacks under the host
         page's modules, so even the first group owns its top rule. -->
    <!-- The group's own anchor: the Products mega-menu's four headings point at these, so a
         reader who opened the panel on `Store` lands on that group rather than on the top of
         the catalogue. -->
    <SectionModule
      v-for="(group, index) in groups"
      :id="group.key"
      :key="group.key"
      :divided="index > 0"
      :padded="false"
      :title="group.title"
      :description="group.description"
      class="scroll-mt-(--spacing-xxl)"
    >
      <CardGrid
        kind="divider"
        :columns="3"
      >
        <!-- The cell is a `FrameBox` drawing neither borders nor ticks: the seams are the
             grid's own `gap-px`, and a bordered cell would double every one of them. It
             fills the canvas over that fill, which is what turns the gaps into rules.

             AN ODD GROUP WOULD LEAVE A CELL BARE in the two-up band (`sm`-`lg`), and a bare
             cell of a divider grid shows the grid's rule colour as a grey slab. So the last
             product takes that cell when the count is odd, and drops back to one track at
             `lg` where three columns divide the row exactly. -->
        <FrameBox
          v-for="(product, productIndex) in group.products"
          :key="product.name"
          borders="none"
          marks="none"
          class="min-w-0 bg-(--bg-canvas)"
          :class="
            productIndex === group.products.length - 1 && group.products.length % 2 === 1
              ? 'sm:col-span-2 lg:col-span-1'
              : ''
          "
        >
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
            <Illustration
              :name="product.name"
              :aria-label="`${product.title}: ${product.body}`"
            />
            <div class="flex flex-col gap-(--spacing-xxs)">
              <h3 class="m-0 text-heading-xxs text-(--text-default)">{{ product.title }}</h3>
              <p class="m-0 text-pretty text-body-sm text-(--text-muted)">{{ product.body }}</p>
            </div>
          </div>
        </FrameBox>
      </CardGrid>
    </SectionModule>
  </component>
</template>
