<script setup>
  // The product catalogue, grouped the way azion.com groups it — Build, Store, Protect, Observe —
  // with one registered illustration per product.
  //
  // Every cell's artwork is `<Illustration name="…" />`: an asset composed from the webkit
  // illustration parts, not an exported SVG. That is the whole point of the section — the same
  // fifteen assets that live in Storybook are what ships on the page, so a product's picture
  // cannot drift from the system that draws it.
  //
  // Layout follows CONTAINERS.md: a framed column owning `border-x`, a stack of modules each
  // owning their `border-t`, and edge-to-edge `CardGrid variant="divider"` bodies whose 1px gaps
  // are the internal rules. No cell draws a border of its own, and none is rounded.
  import Illustration from '@aziontech/webkit/illustration'
  import { CardGrid, SectionContainer, SectionModule } from '@shared/ui/layout/index.js'

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
          name: 'functions',
          title: 'Functions',
          body: 'Run code at the edge, with no server to maintain.'
        },
        {
          name: 'ai-inference',
          title: 'AI Inference',
          body: 'Inference and agents right next to your data.'
        },
        {
          name: 'image-processor',
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
          name: 'sql-database',
          title: 'SQL Database',
          body: 'A distributed relational database, queried at the edge.'
        },
        {
          name: 'edge-storage',
          title: 'Object Storage',
          body: 'Objects served from the point closest to the user.'
        },
        {
          name: 'api-keys',
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
          name: 'waf-rules',
          title: 'WAF',
          body: 'Rules applied at the edge, ahead of your backend.'
        },
        {
          name: 'bot-manager',
          title: 'Bot Manager',
          body: 'Bots identified and stopped on the way in.'
        },
        {
          name: 'azion-highlight',
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
          name: 'traffic-chart',
          title: 'Real-Time Metrics',
          body: 'Latency and volume in real time, with no sampling.'
        },
        {
          name: 'optimize-application',
          title: 'Edge Pulse',
          body: 'Perceived quality measured in the real browser.'
        },
        {
          name: 'path',
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
    <SectionModule
      v-for="(group, index) in groups"
      :key="group.key"
      :divided="index > 0"
      :padded="false"
      :title="group.title"
      :description="group.description"
    >
      <CardGrid
        variant="divider"
        :columns="3"
      >
        <article
          v-for="product in group.products"
          :key="product.name"
          class="flex flex-col gap-[var(--spacing-md)] bg-[var(--bg-canvas)] p-[var(--spacing-lg)]"
        >
          <Illustration
            :name="product.name"
            :aria-label="`${product.title}: ${product.body}`"
          />
          <div class="flex flex-col gap-[var(--spacing-xxs)]">
            <h3 class="text-heading-xxs text-[var(--text-default)]">{{ product.title }}</h3>
            <p class="text-pretty text-body-sm text-[var(--text-muted)]">{{ product.body }}</p>
          </div>
        </article>
      </CardGrid>
    </SectionModule>
  </component>
</template>
