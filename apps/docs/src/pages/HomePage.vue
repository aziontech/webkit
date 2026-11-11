<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import { useHead } from '@unhead/vue'

  import { index } from '../lib/data'
  import { messages } from '../lib/i18n'

  const t = messages
  useHead({ title: 'WebKit — Azion design system' })

  const install = [
    {
      label: 'npm',
      value: 'npm',
      language: 'bash',
      code: 'npm install @aziontech/webkit @aziontech/theme @aziontech/icons\nnpx @aziontech/webkit init'
    }
  ]
  const exampleCount = index.components.reduce((sum, item) => sum + item.exampleCount, 0)
</script>

<template>
  <div
    class="flex w-full flex-col gap-(--spacing-xxl) px-(--spacing-md) py-(--spacing-xl) lg:px-(--spacing-xl)"
  >
    <section class="flex max-w-3xl flex-col gap-(--spacing-md)">
      <p class="text-overline-sm uppercase text-(--text-muted)">
        @aziontech/webkit {{ index.version }}
      </p>
      <h1 class="text-heading-2xl">{{ t.heroTitle }}</h1>
      <p class="text-body-lg text-(--text-muted)">{{ t.heroLead }}</p>
      <div class="flex flex-wrap gap-(--spacing-sm)">
        <Button
          :label="t.browseComponents"
          kind="primary"
          href="/components"
          icon="pi pi-arrow-right"
          icon-position="trailing"
        />
        <Button
          :label="t.browseBlocks"
          kind="outlined"
          href="/blocks"
        />
        <Button
          v-if="index.llmsTxt"
          label="llms.txt"
          kind="transparent"
          href="/llms.txt"
          icon="pi pi-file"
        />
      </div>
      <CodeBlock
        :tabs="install"
        default-value="npm"
      />
    </section>

    <DocCardGroup :cols="3">
      <DocCard
        :title="t.components"
        icon="pi pi-th-large"
        href="/components"
      >
        {{ index.components.length }} components and {{ exampleCount }} live examples.
      </DocCard>
      <DocCard
        :title="t.blocks"
        icon="pi pi-window-maximize"
        href="/blocks"
      >
        {{ index.blocks.length }} blocks with
        {{ index.blocks.reduce((sum, block) => sum + block.states.length, 0) }} states, in a
        resizable frame.
      </DocCard>
      <DocCard
        :title="t.foundations"
        icon="pi pi-palette"
        href="/foundations"
      >
        Tokens, languages, right-to-left, layout and accessibility.
      </DocCard>
    </DocCardGroup>
  </div>
</template>
