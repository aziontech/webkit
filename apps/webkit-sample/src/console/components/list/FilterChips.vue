<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Chip from '@aziontech/webkit/chip'
  import { computed } from 'vue'

  import { appliedFields, clearField, pickedAvatars, summarize } from '../../lib/behavior/filter-bar'
  import { requestOpen } from '../../lib/behavior/filter-open.js'

  interface Props {
    fields: unknown[]
  }

  const props = withDefaults(defineProps<Props>(), {
  })

  const model = defineModel<Record<string, unknown>>({ default: () => ({}) })

  const chips = computed(() => appliedFields(props.fields, model.value))

  const summaryOf = (field) => summarize(field, model.value[field.id])
  const avatarsOf = (field) => pickedAvatars(field, model.value[field.id])

  const edit = (field) => requestOpen(props.fields, field.id)
  const remove = (field) => model.value = clearField(model.value, field)
</script>

<template>
  <div
    v-if="chips.length"
    class="relative flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
    data-testid="filter-chips"
  >
    <TransitionGroup
      move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      enter-from-class="scale-90 opacity-0"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-90 opacity-0"
      leave-active-class="pointer-events-none absolute duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    >
      <span
        v-for="field in chips"
        :key="field.id"
        class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      >
        <Chip
          :data-filter-chip="field.id"
          :label="field.label"
          kind="filled"
          size="medium"
          clickable
          removable
          @click="edit(field)"
          @remove="remove(field)"
        >
          <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
            <span class="truncate text-(--text-muted)">{{ field.label }}</span>
            <span
              v-if="avatarsOf(field).length"
              class="flex shrink-0 items-center"
            >
              <Avatar
                v-for="(option, i) in avatarsOf(field)"
                :key="String(option.value)"
                :src="option.avatar || undefined"
                :alt="option.label"
                :label="option.label"
                size="small"
                kind="circle"
                class="size-4 ring-1 ring-(--bg-surface)"
                :class="i > 0 ? '-ml-1' : ''"
              />
            </span>
            <span class="truncate">{{ summaryOf(field)?.label }}</span>
            <span
              v-if="summaryOf(field)?.extra"
              class="shrink-0 text-(--text-muted)"
            >
              +{{ summaryOf(field).extra }}
            </span>
          </span>
        </Chip>
      </span>
    </TransitionGroup>
  </div>
</template>
