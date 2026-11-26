<script setup lang="ts">
  import Brand from '@aziontech/ui/brand'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import CopyText from '@aziontech/ui/copy-text'
  import DocPageHeader from '@aziontech/ui/doc-page-header'
  import Illustration from '@aziontech/ui/illustration'
  import { useHead } from '@unhead/vue'
  import assets from 'virtual:docs-assets'
  import { computed } from 'vue'

  import { index } from '../lib/data'
  import { messages } from '../lib/i18n'

  const t = messages
  useHead({
    title: 'Assets — Azion UI',
    meta: [{ name: 'description', content: computed(() => t.value.assetsLead) }]
  })

  const lockups = computed(() => [
    { variant: 'default' as const, label: 'Default', text: t.value.brandDefault },
    { variant: 'reduced' as const, label: 'Reduced', text: t.value.brandReduced },
    { variant: 'extended' as const, label: 'Extended', text: t.value.brandExtended }
  ])

  const surfaces = computed(() => [
    { theme: 'dark' as const, label: t.value.brandOnDark },
    { theme: 'light' as const, label: t.value.brandOnLight }
  ])

  const treatments = computed(() => [
    {
      key: 'mono-light',
      treatment: 'monochrome' as const,
      theme: 'light' as const,
      orange: false,
      text: t.value.brandMonochrome
    },
    {
      key: 'mono-dark',
      treatment: 'monochrome' as const,
      theme: 'dark' as const,
      orange: false,
      text: t.value.brandMonochrome
    },
    {
      key: 'knockout',
      treatment: 'knockout' as const,
      theme: 'light' as const,
      orange: true,
      text: t.value.brandKnockout
    }
  ])

  const llms = (slug: string) => index.foundationLlms[slug]
  const snippet = (variant: string) => `<Brand variant="${variant}" />`
  const treatmentSnippet = (treatment: string) =>
    `<Brand variant="extended" treatment="${treatment}" />`
</script>

<template>
  <div
    class="flex w-full flex-col gap-(--spacing-2xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
  >
    <DocPageHeader
      :title="t.assets"
      :description="t.assetsLead"
    />

    <section
      id="brand"
      class="flex scroll-mt-20 flex-col gap-(--spacing-md)"
      aria-labelledby="brand-title"
    >
      <div class="flex flex-col gap-(--spacing-2xs)">
        <h2
          id="brand-title"
          class="text-heading-md"
        >
          {{ t.brand }}
        </h2>
        <p class="max-w-3xl text-body-sm text-(--text-muted)">{{ t.brandLead }}</p>
      </div>
      <ul
        class="flex flex-col divide-y divide-(--border-default) overflow-hidden rounded-(--shape-card) border border-(--border-default)"
      >
        <li
          v-for="lockup in lockups"
          :key="lockup.variant"
          class="flex flex-col"
        >
          <div
            class="flex flex-col items-start gap-(--spacing-sm) bg-(--bg-surface) px-(--spacing-lg) py-(--spacing-md) sm:flex-row sm:justify-between sm:gap-(--spacing-md)"
          >
            <div class="flex flex-col gap-(--spacing-2xs)">
              <h3 class="text-heading-xs">{{ lockup.label }}</h3>
              <p class="max-w-sm text-body-xs text-(--text-muted)">{{ lockup.text }}</p>
            </div>
            <CopyText
              :value="snippet(lockup.variant)"
              size="small"
              wrap-lines
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div
              v-for="surface in surfaces"
              :key="surface.theme"
              :data-theme="surface.theme"
              class="relative flex min-h-48 items-center justify-center bg-(--bg-canvas) px-(--spacing-xl) py-(--spacing-2xl) text-(--text-default)"
            >
              <span
                class="absolute start-(--spacing-md) top-(--spacing-sm) text-label-sm text-(--text-muted)"
              >
                {{ surface.label }}
              </span>
              <Brand
                :variant="lockup.variant"
                size="large"
                class="[&>svg]:h-12! md:[&>svg]:h-16!"
              />
            </div>
          </div>
        </li>
      </ul>
      <div class="flex flex-col gap-(--spacing-2xs)">
        <h3 class="text-heading-sm">{{ t.brandTreatments }}</h3>
        <p class="max-w-3xl text-body-sm text-(--text-muted)">{{ t.brandTreatmentsLead }}</p>
      </div>
      <ul class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-3">
        <li
          v-for="item in treatments"
          :key="item.key"
          class="flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default)"
        >
          <div
            :data-theme="item.theme"
            :data-orange="item.orange || null"
            class="flex min-h-36 items-center justify-center bg-(--bg-canvas) p-(--spacing-xl) text-(--text-default) data-[orange]:bg-(--primary)"
          >
            <Brand
              variant="extended"
              :treatment="item.treatment"
              size="large"
              class="[&>svg]:h-12!"
            />
          </div>
          <div
            class="flex flex-col items-start gap-(--spacing-xs) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
          >
            <p class="text-body-xs text-(--text-muted)">{{ item.text }}</p>
            <CopyText
              :value="treatmentSnippet(item.treatment)"
              size="small"
              wrap-lines
            />
          </div>
        </li>
      </ul>
    </section>

    <section
      id="illustrations"
      class="flex scroll-mt-20 flex-col gap-(--spacing-md)"
      aria-labelledby="illustrations-title"
    >
      <div class="flex flex-wrap items-end justify-between gap-(--spacing-sm)">
        <div class="flex flex-col gap-(--spacing-2xs)">
          <h2
            id="illustrations-title"
            class="flex items-baseline gap-(--spacing-xs) text-heading-md"
          >
            {{ t.illustrations }}
            <span class="text-body-sm text-(--text-muted)">{{ assets.illustrations.length }}</span>
          </h2>
          <p class="max-w-3xl text-body-sm text-(--text-muted)">{{ t.illustrationsLead }}</p>
        </div>
        <Button
          v-if="llms('illustrations')"
          :label="t.viewMarkdown"
          :aria-label="`${t.viewMarkdown} ${t.newTab}`"
          variant="ghost"
          size="medium"
          icon="az az-file"
          :href="llms('illustrations')"
          target="_blank"
        />
      </div>
      <ul class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="name in assets.illustrations"
          :key="name"
          class="flex"
        >
          <Card class="w-full">
            <div class="flex flex-col gap-(--spacing-xs)">
              <div
                class="flex aspect-video items-center justify-center overflow-hidden rounded-(--shape-control) bg-(--bg-canvas)"
              >
                <Illustration
                  :name="name"
                  class="max-h-full w-full"
                />
              </div>
              <CopyText
                :value="name"
                size="small"
                wrap-lines
              />
            </div>
          </Card>
        </li>
      </ul>
    </section>

    <Card
      id="icons"
      class="scroll-mt-20"
      aria-labelledby="icons-title"
    >
      <div class="flex flex-col items-start gap-(--spacing-sm)">
        <h2
          id="icons-title"
          class="flex items-baseline gap-(--spacing-xs) text-heading-md"
        >
          {{ t.icons }}
          <span class="text-body-sm text-(--text-muted)">{{ assets.icons.length }}</span>
        </h2>
        <p class="text-body-sm text-(--text-muted)">{{ t.iconsAssetLead }}</p>
        <Button
          :label="t.openIcons"
          variant="secondary"
          size="medium"
          href="/assets/icons"
          icon="az az-arrow-right"
          icon-position="trailing"
        />
      </div>
    </Card>
  </div>
</template>
