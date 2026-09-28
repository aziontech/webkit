<script setup>
  // The hero catalogue — every opening band the Site ships, side by side and live.
  //
  // A hero is the one band a page cannot avoid and the hardest to compare, because each one
  // lives at the top of a different page: you can only ever see one at a time. This page puts
  // the whole set in one column, each specimen rendered by the real component with the real
  // props, so choosing a page's opening is reading rather than remembering.
  //
  // THE ONE DELIBERATE EXCEPTION. `.specs/hero.md` says one Hero per page, because Hero.Title
  // owns the page's h1 and a second breaks the document outline. A catalogue is exactly the
  // case that rule does not cover — the same exception the component's own Storybook stories
  // take (Backdrops renders four bands, Alignment three). Only the opening band is the page's
  // h1 in spirit; the specimens below it are exhibits.
  //
  // FORM. The page language is the site's own: the opening band owns the top rule, one
  // SectionContainer owns the sides, each specimen is a SectionModule inside it. A module is
  // `:padded="false"` so its specimen touches the column's rules and reads as a band rather
  // than as a card — the hero keeps its own inline inset, which is the same page boundary the
  // nav above reads.
  //
  // EVERY SPECIMEN IS A SCREEN BAND, with the same `--banner-offset` its page passes. A hero
  // is mostly its height, and two of the props here (`--banner-top-height`, `align`) are
  // shares of that height — shrunk to fit a list they stop meaning anything, and the asset
  // window lands on the copy. The labels between the bands are what make the column
  // scannable instead.
  import Button from '@aziontech/webkit/button'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { NetworkBanner } from '@shared/ui/banners/index.js'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import FrameworkStackScene from '../ui/FrameworkStackScene.vue'
  import WorkloadTopologyScene from '../ui/WorkloadTopologyScene.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // Each specimen carries the copy of the page it ships on, so what is being compared is the
  // band and not the writing. The pages named here are where the shape is live today.
  const specimens = [
    {
      eyebrow: 'texture · texture-fade',
      title: 'Dot field',
      description:
        'The site default, and the shape eleven of the fourteen pages open on. A tiled dot lattice sits behind the copy and fades out before the floor, so the band meets the column below it without a second edge. Live on Technology, Cache, Retail, Web Apps and the rest.'
    },
    {
      eyebrow: 'carousel · carousel-marks',
      title: 'Dot field, with proof on the floor',
      description:
        'The same band with the trust strip standing on its floor. The strip and the bottom window share one ground, so a single plinth covers both — set it with --banner-floor-bg. Live on the home page.'
    },
    {
      eyebrow: 'floor-texture',
      title: 'Pixel floor',
      description:
        'A lit pixel field standing on the floor instead of sitting behind the copy. The window is a fixed cell, so the band already carries the ink and the horizontal falloff fitted to it and the page wires nothing; --texture-pool-a and -b place the light inside it.'
    },
    {
      eyebrow: '#top · --banner-top-height',
      title: 'Asset window',
      description:
        'A scene clipped by a window on the band’s top edge. The window claims no space, so the copy still centres on the whole band and an asset larger than the band shows only the part the window frames. Live on Workloads.'
    },
    {
      eyebrow: '#media',
      title: 'Copy beside media',
      description:
        'From md up the content column splits in two and the copy keeps the leading one. A screenshot, a diagram or a form takes the other; below md they stack, copy first. Live on Contact, whose media column is the enquiry form.'
    },
    {
      eyebrow: '#background',
      title: 'Artwork backdrop',
      description:
        'When the backdrop is a picture rather than one of the system’s textures it goes in the slot instead of the prop. It renders full-bleed beneath the content and is already marked decorative, so the page never has to hide it by hand. Live on Careers.'
    }
  ]
</script>

<template>
  <!-- ── The page's own opening ────────────────────────────────────────────────
       A band rather than a screen: this page is a list, and a full viewport of title
       ahead of it would put the first specimen below the fold. It still owns the page's
       top rule, which is the column's top edge. -->
  <Hero
    texture="dots"
    texture-fade="bottom"
    max-width="site"
  >
    <Hero.Title
      centered
      eyebrow="Page language"
      highlight="Azion heroes."
      title="Every opening band, in one column."
      description="The hero is the first thing a page says and the last thing it is easy to compare. Here is the whole set, rendered by the component itself — the same props a page would pass, at the width a page would pass them."
    />
  </Hero>

  <SectionContainer max-width="site">
    <!-- ── 1. Dot field ───────────────────────────────────────────────────────
         `:divided="false"` on the first module only: its top edge is the opening band's
         own `border-b`, and drawing one here would put two hairlines on one line. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          :eyebrow="specimens[0].eyebrow"
          :title="specimens[0].title"
          :description="specimens[0].description"
        />
      </template>

      <Hero
        kind="screen"
        texture="dots"
        texture-fade="bottom"
        max-width="full"
        :bordered="false"
        class="[--banner-offset:3.5rem]"
      >
        <Hero.Title
          centered
          eyebrow="Technology"
          title="Build high-performance applications"
          description="Develop modern applications with high-performance APIs and microservices on distributed infrastructure."
        >
          <template #actions>
            <Button
              label="Start Free"
              kind="secondary"
              size="large"
              @click="goSignup"
            />
            <Button
              label="Talk to a Specialist"
              kind="outlined"
              size="large"
            />
          </template>
        </Hero.Title>
      </Hero>
    </SectionModule>

    <!-- ── 2. Dot field + brand strip ─────────────────────────────────────────
         The plinth is the consumer's to set, so it is a class on the band and not a prop:
         one ground a shade off the canvas, under both the window and the strip. -->
    <SectionModule :padded="false">
      <template #header>
        <SectionTitle
          :eyebrow="specimens[1].eyebrow"
          :title="specimens[1].title"
          :description="specimens[1].description"
        />
      </template>

      <Hero
        kind="screen"
        texture="dots"
        texture-fade="bottom"
        max-width="full"
        :bordered="false"
        carousel
        :carousel-marks="CLIENT_STRIP"
        class="[--banner-offset:3.5rem] [--banner-floor-bg:var(--bg-surface)]"
      >
        <Hero.Title
          centered
          highlight="Distributed Infrastructure"
          title="for Modern Workloads"
          description="Networking, compute, AI, data, and security that autonomously scale up and down instantly. And it stays up when others go down."
        >
          <template #actions>
            <Button
              label="Start Free"
              kind="secondary"
              size="large"
              @click="goSignup"
            />
            <Button
              label="Talk to a Specialist"
              kind="outlined"
              size="large"
            />
          </template>
        </Hero.Title>
      </Hero>
    </SectionModule>

    <!-- ── 3. Pixel floor ─────────────────────────────────────────────────────
         The floor window is a fixed cell, so the only thing left to the page is where the
         light pools in it. -->
    <SectionModule :padded="false">
      <template #header>
        <SectionTitle
          :eyebrow="specimens[2].eyebrow"
          :title="specimens[2].title"
          :description="specimens[2].description"
        />
      </template>

      <Hero
        kind="screen"
        floor-texture="pixelate"
        max-width="full"
        :bordered="false"
        carousel
        :carousel-marks="CLIENT_STRIP"
        class="[--banner-offset:3.5rem] [--banner-floor-bg:var(--bg-surface)] [--texture-pool-a:95%_64%] [--texture-pool-b:-2%_38%]"
      >
        <Hero.Title
          title="Build and deploy AI agents and applications in seconds"
          description="Run AI models close to users on highly distributed infrastructure for scalable, low-latency, and cost-effective inference while preserving data locality."
        >
          <template #actions>
            <Button
              label="Start Free"
              kind="secondary"
              size="large"
              @click="goSignup"
            />
            <Button
              label="Talk to a Specialist"
              kind="outlined"
              size="large"
            />
          </template>
        </Hero.Title>
      </Hero>
    </SectionModule>

    <!-- ── 4. Asset window ────────────────────────────────────────────────────
         `--banner-top-height` sizes the window as a SHARE of the band, which is the clearest
         reason every specimen here is a screen band: at any other height the share is a
         different window and the scene lands on the copy. The asset inside it is free to be
         taller than the band, because the window clips it. -->
    <SectionModule :padded="false">
      <template #header>
        <SectionTitle
          :eyebrow="specimens[3].eyebrow"
          :title="specimens[3].title"
          :description="specimens[3].description"
        />
      </template>

      <Hero
        kind="screen"
        texture="dots"
        texture-fade="bottom"
        max-width="full"
        :bordered="false"
        class="[--banner-offset:3.5rem] [--banner-top-height:46%]"
      >
        <template #top>
          <WorkloadTopologyScene />
        </template>

        <Hero.Title
          centered
          eyebrow="Workloads"
          title="Put your application on the edge in seconds"
          description="Create one workload and it is live in every Azion location — no servers to size, no regions to pick."
        />
      </Hero>
    </SectionModule>

    <!-- ── 5. Copy beside media ───────────────────────────────────────────────
         Filling `#media` is the whole switch: the content column becomes two, the copy
         keeps the leading one, and below md they stack with the copy still first. The
         specimen carries an illustration rather than Contact's form: a form in a
         catalogue is a second interactive surface with nothing behind it. -->
    <SectionModule :padded="false">
      <template #header>
        <SectionTitle
          :eyebrow="specimens[4].eyebrow"
          :title="specimens[4].title"
          :description="specimens[4].description"
        />
      </template>

      <Hero
        kind="screen"
        texture="dots"
        texture-fade="bottom"
        max-width="full"
        :bordered="false"
        class="[--banner-offset:3.5rem]"
      >
        <Hero.Title
          eyebrow="Web apps"
          title="Ship from the framework you already use"
          description="Next, Nuxt, Astro, Remix and the rest build and deploy unchanged — the platform reads the project and picks the preset."
        >
          <template #actions>
            <Button
              label="Start Free"
              kind="secondary"
              size="large"
              @click="goSignup"
            />
          </template>
        </Hero.Title>

        <template #media>
          <FrameworkStackScene />
        </template>
      </Hero>
    </SectionModule>

    <!-- ── 6. Artwork backdrop ────────────────────────────────────────────────
         The last module in the column: its floor is the SiteFooter's `border-t`, so it
         draws none of its own. -->
    <SectionModule :padded="false">
      <template #header>
        <SectionTitle
          :eyebrow="specimens[5].eyebrow"
          :title="specimens[5].title"
          :description="specimens[5].description"
        />
      </template>

      <Hero
        kind="screen"
        max-width="full"
        :bordered="false"
        class="[--banner-offset:3.5rem]"
      >
        <template #background>
          <NetworkBanner />
        </template>

        <Hero.Title
          centered
          eyebrow="Our network"
          title="One network, every location"
          description="Traffic lands at the nearest point of presence and stays on the platform's own backbone from there."
        />
      </Hero>
    </SectionModule>
  </SectionContainer>
</template>
