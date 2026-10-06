<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  interface Props {
    options?: unknown[]
    icon?: string
    noun?: string
    nounPlural?: string
    message?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    icon: 'pi pi-box',
    noun: 'resource',
    nounPlural: '',
    message: '',
    disabled: false
  })

  const chosen = defineModel({ type: String, default: '' })

  const plural = computed(() => props.nounPlural || `${props.noun}s`)

  const PAGE_SIZE = 5

  const LOAD_LATENCY_MS = 420

  const WIRE_WIDTHS = ['62%', '48%', '70%', '54%', '44%']
  const WIRE_SUB_WIDTHS = ['84%', '66%', '78%', '58%', '72%']

  const query = ref('')
  const shown = ref(PAGE_SIZE)
  const loading = ref(false)

  const paged = computed(() => props.options.length > PAGE_SIZE)

  const matches = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return props.options
    return props.options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
        String(option.description ?? '')
          .toLowerCase()
          .includes(q)
    )
  })

  const visible = computed(() => matches.value.slice(0, shown.value))
  const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
  const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

  let loadTimeoutId = null

  const cancelLoad = () => {
    if (loadTimeoutId) clearTimeout(loadTimeoutId)
    loadTimeoutId = null
    loading.value = false
  }

  watch(query, () => {
    shown.value = PAGE_SIZE
    cancelLoad()
  })

  const chosenIndex = props.options.findIndex((option) => option.value === chosen.value)
  if (chosenIndex >= PAGE_SIZE) {
    shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE
  }

  const summary = computed(() => {
    if (loading.value) return `Loading ${nextBatch.value} more ${plural.value}`
    const total = props.options.length
    if (query.value.trim() && !matches.value.length) {
      return `No ${props.noun} matches ${query.value}`
    }
    if (remaining.value) return `${visible.value.length} of ${matches.value.length} ${plural.value}`
    return query.value.trim()
      ? `${matches.value.length} of ${total} ${plural.value}`
      : `${total} ${plural.value}`
  })

  const loadMore = () => {
    if (loading.value || !remaining.value) return
    loading.value = true
    loadTimeoutId = setTimeout(() => {
      shown.value += PAGE_SIZE
      cancelLoad()
    }, LOAD_LATENCY_MS)
  }

  onScopeDispose(cancelLoad)

  defineExpose({ cancelLoad })
</script>

<template>
  <div class="min-w-0">
    <div
      v-if="paged || message"
      :data-field-invalid="message || null"
      class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
    >
      <InputText
        v-if="paged"
        v-model="query"
        size="large"
        class="w-full"
        :placeholder="`Search ${plural}`"
        :aria-label="`Search ${plural}`"
        :disabled="disabled"
      >
        <template #iconLeft>
          <i
            class="pi pi-search"
            aria-hidden="true"
          />
        </template>
      </InputText>

      <HelperText
        v-if="message"
        kind="required"
        >{{ message }}</HelperText
      >
    </div>

    <div class="border-t border-(--border-default)">
      <Item.List>
        <Item
          v-for="option in visible"
          :key="option.value"
          as-child
          size="small"
        >
          <button
            type="button"
            class="w-full text-left data-[selected]:bg-(--bg-selected)"
            :disabled="disabled"
            :data-selected="option.value === chosen || null"
            :aria-pressed="option.value === chosen"
            @click="chosen = option.value"
          >
            <Item.Media>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="icon"
                  class="text-body-md leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ option.label }}</Item.Title>
              <Item.Description>{{ option.description }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <i
                v-if="option.value === chosen"
                class="pi pi-check shrink-0 text-(--text-default)"
                aria-hidden="true"
              />
            </Item.Actions>
          </button>
        </Item>

        <template v-if="loading">
          <Item
            v-for="index in nextBatch"
            :key="`wire-${index}`"
            size="small"
            aria-hidden="true"
          >
            <Item.Media>
              <Skeleton
                kind="shape"
                width="2rem"
                height="2rem"
              />
            </Item.Media>
            <Item.Content class="gap-(--spacing-xs)">
              <Skeleton
                :width="WIRE_WIDTHS[(index - 1) % WIRE_WIDTHS.length]"
                height="0.875rem"
              />
              <Skeleton
                :width="WIRE_SUB_WIDTHS[(index - 1) % WIRE_SUB_WIDTHS.length]"
                height="0.75rem"
              />
            </Item.Content>
          </Item>
        </template>
      </Item.List>

      <div
        v-if="remaining"
        class="border-t border-(--border-default) p-(--spacing-xxs)"
      >
        <Button
          type="button"
          :label="`Load ${nextBatch} more`"
          kind="text"
          size="small"
          class="w-full"
          :loading="loading"
          :disabled="disabled"
          @click="loadMore"
        />
      </div>

      <p
        v-if="!matches.length"
        class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)"
      >
        No {{ noun }} matches “{{ query }}”. Create one instead, or clear the search.
      </p>

      <span
        class="sr-only"
        role="status"
        >{{ summary }}</span
      >
    </div>
  </div>
</template>
