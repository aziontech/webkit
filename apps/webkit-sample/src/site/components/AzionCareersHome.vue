<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Item from '@aziontech/webkit/item'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Table from '@aziontech/webkit/table'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { useRouter } from 'vue-router'

  import { CAREERS_JOBS, jobFacets, jobId } from '../data/careers.js'
  import {
    CAREERS_HOME_HERO,
    CAREERS_JOBS_PATH,
    CAREERS_JOIN,
    CAREERS_PHOTOS,
    CAREERS_ROLES,
    CAREERS_WORK
  } from '../data/careers-home.js'

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
</script>

<template>
  <Hero
    kind="band"
    max-width="5xl"
    size="large"
    texture="dots"
    texture-fade="top"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      centered
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
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="flex flex-col gap-(--spacing-xxl) py-(--spacing-xxl)">
          <div class="grid gap-(--spacing-xl) px-(--spacing-xl) md:grid-cols-3">
            <h2 class="m-0 text-balance text-heading-2xl text-(--text-default)">
              {{ CAREERS_WORK.title }}
            </h2>
            <p class="m-0 text-pretty text-heading-sm text-(--text-muted) md:col-span-2">
              {{ CAREERS_WORK.description }}
            </p>
          </div>

          <!-- The track holds the row twice and travels -50%, so the second copy lands where the
               first started. Hover or focus pauses it; reduced motion turns it into a scroll row. -->
          <div
            class="group/loop overflow-hidden motion-reduce:overflow-x-auto"
            role="region"
            aria-label="Azion offices"
          >
            <div
              :style="{ animationDuration: '90s' }"
              class="flex w-max animate-brand-marquee group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
            >
              <ul
                v-for="copy in 2"
                :key="copy"
                :aria-hidden="copy > 1 ? 'true' : undefined"
                class="m-0 flex shrink-0 list-none gap-(--spacing-md) p-0 pr-(--spacing-md) motion-reduce:data-[duplicate]:hidden"
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
        </div>
      </FrameBox>
    </SectionModule>

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
                <Item.Description class="line-clamp-none! text-pretty">
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
                class="pl-(--spacing-xl)!"
              >
                {{ CAREERS_ROLES.columns.role }}
              </Table.HeadCell>
              <Table.HeadCell
                :grow="2"
                class="max-sm:hidden!"
              >
                {{ CAREERS_ROLES.columns.team }}
              </Table.HeadCell>
              <Table.HeadCell
                align="end"
                class="pr-(--spacing-xl)!"
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
              class="cursor-pointer hover:[--table-row-bg:var(--bg-canvas)]"
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
                class="py-(--spacing-lg)! text-(--text-muted)"
              >
                {{ role.team }}
              </Table.Cell>
              <Table.Cell
                align="end"
                class="py-(--spacing-lg)! pr-(--spacing-xl)! text-(--text-muted)"
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

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <CallToAction
        framed
        :title="CAREERS_JOIN.title"
        :description="CAREERS_JOIN.description"
      >
        <template #actions>
          <Button
            :label="CAREERS_JOIN.action"
            kind="secondary"
            size="large"
            :href="CAREERS_JOBS_PATH"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <!-- SectionGap's height, corners and hatch, minus its rules: the footer opens on its own. -->
    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
</template>
