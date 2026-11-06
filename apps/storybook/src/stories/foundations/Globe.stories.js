import BrandGlobeScene from '@aziontech/webkit/assets/brand-globe-scene'
import SpinningGlobe from '@aziontech/webkit/assets/spinning-globe'

import {
  CodeBlock,
  PageContainer,
  PageHeader,
  SectionHeader
} from '../../foundations/components/layout/index.js'

const DENSITIES = [
  ['none', 'The bare globe: grid and landmass, no PoPs.'],
  ['low', 'The core PoPs only.'],
  ['medium', 'Core and satellite PoPs. The default.'],
  ['high', 'Every PoP the network map knows.']
]

const REGIONS = [
  ['world', -30],
  ['atlantic', -30],
  ['americas', -75],
  ['north-america', -100],
  ['south-america', -60],
  ['europe', 15],
  ['africa', 20],
  ['asia', 100],
  ['oceania', 140]
]

const USAGE_SAMPLE = `<script setup>
import BrandGlobeScene from '@aziontech/webkit/assets/brand-globe-scene'
import SpinningGlobe from '@aziontech/webkit/assets/spinning-globe'
</script>

<template>
  <div class="relative aspect-square w-full">
    <SpinningGlobe region="americas" density="high" animated />
  </div>

  <BrandGlobeScene />
</template>`

const FRAME_CLASS =
  'm-0 flex w-full flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)'

const CAPTION_CLASS =
  'flex flex-col gap-(--spacing-xxs) border-t border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)'

const STAGE_CLASS = 'relative aspect-square w-full'

export default {
  title: 'Foundations/Assets/Globe',
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'The globe assets webkit ships. `SpinningGlobe` draws the network map wrapped around a sphere on a canvas: a meridian grid, the landmass as dots and the PoPs lit in the primary colour, turning once a minute when animated and resting when the viewer asks for reduced motion. `BrandGlobeScene` sets the bare globe behind the Azion mark, as the media of a band.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Library = {
  name: 'Library',
  parameters: { options: { showPanel: false }, visual: false },
  render: () => ({
    components: {
      BrandGlobeScene,
      CodeBlock,
      PageContainer,
      PageHeader,
      SectionHeader,
      SpinningGlobe
    },
    setup() {
      return {
        DENSITIES,
        REGIONS,
        USAGE_SAMPLE,
        FRAME_CLASS,
        CAPTION_CLASS,
        STAGE_CLASS
      }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Globe">
          Two canvas assets built on the network map data: the spinning globe, and the scene that
          sets it behind the Azion mark. Both are decorative and hidden from assistive technology.
        </PageHeader>

        <section class="mb-(--spacing-xxl)">
          <SectionHeader title="Density" description="How many PoPs are lit. The globe always shows the whole world; density only decides how many points glow on it." />
          <div class="grid gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4">
            <figure v-for="[density, use] in DENSITIES" :key="density" :class="FRAME_CLASS">
              <div :class="STAGE_CLASS">
                <SpinningGlobe :density="density" />
              </div>
              <figcaption :class="CAPTION_CLASS">
                <code class="font-code text-code text-(--text-default)">density="{{ density }}"</code>
                <span class="text-body-sm text-(--text-muted)">{{ use }}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="mb-(--spacing-xxl)">
          <SectionHeader title="Region" description="Which part of the world has its PoPs lit, with the same names as the network map. Turn the globe with longitude so the region faces the viewer. The network has no PoPs in Asia or Oceania, so those two regions light nothing." />
          <div class="grid gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
            <figure v-for="[region, longitude] in REGIONS" :key="region" :class="FRAME_CLASS">
              <div :class="STAGE_CLASS">
                <SpinningGlobe :region="region" :longitude="longitude" density="high" />
              </div>
              <figcaption :class="CAPTION_CLASS">
                <code class="font-code text-code text-(--text-default)">region="{{ region }}" :longitude="{{ longitude }}"</code>
              </figcaption>
            </figure>
          </div>
        </section>

        <section class="mb-(--spacing-xxl)">
          <SectionHeader title="Brand globe scene" description="The bare globe turning behind the Azion mark, sized to its container, for use as the media of a band." />
          <figure :class="FRAME_CLASS">
            <div class="flex aspect-video w-full items-center justify-center">
              <BrandGlobeScene />
            </div>
            <figcaption :class="CAPTION_CLASS">
              <code class="font-code text-code text-(--text-default)">BrandGlobeScene</code>
            </figcaption>
          </figure>
        </section>

        <section class="mb-(--spacing-xxl)">
          <SectionHeader title="Using the globe" description="SpinningGlobe fills its nearest positioned ancestor, so give it a relative box with a size. BrandGlobeScene brings its own box and fills the cell it is placed in." />
          <CodeBlock :content="USAGE_SAMPLE" language="html" />
        </section>
      </PageContainer>
    `
  })
}

export const Globe = {
  name: 'Spinning globe',
  parameters: {
    controls: { disable: false },
    visual: false,
    docs: { description: { story: 'The spinning globe, driven by the controls.' } }
  },
  argTypes: {
    region: { control: 'select', options: REGIONS.map(([region]) => region) },
    density: { control: 'inline-radio', options: DENSITIES.map(([density]) => density) },
    animated: { control: 'boolean' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    scale: { control: { type: 'range', min: 0.25, max: 1.5, step: 0.05 } },
    tilt: { control: { type: 'range', min: -45, max: 45, step: 1 } },
    longitude: { control: { type: 'range', min: -180, max: 180, step: 1 } },
    duration: { control: { type: 'number', min: 5, step: 5 } }
  },
  args: {
    region: 'world',
    density: 'medium',
    animated: true,
    opacity: 0.4,
    scale: 0.85,
    tilt: 12,
    longitude: -30,
    duration: 60
  },
  render: (args) => ({
    components: { SpinningGlobe },
    setup: () => ({ props: args, STAGE_CLASS }),
    template: `<div class="mx-auto max-w-120" :class="STAGE_CLASS"><SpinningGlobe v-bind="props" /></div>`
  })
}

export const Static = {
  name: 'Static globe',
  parameters: {
    docs: { description: { story: 'The globe at rest, every PoP lit.' } }
  },
  render: () => ({
    components: { SpinningGlobe },
    setup: () => ({ STAGE_CLASS }),
    template: `<div class="mx-auto max-w-120" :class="STAGE_CLASS"><SpinningGlobe density="high" /></div>`
  })
}

export const Scene = {
  name: 'Brand globe scene',
  parameters: {
    visual: false,
    docs: { description: { story: 'The bare globe turning behind the Azion mark.' } }
  },
  render: () => ({
    components: { BrandGlobeScene },
    template: '<div class="mx-auto flex aspect-square w-full max-w-160"><BrandGlobeScene /></div>'
  })
}
