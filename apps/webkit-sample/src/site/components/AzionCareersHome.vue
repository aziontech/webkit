<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import Carousel from '@aziontech/webkit/carousel'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import {
    CAREERS_HOME_HERO,
    CAREERS_JOBS_PATH,
    CAREERS_JOIN,
    CAREERS_JOURNEY,
    CAREERS_ROLES,
    CAREERS_VALUES
  } from '../data/careers-home.js'

  const jobsFor = (area) => `${CAREERS_JOBS_PATH}?area=${encodeURIComponent(area)}`
</script>

<template>
  <Hero
    kind="screen"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      :title="CAREERS_HOME_HERO.title"
      :description="CAREERS_HOME_HERO.description"
    />

    <template #media>
      <ul
        role="list"
        class="m-0 grid list-none grid-cols-1 gap-px bg-(--border-default) p-0 sm:grid-cols-2"
      >
        <li
          v-for="value in CAREERS_VALUES"
          :key="value"
          class="flex min-w-0"
        >
          <FrameBox
            borders="none"
            marks="none"
            class="flex w-full items-end bg-(--bg-canvas) p-(--spacing-xl) sm:min-h-(--container-3xs)"
          >
            <p class="m-0 text-pretty text-heading-sm text-(--text-default)">
              {{ value }}
            </p>
          </FrameBox>
        </li>
      </ul>
    </template>
  </Hero>

  <SectionContainer max-width="site">
    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="centered"
          :title="CAREERS_JOURNEY.title"
          :description="CAREERS_JOURNEY.description"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <Carousel
          :aria-label="CAREERS_JOURNEY.title"
          class="p-(--spacing-xl)"
        >
          <template #controls>
            <Carousel.Previous />
            <Carousel.Next />
          </template>

          <Carousel.Item
            v-for="step in CAREERS_JOURNEY.steps"
            :key="step.step"
            class="w-[85%] md:w-(--container-xl)"
          >
            <div class="flex flex-col gap-(--spacing-lg)">
              <span
                class="inline-flex size-8 items-center justify-center rounded-(--shape-flat) border border-(--border-default) bg-(--bg-surface) text-overline-md text-(--text-muted)"
              >
                {{ step.step }}
              </span>
              <div class="flex flex-col gap-(--spacing-sm)">
                <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                  {{ step.title }}
                </h3>
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
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
        <Carousel
          :aria-label="CAREERS_ROLES.title"
          class="p-(--spacing-xl)"
        >
          <template #controls>
            <Carousel.Previous />
            <Carousel.Next />
          </template>

          <Carousel.Item
            v-for="role in CAREERS_ROLES.areas"
            :key="role.area"
            class="w-[85%] md:w-(--container-sm)"
          >
            <div class="flex flex-col gap-(--spacing-xl)">
              <div class="flex flex-1 flex-col gap-(--spacing-sm)">
                <h3 class="m-0 text-heading-sm text-(--text-default)">
                  {{ role.area }}
                </h3>
                <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
                  {{ role.description }}
                </p>
              </div>
              <div>
                <Button
                  :label="CAREERS_ROLES.action"
                  kind="outlined"
                  size="large"
                  :href="jobsFor(role.area)"
                  :aria-label="`${CAREERS_ROLES.action}: ${role.area}`"
                  icon="pi pi-chevron-right"
                  icon-position="trailing"
                  animated
                />
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
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
