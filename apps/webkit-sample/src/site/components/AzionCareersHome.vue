<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Item from '@aziontech/webkit/item'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Table from '@aziontech/webkit/table'
  import { useRouter } from 'vue-router'

  import { CAREERS_JOBS, jobFacets, jobId } from '../data/careers.js'
  import {
    CAREERS_HOME_HERO,
    CAREERS_JOBS_PATH,
    CAREERS_PHOTOS,
    CAREERS_ROLES,
    CAREERS_VISION,
    CAREERS_WORK
  } from '../data/careers-home.js'
  import { COMPANY_CLOSING } from '../data/product-pages.js'
  import SpinningGlobe from '../ui/SpinningGlobe.vue'
  import ClosingCallToAction from '../ui/sections/ClosingCallToAction.vue'

  const router = useRouter()
  const openRole = (id) => router.push(`/site/careers/${id}`)

  const latestRoles = CAREERS_JOBS.slice(0, CAREERS_ROLES.previewCount).map((job) => {
    const [team, location, arrangement, contract] = jobFacets(job)
    return {
      id: jobId(job),
      title: job.title,
      team: `${team} · ${location}`,
      type: `${arrangement} · ${contract}`
    }
  })
  const { section: _section, ...CLOSING } = COMPANY_CLOSING
</script>

<template>
  <Hero
    kind="band"
    max-width="5xl"
    size="large"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
      :eyebrow="CAREERS_HOME_HERO.eyebrow"
      :title="CAREERS_HOME_HERO.title"
      :description="CAREERS_HOME_HERO.description"
    >
      <template #actions>
        <Button
          :label="CAREERS_HOME_HERO.action"
          kind="secondary"
          size="large"
          href="#latest-roles"
        />
      </template>
    </Hero.Title>
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="horizontal"
          :title="CAREERS_WORK.title"
          :description="CAREERS_WORK.description"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <!-- The track holds the row twice and travels -50%, so the second copy lands where the
               first started. Hover or focus pauses it; reduced motion turns it into a scroll row. -->
        <div
          class="group/loop overflow-hidden motion-reduce:overflow-x-auto"
          role="region"
          aria-label="Azion offices"
        >
          <div
            :style="{ animationDuration: '60s' }"
            class="flex w-max animate-brand-marquee group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
          >
            <ul
              v-for="copy in 2"
              :key="copy"
              :aria-hidden="copy > 1 ? 'true' : undefined"
              class="m-0 flex shrink-0 list-none items-end gap-(--spacing-md) p-0 pr-(--spacing-md) motion-reduce:data-[duplicate]:hidden"
              :data-duplicate="copy > 1 || null"
            >
              <li
                v-for="photo in CAREERS_PHOTOS"
                :key="`${copy}-${photo.src}`"
                class="h-80 shrink-0 overflow-hidden sm:h-112"
                :style="{ aspectRatio: `${photo.width} / ${photo.height}` }"
              >
                <img
                  :src="photo.src"
                  :alt="copy > 1 ? '' : photo.alt"
                  :width="photo.width"
                  :height="photo.height"
                  draggable="false"
                  class="size-full object-cover"
                />
              </li>
            </ul>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <section
        aria-labelledby="careers-vision-title"
        class="flex flex-col items-center gap-(--spacing-xxl) p-(--spacing-xl) lg:flex-row lg:items-start"
      >
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xl) text-(--text-default)">
          <h2
            id="careers-vision-title"
            class="m-0 text-balance text-heading-2xl"
          >
            {{ CAREERS_VISION.title }}
          </h2>
          <p class="m-0 text-pretty text-body-lg">
            {{ CAREERS_VISION.description }}
          </p>
        </div>

        <div class="@container relative w-full max-w-147 shrink-0">
          <SpinningGlobe />
          <div
            class="absolute left-1/2 top-1/2 flex aspect-square w-[29.4%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[5.5cqw] border-[0.92cqw] border-transparent [background:linear-gradient(var(--illustration-surface),var(--illustration-surface))_padding-box,linear-gradient(45deg,var(--illustration-surface),var(--illustration-primary)_35%,var(--illustration-primary)_65%,var(--illustration-surface))_border-box]"
          >
            <Brand
              kind="reduced"
              aria-hidden="true"
              class="w-[28%] [&>svg]:h-auto! [&>svg]:w-full!"
            />
          </div>
        </div>
      </section>
    </FrameBox>

    <SectionGap hatch />

    <SectionModule
      id="latest-roles"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <template #header>
        <SectionTitle
          kind="left"
          :title="CAREERS_ROLES.title"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <!-- Below sm the three columns cannot fit, and a table cell cannot wrap inside its
             max-content track, so phones get the same rows as a list whose titles wrap. -->
        <div class="sm:hidden">
          <Item.List>
            <Item
              v-for="role in latestRoles"
              :key="role.id"
              class="relative px-(--spacing-xl)! py-(--spacing-lg)! hover:bg-(--bg-hover)"
            >
              <Item.Content class="gap-(--spacing-xs)">
                <Item.Title>
                  <RouterLink
                    :to="`/site/careers/${role.id}`"
                    class="text-pretty text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-['']"
                  >
                    {{ role.title }}
                  </RouterLink>
                </Item.Title>
                <Item.Description class="line-clamp-none! text-overline-sm! text-pretty">
                  {{ role.team }}
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.List>
          <div class="flex border-t border-(--border-default) px-(--spacing-xl) py-(--spacing-lg)">
            <Button
              :label="CAREERS_ROLES.action(CAREERS_JOBS.length)"
              kind="outlined"
              size="large"
              :href="CAREERS_JOBS_PATH"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
              class="w-full"
            />
          </div>
        </div>

        <Table class="max-sm:hidden!">
          <Table.Header>
            <Table.Row>
              <Table.HeadCell
                :grow="2"
                class="pl-(--spacing-xl)! text-overline-md! uppercase"
              >
                {{ CAREERS_ROLES.columns.role }}
              </Table.HeadCell>
              <Table.HeadCell
                :grow="2"
                class="text-overline-md! uppercase"
              >
                {{ CAREERS_ROLES.columns.team }}
              </Table.HeadCell>
              <Table.HeadCell
                align="end"
                class="pr-(--spacing-xl)! text-overline-md! uppercase"
              >
                {{ CAREERS_ROLES.columns.type }}
              </Table.HeadCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <!-- The row click is for pointers; the title link is the keyboard and screen-reader path. -->
            <Table.Row
              v-for="role in latestRoles"
              :key="role.id"
              class="cursor-pointer hover:[--table-row-bg:var(--bg-hover)]!"
              @click="openRole(role.id)"
            >
              <Table.Cell
                :grow="2"
                principal
                class="py-(--spacing-lg)! pl-(--spacing-xl)!"
              >
                <RouterLink
                  :to="`/site/careers/${role.id}`"
                  class="text-label-lg text-(--text-default)"
                  @click.stop
                >
                  {{ role.title }}
                </RouterLink>
              </Table.Cell>
              <Table.Cell
                :grow="2"
                class="py-(--spacing-lg)! text-overline-sm! text-(--text-muted)"
              >
                <span
                  class="min-w-0 truncate"
                  :title="role.team"
                  >{{ role.team }}</span
                >
              </Table.Cell>
              <Table.Cell
                align="end"
                class="py-(--spacing-lg)! pr-(--spacing-xl)! text-overline-sm! text-(--text-muted)"
              >
                {{ role.type }}
              </Table.Cell>
            </Table.Row>
          </Table.Body>

          <template #footer>
            <Table.Footer>
              <div class="flex justify-end px-(--spacing-xl) py-(--spacing-lg)">
                <Button
                  :label="CAREERS_ROLES.action(CAREERS_JOBS.length)"
                  kind="outlined"
                  size="large"
                  :href="CAREERS_JOBS_PATH"
                  icon="pi pi-chevron-right"
                  icon-position="trailing"
                  animated
                />
              </div>
            </Table.Footer>
          </template>
        </Table>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <ClosingCallToAction v-bind="CLOSING" />
  </SectionContainer>
</template>
