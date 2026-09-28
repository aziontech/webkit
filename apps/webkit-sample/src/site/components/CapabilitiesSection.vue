<script setup>
  import Button from '@aziontech/webkit/button'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import SectionModule from '@aziontech/webkit/section-module'

  // Labels, claims, action labels and hrefs are the source's own, carried verbatim —
  // including the one card that writes "Learn More" where the other three write "Learn more".
  const capabilities = [
    {
      key: 'modern',
      illustration: 'modern-frontends',
      label: 'Modern Applications',
      claim:
        'Build static sites, develop serverless applications, or modernize your legacy applications',
      actionLabel: 'Learn more',
      href: 'https://www.azion.com/en/solutions/#development'
    },
    {
      key: 'optimized',
      illustration: 'fastest-path-to-live-website',
      label: 'Optimized workloads',
      claim:
        'Accelerate applications, optimize content delivery (CDN), and process images on demand efficiently',
      actionLabel: 'Learn more',
      href: 'https://www.azion.com/en/solutions/#performance'
    },
    {
      key: 'protected',
      illustration: 'automate-threat-mitigation',
      label: 'Protect applications and APIs',
      claim:
        'Protect web applications and APIs (WAAP), manage bots, and modernize your security in a programmable and scalable way',
      actionLabel: 'Learn More',
      href: 'https://www.azion.com/en/solutions/#security'
    },
    {
      key: 'ai',
      illustration: 'deploy-secure-mcp-server',
      label: 'Build AI applications',
      claim:
        'Build and deploy AI agents and AI-powered applications on a distributed platform that delivers the best value in the market',
      actionLabel: 'Learn more',
      href: 'https://www.azion.com/en/solutions/#ai'
    }
  ]
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <CardGrid
        kind="divider"
        :columns="2"
      >
        <MediaSplit
          v-for="capability in capabilities"
          :key="capability.key"
          :media-href="capability.href"
          orientation="vertical"
          kind="media-start"
          :divided="false"
          :eyebrow="capability.label"
          :title="capability.claim"
          :heading-level="3"
          texture="dots"
          texture-fade="bottom"
        >
          <template #actions>
            <Button
              :label="capability.actionLabel"
              kind="secondary"
              size="small"
              :href="capability.href"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>

          <template #media>
            <Illustration :name="capability.illustration" />
          </template>
        </MediaSplit>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
