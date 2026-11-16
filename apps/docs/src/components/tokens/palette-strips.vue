<script setup lang="ts">
  import { titleCase } from '../../lib/nav'
  import { copyValue } from '../../lib/tokens'
  import type { Token } from '../../lib/types'

  defineProps<{ groups: { id: string; vars: Token[] }[] }>()

  const shade = (name: string, family: string) =>
    name.replace(`--color-${family}`, '').replace(/^-/, '') || family
</script>

<template>
  <ul class="flex flex-col gap-(--spacing-md)">
    <li
      v-for="group in groups"
      :key="group.id"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <h3 class="text-label-md text-(--text-default)">{{ titleCase(group.id) }}</h3>
      <div class="flex gap-(--spacing-2xs) overflow-x-auto pb-(--spacing-2xs)">
        <button
          v-for="token in group.vars"
          :key="token.name"
          type="button"
          :title="`${token.name} · ${token.value}`"
          class="group flex min-w-14 flex-1 flex-col gap-(--spacing-2xs) rounded-(--shape-control) text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
          @click="copyValue(token.name)"
        >
          <span
            class="h-12 w-full rounded-(--shape-control) border border-(--border-muted) transition-[scale] duration-fast-02 ease-productive-entrance group-hover:scale-y-110 motion-reduce:transition-none"
            :style="{ background: token.value }"
            aria-hidden="true"
          />
          <span class="text-label-code-sm text-(--text-default)">{{
            shade(token.name, group.id)
          }}</span>
          <span class="sr-only">{{ token.name }}</span>
          <span class="text-label-code-sm text-(--text-muted)">{{ token.value }}</span>
        </button>
      </div>
    </li>
  </ul>
</template>
