<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import { computed, ref } from 'vue'

  import { formatDuration } from './run-trace.js'

  defineOptions({ inheritAttrs: false })

  const props = defineProps({
    /** The run's log lines — `{ at, level, message }[]`, `at` in ms from the run's zero. */
    logs: { type: Array, required: true },
    /** Levels the filter offers; a level with no line is still offered. */
    levels: { type: Array, default: () => ['debug', 'info', 'warn', 'error'] }
  })

  const search = ref('')
  const level = ref('')

  const rows = computed(() => {
    const term = search.value.trim().toLowerCase()
    return props.logs.filter(
      (line) =>
        (!level.value || line.level === level.value) &&
        (!term || line.message.toLowerCase().includes(term))
    )
  })

  const counts = computed(() =>
    Object.fromEntries(
      props.levels.map((name) => [name, props.logs.filter((line) => line.level === name).length])
    )
  )

  const toggle = (name) => {
    level.value = level.value === name ? '' : name
  }
</script>

<template>
  <CardBox
    v-bind="$attrs"
    :padded="false"
  >
    <template #content>
      <div
        class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-muted) p-(--spacing-xs)"
      >
        <InputText
          v-model="search"
          size="medium"
          placeholder="Search logs"
          aria-label="Search logs"
          class="min-w-36 grow basis-(--container-2xs)"
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
        </InputText>

        <div class="flex shrink-0 items-center gap-(--spacing-xxs)">
          <button
            v-for="name in levels"
            :key="name"
            type="button"
            :data-level="name"
            :data-active="level === name || null"
            :aria-pressed="level === name"
            class="flex h-8 items-center gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) text-label-sm text-(--text-muted) transition-colors duration-150 ease-out hover:border-(--border-strong) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none data-active:border-(--border-selected) data-active:bg-(--bg-selected) data-active:text-(--text-default) motion-reduce:transition-none"
            @click="toggle(name)"
          >
            <span
              :data-level="name"
              class="size-2 shrink-0 rounded-full bg-(--text-muted) data-[level=info]:bg-(--info-contrast) data-[level=warn]:bg-(--warning-contrast) data-[level=error]:bg-(--danger-contrast)"
            />
            {{ name }}
            <span class="tabular-nums text-(--text-disabled)">{{ counts[name] }}</span>
          </button>
        </div>
      </div>

      <ol class="m-0 list-none p-0">
        <li
          v-for="(line, index) in rows"
          :key="index"
          :data-level="line.level"
          class="group flex min-w-0 items-baseline gap-(--spacing-sm) border-b border-(--border-muted) px-(--spacing-md) py-(--spacing-xxs) last:border-b-0 data-[level=error]:bg-(--danger)/15 data-[level=warn]:bg-(--warning)/15"
        >
          <span
            class="w-14 shrink-0 text-right font-mono text-body-xs tabular-nums text-(--text-disabled)"
          >
            {{ formatDuration(line.at) }}
          </span>
          <span
            :data-level="line.level"
            class="w-12 shrink-0 font-mono text-body-xs uppercase text-(--text-muted) data-[level=info]:text-(--info-contrast) data-[level=warn]:text-(--warning-contrast) data-[level=error]:text-(--danger-contrast)"
          >
            {{ line.level }}
          </span>
          <span
            class="min-w-0 flex-1 font-mono text-body-xs break-words text-(--text-default) group-data-[level=error]:text-(--danger-contrast)"
          >
            {{ line.message }}
          </span>
        </li>
      </ol>

      <p
        v-if="!rows.length"
        class="p-(--spacing-md) text-center text-body-sm text-(--text-muted)"
      >
        No log line matches the current filter.
      </p>
    </template>
  </CardBox>
</template>
