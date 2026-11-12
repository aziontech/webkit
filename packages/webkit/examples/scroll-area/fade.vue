<script setup>
  import ScrollArea from '@aziontech/webkit/scroll-area'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-6)">
    <div
      class="w-[280px] overflow-hidden rounded-(--shape-elements) border border-(--border-default)"
    >
      <ScrollArea
        fade
        aria-label="Deployments"
        class="max-h-[240px]"
      >
        <ul class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-(--spacing-xs)">
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            edge-app-production
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            edge-app-staging
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            marketing-site
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            docs-portal
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            image-optimizer
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            api-gateway
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            auth-service
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            checkout-function
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            search-indexer
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            media-transcoder
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            waf-rules-engine
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            analytics-collector
          </li>
        </ul>
      </ScrollArea>
    </div>
    <div
      class="w-[280px] overflow-hidden rounded-(--shape-elements) border border-(--border-default)"
    >
      <ScrollArea
        fade
        orientation="horizontal"
        aria-label="Regions"
      >
        <div class="flex w-max gap-(--spacing-xs) p-(--spacing-xs)">
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >São Paulo</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Miami</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Frankfurt</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Tokyo</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Sydney</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Mumbai</span
          >
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
