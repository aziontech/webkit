<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyText from '@aziontech/webkit/copy-text'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import Illustration from '@aziontech/webkit/illustration'
  import { useHead } from '@unhead/vue'
  import assets from 'virtual:docs-assets'
  import { computed } from 'vue'

  import { index } from '../lib/data'
  import { messages } from '../lib/i18n'

  const t = messages
  useHead({
    title: 'Assets — WebKit',
    meta: [{ name: 'description', content: computed(() => t.value.assetsLead) }]
  })

  const lockups = computed(() => [
    { variant: 'default' as const, label: 'Default', text: t.value.brandDefault },
    { variant: 'reduced' as const, label: 'Reduced', text: t.value.brandReduced },
    { variant: 'extended' as const, label: 'Extended', text: t.value.brandExtended }
  ])

  const llms = (slug: string) => index.foundationLlms[slug]
  const snippet = (variant: string) => `<Brand variant="${variant}" />`
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
        data-theme="dark"
        class="flex flex-col divide-y divide-(--border-muted) overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
      >
        <li
          v-for="lockup in lockups"
          :key="lockup.variant"
          class="relative flex min-h-60 items-center justify-center px-(--spacing-xl) pb-(--spacing-xl) pt-(--spacing-2xl)"
        >
          <div
            class="absolute inset-x-0 top-0 flex items-start justify-between gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-md)"
          >
            <div class="flex flex-col gap-(--spacing-2xs)">
              <h3 class="text-heading-xs">{{ lockup.label }}</h3>
              <p class="max-w-sm text-body-xs text-(--text-muted)">{{ lockup.text }}</p>
            </div>
            <CopyText :value="snippet(lockup.variant)" />
          </div>
          <Brand
            :variant="lockup.variant"
            size="large"
            class="[&>svg]:h-14! md:[&>svg]:h-20!"
          />
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
              <CopyText :value="name" />
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
          href="/foundations/icon"
          icon="az az-arrow-right"
          icon-position="trailing"
        />
      </div>
    </Card>
  </div>
</template>
