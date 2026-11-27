<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import IconButton from '@aziontech/ui/icon-button'
  import Link from '@aziontech/ui/link'
  import Tooltip from '@aziontech/ui/tooltip'
  import { computed, ref } from 'vue'

  import { sampleSummaryTemplates } from '../sample'

  const templates = sampleSummaryTemplates

  const templateIndex = ref(0)
  const featured = computed(() => templates[templateIndex.value] ?? templates[0])

  const stepTemplate = (delta: number) => {
    templateIndex.value = (templateIndex.value + delta + templates.length) % templates.length
  }
</script>

<template>
  <Card title="Marketplace trends">
    <template #default>
      <article
        :key="featured.id"
        :aria-label="`${featured.name}, template ${templateIndex + 1} of ${templates.length}`"
        class="flex min-w-0 flex-col gap-(--spacing-sm)"
      >
        <div class="flex min-w-0 items-center gap-(--spacing-sm)">
          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-(--shape-control) bg-(--bg-surface-raised) text-(--primary)"
          >
            <i
              :class="featured.icon"
              class="text-body-sm"
              aria-hidden="true"
            />
          </span>
          <Link
            :label="featured.name"
            size="medium"
            href="#"
          />
        </div>
        <p class="text-body-xs text-pretty text-(--text-muted)">
          {{ featured.description }}
        </p>
        <p class="flex items-center gap-(--spacing-md) text-body-2xs text-(--text-muted)">
          <span>
            By
            <span class="text-(--text-default)">{{ featured.vendor }}</span>
          </span>
          <span>
            Version
            <span class="tabular-nums text-(--text-default)">{{ featured.version }}</span>
          </span>
        </p>
      </article>
    </template>
    <template #footer>
      <div class="flex items-center gap-(--spacing-sm)">
        <Tooltip content="Previous template">
          <IconButton
            icon="az az-chevron-left"
            variant="ghost"
            size="small"
            aria-label="Previous template"
            @click="stepTemplate(-1)"
          />
        </Tooltip>
        <div
          class="flex items-center gap-(--spacing-xs)"
          aria-hidden="true"
        >
          <span
            v-for="(template, index) in templates"
            :key="template.id"
            :data-active="index === templateIndex || null"
            class="size-2 rounded-full bg-(--border-default) transition-colors duration-fast-02 ease-productive-entrance data-active:bg-(--text-default) motion-reduce:transition-none"
          />
        </div>
        <Tooltip content="Next template">
          <IconButton
            icon="az az-chevron-right"
            variant="ghost"
            size="small"
            aria-label="Next template"
            @click="stepTemplate(1)"
          />
        </Tooltip>
        <span
          class="sr-only"
          aria-live="polite"
          >Template {{ templateIndex + 1 }} of {{ templates.length }}: {{ featured.name }}</span
        >
      </div>
    </template>
  </Card>
</template>
