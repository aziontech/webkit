<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import Illustration from '@aziontech/webkit/illustration'
  import LineFigure from '@aziontech/webkit/line-figure'
  import { useHead } from '@unhead/vue'
  import assets from 'virtual:docs-assets'
  import { computed } from 'vue'

  import CopyChip from '../components/tokens/CopyChip.vue'
  import { index } from '../lib/data'
  import { messages } from '../lib/i18n'

  type FigureName = NonNullable<InstanceType<typeof LineFigure>['$props']['name']>

  const t = messages
  const figures = assets.lineFigures.map((figure) => ({
    ...figure,
    name: figure.name as FigureName
  }))
  useHead({
    title: 'Assets — WebKit',
    meta: [{ name: 'description', content: computed(() => t.value.assetsLead) }]
  })

  const lockups = computed(() => [
    { kind: 'default' as const, label: 'Default', text: t.value.brandDefault },
    { kind: 'reduced' as const, label: 'Reduced', text: t.value.brandReduced },
    { kind: 'extended' as const, label: 'Extended', text: t.value.brandExtended }
  ])

  const llms = (slug: string) => index.foundationLlms[slug]
  const snippet = (kind: string) => `<Brand kind="${kind}" />`
</script>

<template>
  <div
    class="flex w-full flex-col gap-(--spacing-xxl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)"
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
      <div class="flex flex-col gap-(--spacing-xxs)">
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
          :key="lockup.kind"
          class="relative flex min-h-60 items-center justify-center px-(--spacing-xl) pb-(--spacing-xl) pt-(--spacing-xxl)"
        >
          <div
            class="absolute inset-x-0 top-0 flex items-start justify-between gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-md)"
          >
            <div class="flex flex-col gap-(--spacing-xxs)">
              <h3 class="text-heading-xs">{{ lockup.label }}</h3>
              <p class="max-w-sm text-body-xs text-(--text-muted)">{{ lockup.text }}</p>
            </div>
            <CopyChip :value="snippet(lockup.kind)" />
          </div>
          <Brand
            :kind="lockup.kind"
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
        <div class="flex flex-col gap-(--spacing-xxs)">
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
          kind="transparent"
          size="medium"
          icon="pi pi-file"
          :href="llms('illustrations')"
          target="_blank"
        />
      </div>
      <ul class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="name in assets.illustrations"
          :key="name"
          class="flex flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
        >
          <div
            class="flex aspect-video items-center justify-center overflow-hidden rounded-(--shape-elements) bg-(--bg-canvas)"
          >
            <Illustration
              :name="name"
              class="max-h-full w-full"
            />
          </div>
          <CopyChip :value="name" />
        </li>
      </ul>
    </section>

    <section
      id="line-figures"
      class="flex scroll-mt-20 flex-col gap-(--spacing-md)"
      aria-labelledby="line-figures-title"
    >
      <div class="flex flex-wrap items-end justify-between gap-(--spacing-sm)">
        <div class="flex flex-col gap-(--spacing-xxs)">
          <h2
            id="line-figures-title"
            class="flex items-baseline gap-(--spacing-xs) text-heading-md"
          >
            {{ t.lineFigures }}
            <span class="text-body-sm text-(--text-muted)">{{ assets.lineFigures.length }}</span>
          </h2>
          <p class="max-w-3xl text-body-sm text-(--text-muted)">{{ t.lineFiguresLead }}</p>
        </div>
        <Button
          v-if="llms('line-figures')"
          :label="t.viewMarkdown"
          kind="transparent"
          size="medium"
          icon="pi pi-file"
          :href="llms('line-figures')"
          target="_blank"
        />
      </div>
      <ul class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="figure in figures"
          :key="figure.name"
          class="flex flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
        >
          <div
            class="flex aspect-square items-center justify-center overflow-hidden rounded-(--shape-elements) bg-(--bg-canvas) p-(--spacing-sm)"
          >
            <LineFigure
              :name="figure.name"
              class="h-full w-full"
            />
          </div>
          <CopyChip :value="figure.name" />
          <p class="text-body-xs text-(--text-muted)">{{ figure.label }}</p>
        </li>
      </ul>
    </section>

    <section
      id="icons"
      class="flex scroll-mt-20 flex-col items-start gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)"
      aria-labelledby="icons-title"
    >
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
        kind="secondary"
        size="medium"
        href="/foundations/icons"
        icon="pi pi-arrow-right"
        icon-position="trailing"
      />
    </section>
  </div>
</template>
