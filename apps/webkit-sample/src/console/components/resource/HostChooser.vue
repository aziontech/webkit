<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import { computed, nextTick, ref, useId, watch } from 'vue'

  interface Props {
    title: string
    icon?: string
    noun?: string
    hostIcon?: string
    options?: unknown[]
    canCreate?: boolean
    emptyLabel?: string
    selected?: string
    wide?: boolean
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    icon: 'pi pi-box',
    noun: 'application',
    hostIcon: 'ai ai-edge-application',
    options: () => [],
    canCreate: true,
    emptyLabel: '',
    selected: '',
    wide: false,
    disabled: false
  })

  defineSlots<{
    /** Sits between the heading and the search, for switching which kind of host is listed. */
    kinds(): unknown
    row(props: { option: unknown }): unknown
    note(): unknown
  }>()

  const emit = defineEmits<{
    choose: [value: unknown]
    skip: []
    'empty-action': []
  }>()

  const query = ref('')
  const creating = ref(false)
  const newName = ref('')
  const nameField = ref(null)
  const titleId = useId()
  const nameId = useId()

  const VISIBLE = 6

  const Noun = computed(() => props.noun.charAt(0).toUpperCase() + props.noun.slice(1))
  const article = computed(() => (/^[aeiou]/i.test(props.noun) ? 'an' : 'a'))

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return props.options
    return props.options.filter((option) =>
      [option.label, option.description].some((field) => (field ?? '').toLowerCase().includes(term))
    )
  })

  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!props.selected || head.some((option) => option.value === props.selected)) return head
    const chosen = matches.value.find((option) => option.value === props.selected)
    return chosen ? [chosen, ...head.slice(0, VISIBLE - 1)] : head
  })

  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const choose = (option) => emit('choose', { mode: 'existing', name: option.value })

  const startCreating = () => {
    newName.value = query.value.trim()
    creating.value = true
    nextTick(() => nameField.value?.focus?.())
  }

  const cancelCreating = () => {
    creating.value = false
    newName.value = ''
  }

  const confirmCreating = () => {
    const name = newName.value.trim()
    if (!name) return
    creating.value = false
    emit('choose', { mode: 'new', name })
  }

  const onSearchEnter = () => {
    if (matches.value.length) {
      choose(matches.value[0])
      return
    }
    if (props.canCreate) startCreating()
  }

  watch(query, () => {
    if (creating.value) cancelCreating()
  })

  watch(
    () => props.noun,
    () => {
      query.value = ''
      cancelCreating()
    }
  )
</script>

<template>
  <section
    :data-wide="wide || null"
    class="flex w-full max-w-(--container-2xs) flex-col items-center gap-(--spacing-lg) data-wide:max-w-(--container-md)"
    :aria-labelledby="titleId"
  >
    <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
      <span
        class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
      >
        <i
          :class="icon"
          class="text-body-lg leading-none text-(--text-default)"
          aria-hidden="true"
        />
      </span>
      <h1
        :id="titleId"
        class="text-heading-xs text-(--text-default)"
      >
        {{ title }}
      </h1>
      <p class="text-body-sm text-(--text-muted)">
        Choose {{ article }} {{ noun }} to continue
      </p>
    </header>

    <slot name="kinds" />

    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <InputText
        v-model="query"
        size="large"
        class="w-full"
        :placeholder="`Find ${noun}…`"
        :aria-label="`Find ${noun}`"
        :disabled="disabled"
        autocomplete="off"
        @keydown.enter.prevent="onSearchEnter"
      />

      <div
        v-if="creating"
        class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
      >
        <label
          :for="nameId"
          class="text-label-md text-(--text-default)"
          >New {{ noun }}</label
        >
        <InputText
          :id="nameId"
          ref="nameField"
          v-model="newName"
          size="large"
          class="w-full"
          :placeholder="`my-${noun}`"
          :disabled="disabled"
          autocomplete="off"
          @keydown.enter.prevent="confirmCreating"
        />
        <div class="flex items-center justify-end gap-(--spacing-sm)">
          <Button
            type="button"
            label="Back"
            kind="text"
            size="medium"
            :disabled="disabled"
            @click="cancelCreating"
          />
          <Button
            type="button"
            label="Continue"
            kind="primary"
            size="medium"
            :disabled="disabled || !newName.trim()"
            @click="confirmCreating"
          />
        </div>
      </div>

      <div
        v-else
        class="flex flex-col"
      >
        <button
          v-for="option in visible"
          :key="option.value"
          type="button"
          :disabled="disabled"
          :aria-pressed="selected === option.value"
          :data-selected="selected === option.value || null"
          class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none data-selected:bg-(--bg-selected) motion-reduce:transition-none"
          @click="choose(option)"
        >
          <i
            :class="hostIcon"
            class="shrink-0 text-body-md leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
            {{ option.label }}
          </span>
          <slot
            name="row"
            :option="option"
          />
          <i
            v-if="selected === option.value"
            class="pi pi-check shrink-0 text-body-sm leading-none text-(--text-default)"
            aria-hidden="true"
          />
        </button>

        <p
          v-if="hidden"
          class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          {{ hidden }} more — type to narrow.
        </p>

        <p
          v-else-if="!matches.length && options.length"
          class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          No {{ noun }} matches “{{ query.trim() }}”.
        </p>

        <p
          v-else-if="!options.length"
          class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          This account has no {{ noun }} yet.
        </p>

        <button
          v-if="canCreate"
          type="button"
          :disabled="disabled"
          class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none motion-reduce:transition-none"
          @click="startCreating"
        >
          <i
            class="pi pi-plus shrink-0 text-body-sm leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
            Create {{ Noun }}
          </span>
        </button>
      </div>

      <slot name="note" />
    </div>

    <div class="flex flex-col items-center gap-(--spacing-xxs)">
      <Button
        v-if="emptyLabel && (!options.length || !canCreate)"
        type="button"
        :label="emptyLabel"
        kind="text"
        size="small"
        :disabled="disabled"
        @click="emit('empty-action')"
      />

      <Button
        type="button"
        :label="`Continue without ${article} ${noun}`"
        kind="text"
        size="small"
        :disabled="disabled"
        @click="emit('skip')"
      />
    </div>
  </section>
</template>
