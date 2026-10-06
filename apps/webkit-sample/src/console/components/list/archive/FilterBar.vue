<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import Chip from '@aziontech/webkit/chip'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import { computed, nextTick, ref, watch } from 'vue'

  import { useAnimatedHeight } from '../../../lib/behavior/animate-height.js'
  import {
    clearField,
    filterCount,
    isApplied,
    pickedAvatars,
    summarize,
    summarizeText,
    toggleValue
  } from '../../../lib/behavior/filter-bar'

  interface Props {
    fields: unknown[]
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: 'Add Filter'
  })

  const model = defineModel<Record<string, unknown>>({ default: () => ({}) })

  const open = ref(false)
  const activeId = ref(null)
  const query = ref('')
  const panelRef = ref(null)
  const barRef = ref(null)
  const originId = ref(null)

  const activeField = computed(
    () => props.fields.find((field) => field.id === activeId.value) ?? customField.value
  )

  const direction = ref('forward')

  const levelKey = computed(() => {
    if (customId.value) return `custom:${customId.value}`
    return activeId.value ? `values:${activeId.value}` : 'fields'
  })

  const { region, height: regionHeight, animateHeight } = useAnimatedHeight()
  const toLevel = (dir, mutate) => {
    direction.value = dir
    animateHeight(mutate)
  }

  const chips = computed(() => props.fields)

  const appliedCount = computed(() => filterCount(model.value))

  const rows = computed(() => {
    const term = query.value.trim().toLowerCase()
    const source = activeField.value ? (activeField.value.options ?? []) : props.fields
    if (!term) return source
    return source.filter((row) => row.label.toLowerCase().includes(term))
  })

  const values = computed(() => model.value[activeId.value] ?? [])
  const isPicked = (value) => values.value.includes(value)

  const summaryOf = (field) => summarize(field, model.value[field.id])
  const avatarsOf = (field) => pickedAvatars(field, model.value[field.id])

  const enter = (fieldId) => {
    originId.value = fieldId
    if (open.value) {
      toLevel('forward', () => {
        activeId.value = fieldId
        query.value = ''
      })
      return
    }
    activeId.value = fieldId
    query.value = ''
    open.value = true
  }
  const back = () => {
    toLevel('back', () => {
      activeId.value = null
      query.value = ''
    })
  }

  const restoreChipFocus = async (id) => {
    await nextTick()
    barRef.value?.querySelector(`[data-filter-chip="${id}"]`)?.focus()
  }

  watch(open, (isOpen) => {
    if (isOpen) return
    activeId.value = null
    customId.value = null
    calendarOpen.value = false
    customRange.value = null
    query.value = ''
    direction.value = 'forward'
    const id = originId.value
    originId.value = null
    if (id) restoreChipFocus(id)
  })

  const pick = (field, option) => {
    if (option.custom) {
      toLevel('forward', () => {
        customId.value = field.id
      })
      calendarOpen.value = true
      return
    }
    model.value = toggleValue(model.value, field, option.value)
    if (field.kind === 'range') back()
  }

  const customId = ref(null)
  const calendarOpen = ref(false)
  const customField = computed(() => props.fields.find((field) => field.id === customId.value))
  const customRange = ref(null)

  const leaveCustom = () => {
    calendarOpen.value = false
    customRange.value = null
    toLevel('back', () => {
      customId.value = null
    })
  }

  const commitCustom = (range) => {
    const field = customField.value
    if (!field) return
    const next = { ...model.value }
    if (range?.start || range?.end) next[field.id] = [range]
    else delete next[field.id]
    model.value = next
    const id = field.id
    leaveCustom()
    back()
    open.value = false
    restoreChipFocus(id)
  }

  const clear = (field) => {
    model.value = clearField(model.value, field)
  }
  const clearFromChip = (field) => {
    clear(field)
    if (activeId.value === field.id) back()
    restoreChipFocus(field.id)
  }

  const levelRows = () => [
    ...(panelRef.value?.querySelectorAll(`[data-level="${levelKey.value}"] [data-filter-row]`) ??
      [])
  ]

  const move = (event, step) => {
    const items = levelRows()
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(event.target)
    items[(index + step + items.length) % items.length]?.focus()
  }

  watch(levelKey, async () => {
    await nextTick()
    levelRows()[0]?.focus()
  })

  const ROW_CLASS =
    'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <div
    ref="barRef"
    class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
    data-testid="filter-bar"
  >
    <Popover
      v-model:open="open"
      placement="bottom-start"
      :dismissible="!calendarOpen"
      class="shrink-0"
    >
      <Popover.Trigger>
        <span class="relative inline-flex">
          <Chip
            kind="dashed"
            size="medium"
            clickable
            data-testid="filter-bar__add"
            :aria-label="
              appliedCount ? `${label}: ${appliedCount} applied` : `${label}: none applied`
            "
          >
            <i
              class="ai ai-filter-alt"
              aria-hidden="true"
            />
            {{ label }}
          </Chip>
          <span
            v-if="appliedCount"
            data-testid="filter-bar__indicator"
            class="pointer-events-none absolute top-px right-px size-2 rounded-full bg-(--primary) ring-2 ring-(--bg-canvas)"
            aria-hidden="true"
          />
        </span>
      </Popover.Trigger>

      <Popover.Content>
        <div
          ref="panelRef"
          class="flex flex-col"
          @keydown.down="move($event, 1)"
          @keydown.up="move($event, -1)"
        >
          <div
            ref="region"
            :style="{ height: regionHeight }"
            class="relative overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
          >
            <Transition
              :enter-from-class="
                direction === 'forward'
                  ? 'translate-x-[12%] opacity-0'
                  : 'translate-x-[-12%] opacity-0'
              "
              enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
              :leave-to-class="
                direction === 'forward'
                  ? 'translate-x-[-12%] opacity-0'
                  : 'translate-x-[12%] opacity-0'
              "
              leave-active-class="absolute inset-x-0 top-0 transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            >
              <div
                :key="levelKey"
                :data-level="levelKey"
                class="flex flex-col"
              >
                <div
                  v-if="activeField"
                  class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xs)"
                >
                  <IconButton
                    icon="pi pi-angle-left"
                    kind="outlined"
                    size="small"
                    :aria-label="customField ? 'Back to date periods' : 'Back to all filters'"
                    @click="customField ? leaveCustom() : back()"
                  />
                  <span class="truncate text-label-sm text-(--text-default)">
                    {{ activeField.label }}
                  </span>
                </div>

                <div
                  v-if="customField"
                  class="px-(--spacing-md) py-(--spacing-sm)"
                >
                  <CalendarRoot
                    v-model="customRange"
                    v-model:open="calendarOpen"
                    mode="range"
                    size="medium"
                    :show-fields="false"
                    placeholder="Pick a range"
                    class="w-full [&>span]:w-full [&>span>span]:w-full"
                    @update:model-value="commitCustom"
                  />
                </div>

                <template v-else>
                  <div class="border-b border-(--border-default) p-(--spacing-xs)">
                    <InputText
                      v-model="query"
                      size="medium"
                      class="w-full"
                      :placeholder="
                        activeField ? `Filter ${activeField.label.toLowerCase()}…` : 'Filter by…'
                      "
                      :aria-label="
                        activeField ? `Search ${activeField.label} values` : 'Search filter fields'
                      "
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </InputText>
                  </div>

                  <div
                    class="flex max-h-(--container-3xs) flex-col gap-(--spacing-xxs) overflow-y-auto p-(--spacing-xxs)"
                  >
                    <template v-if="!activeField">
                      <button
                        v-for="field in rows"
                        :key="field.id"
                        type="button"
                        data-filter-row
                        :class="ROW_CLASS"
                        :aria-expanded="false"
                        @click="enter(field.id)"
                      >
                        <span class="grow truncate">{{ field.label }}</span>
                        <span
                          v-if="isApplied(model, field)"
                          class="truncate text-(--text-muted)"
                        >
                          {{ summarizeText(field, model[field.id]) }}
                        </span>
                        <i
                          class="pi pi-angle-right shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                      </button>
                    </template>

                    <template v-else>
                      <button
                        v-for="option in rows"
                        :key="String(option.value)"
                        type="button"
                        data-filter-row
                        :role="
                          option.custom
                            ? undefined
                            : activeField.kind === 'range'
                              ? 'menuitemradio'
                              : 'menuitemcheckbox'
                        "
                        :aria-checked="option.custom ? undefined : isPicked(option.value)"
                        :class="ROW_CLASS"
                        @click="pick(activeField, option)"
                      >
                        <Avatar
                          v-if="'avatar' in option"
                          :src="option.avatar || undefined"
                          :alt="option.label"
                          :label="option.label"
                          size="small"
                          kind="square"
                          class="shrink-0"
                        />
                        <span class="grow truncate">{{ option.label }}</span>
                        <i
                          v-if="option.custom"
                          class="pi pi-angle-right shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <i
                          v-else
                          class="pi pi-check shrink-0 text-(--text-default)"
                          :class="isPicked(option.value) ? '' : 'invisible'"
                          aria-hidden="true"
                        />
                      </button>
                    </template>

                    <p
                      v-if="!rows.length"
                      class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
                    >
                      No match for “{{ query }}”.
                    </p>
                  </div>

                  <div
                    v-if="activeField && isApplied(model, activeField)"
                    class="border-t border-(--border-default) p-(--spacing-xxs)"
                  >
                    <button
                      type="button"
                      :class="ROW_CLASS"
                      @click="clear(activeField)"
                    >
                      <i
                        class="pi pi-filter-slash text-(--text-muted)"
                        aria-hidden="true"
                      />
                      Clear {{ activeField.label }}
                    </button>
                  </div>
                </template>
              </div>
            </Transition>
          </div>
        </div>
      </Popover.Content>
    </Popover>

    <TransitionGroup
      tag="div"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
      appear
      move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      enter-from-class="scale-90 opacity-0"
      enter-active-class="[transition-delay:var(--chip-enter-delay)]"
      leave-to-class="scale-90 opacity-0"
      leave-active-class="absolute"
    >
      <span
        v-for="(field, index) in chips"
        :key="field.id"
        class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        :style="{ '--chip-enter-delay': `${index * 45}ms` }"
      >
        <Chip
          :data-filter-chip="field.id"
          :label="field.label"
          :kind="isApplied(model, field) ? 'filled' : 'outlined'"
          size="medium"
          clickable
          :removable="isApplied(model, field)"
          @click="enter(field.id)"
          @remove="clearFromChip(field)"
        >
          <span class="flex min-w-0 items-center">
            <span class="truncate text-(--text-muted)">{{ field.label }}</span>

            <span
              class="grid grid-cols-[0fr] transition-[grid-template-columns] duration-moderate-01 ease-productive-entrance data-shown:grid-cols-[1fr] motion-reduce:transition-none"
              :data-shown="isApplied(model, field) || null"
            >
              <span class="min-w-0 overflow-hidden">
                <span
                  class="flex min-w-0 items-center gap-(--spacing-xxs) whitespace-nowrap pl-(--spacing-xxs)"
                >
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
              </span>
            </span>
          </span>
        </Chip>
      </span>
    </TransitionGroup>
  </div>
</template>
