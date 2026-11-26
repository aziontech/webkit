<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import EmptyState from '@aziontech/ui/empty-state'
  import Link from '@aziontech/ui/link'
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'

  import { messages } from '../lib/i18n'
  import { searchOpen } from '../lib/search-open'

  const t = messages
  useHead({ title: 'Not found — Azion UI' })

  const sections = computed(() => [
    { to: '/components', label: t.value.components },
    { to: '/patterns', label: t.value.patterns },
    { to: '/blocks', label: t.value.blocks },
    { to: '/foundations', label: t.value.foundations }
  ])
</script>

<template>
  <div class="flex w-full justify-center px-(--spacing-md) py-(--spacing-2xl)">
    <h1 class="sr-only">{{ t.notFound }}</h1>
    <EmptyState
      :title="t.notFound"
      :description="t.notFoundLead"
      icon="az az-compass"
    >
      <template #actions>
        <div class="flex flex-col items-center gap-(--spacing-md)">
          <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <Button
              :label="t.search"
              variant="primary"
              icon="az az-search"
              @click="searchOpen = true"
            />
            <Button
              :label="t.backHome"
              variant="outline"
              href="/"
            />
          </div>
          <nav :aria-label="t.sections">
            <ul class="m-0 flex list-none flex-wrap justify-center gap-(--spacing-md) p-0">
              <li
                v-for="section in sections"
                :key="section.to"
              >
                <Link
                  :label="section.label"
                  :href="section.to"
                />
              </li>
            </ul>
          </nav>
        </div>
      </template>
    </EmptyState>
  </div>
</template>
