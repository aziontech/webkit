<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, reactive, ref } from 'vue'

  import { sampleProjects, sampleSelected } from './sample'

  /** One resource the user can bind. */
  export interface ResourcePickerOption {
    /** Identifier emitted as the selection. */
    value: string
    /** Name shown as the row title. */
    label: string
    /** Secondary fact shown under the name. */
    description?: string
  }

  /** Where the bound resource comes from. */
  export type ResourcePickerMode = 'existing' | 'new'

  export interface ResourcePickerProps {
    /** The resources that can be bound; searched and paged in the browser. Left out, the sample renders. */
    projects?: ResourcePickerOption[]
    /** The next page is loading: skeleton rows follow the visible ones and Load more spins. */
    loading?: boolean
    /** The required message shown above the list, or under the Name field in New. */
    error?: string
  }

  const props = withDefaults(defineProps<ResourcePickerProps>(), {
    projects: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    /** Load more was pressed; the next five matches are revealed. */
    'load-more': [event: MouseEvent]
  }>()

  /** The value of the chosen resource. */
  const selected = defineModel<string>()
  /** Whether the user binds an existing resource or creates a new one. */
  const modeModel = defineModel<ResourcePickerMode>('mode')
  /** The name of the resource to create in New. */
  const name = defineModel<string>('name', { default: '' })

  const projectModes = [
    { label: 'Existing project', value: 'existing' },
    { label: 'New project', value: 'new' }
  ]
  const PAGE_SIZE = 5
  const wireWidths = ['62%', '48%', '70%', '54%', '44%']
  const wireSubWidths = ['84%', '66%', '78%', '58%', '72%']

  const projects = computed<ResourcePickerOption[]>(
    () => props.projects ?? (props.loading || props.error ? [] : sampleProjects)
  )

  const mode = computed<ResourcePickerMode>({
    get: () => modeModel.value ?? (projects.value.length ? 'existing' : 'new'),
    set: (next) => {
      modeModel.value = next
    }
  })

  const chosen = computed<string>({
    get: () => selected.value ?? (props.projects ? '' : sampleSelected),
    set: (next) => {
      selected.value = next
    }
  })

  const usePicker = (noun: string) => {
    const query = ref('')
    const shown = ref(PAGE_SIZE)

    const chosenIndex = projects.value.findIndex((option) => option.value === chosen.value)
    if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE

    const loading = computed(() => props.loading)
    const message = computed(() => props.error)
    const paged = computed(() => projects.value.length > PAGE_SIZE)
    const matches = computed(() => {
      const text = query.value.trim().toLowerCase()
      if (!text) return projects.value
      return projects.value.filter(
        (option) =>
          option.label.toLowerCase().includes(text) ||
          String(option.description ?? '')
            .toLowerCase()
            .includes(text)
      )
    })
    const visible = computed(() => matches.value.slice(0, shown.value))
    const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
    const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

    const summary = computed(() => {
      if (loading.value) return 'Loading ' + nextBatch.value + ' more ' + noun + 's'
      if (query.value.trim() && !matches.value.length)
        return 'No ' + noun + ' matches ' + query.value
      if (remaining.value)
        return visible.value.length + ' of ' + matches.value.length + ' ' + noun + 's'
      return query.value.trim()
        ? matches.value.length + ' of ' + projects.value.length + ' ' + noun + 's'
        : projects.value.length + ' ' + noun + 's'
    })

    const loadMore = (event: MouseEvent) => {
      if (loading.value || !remaining.value) return
      shown.value += PAGE_SIZE
      emit('load-more', event)
    }

    return reactive({
      query,
      chosen,
      message,
      loading,
      paged,
      matches,
      visible,
      remaining,
      nextBatch,
      summary,
      loadMore
    })
  }

  const projectPicker = usePicker('project')
</script>

<template>
  <div class="layout-column-form">
    <Card
      :padded="false"
      title="Project"
    >
      <template #default>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
          <p class="text-body-sm text-(--text-muted)">
            What this service serves on each environment, so one service can serve different
            projects on Production and Preview.
          </p>
          <ToggleGroup
            v-if="projects.length"
            v-model="mode"
            :options="projectModes"
            size="large"
            fluid
            aria-label="Where the project comes from"
          />
          <p
            v-else
            class="text-body-sm text-(--text-muted)"
          >
            There is no project to bind yet, so a new one is created with this service.
          </p>

          <p
            v-if="mode === 'existing'"
            class="text-body-sm text-(--text-muted)"
          >
            The release serves the latest ready version of the selected project, and an older one
            can be pinned from the deployment.
          </p>

          <div
            v-if="mode === 'new'"
            class="pb-(--spacing-md)"
          >
            <Field
              required
              :invalid="!!projectPicker.message"
            >
              <Field.Label>Name</Field.Label>
              <Input
                v-model="name"
                size="large"
                placeholder="my-project"
              />
              <Field.Description>{{
                projectPicker.message || 'Lowercase letters, numbers, and hyphens.'
              }}</Field.Description>
            </Field>
          </div>
        </div>

        <div
          v-if="mode === 'existing'"
          class="min-w-0 pt-(--spacing-md)"
        >
          <div
            v-if="projectPicker.paged || projectPicker.message"
            :data-field-invalid="projectPicker.message || null"
            class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
          >
            <Input
              v-if="projectPicker.paged"
              v-model="projectPicker.query"
              size="large"
              class="w-full"
              placeholder="Search projects"
              aria-label="Search projects"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>

            <FieldError v-if="projectPicker.message">{{ projectPicker.message }}</FieldError>
          </div>

          <div class="border-t border-(--border-default)">
            <Item.List>
              <Item
                v-for="option in projectPicker.visible"
                :key="option.value"
                size="small"
                clickable
                :aria-pressed="option.value === projectPicker.chosen"
                @click="projectPicker.chosen = option.value"
              >
                <Item.Media>
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      class="az az-box text-body-md leading-none text-(--text-default)"
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
                    v-if="option.value === projectPicker.chosen"
                    class="az az-check shrink-0 text-(--text-default)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </Item>

              <template v-if="projectPicker.loading">
                <Item
                  v-for="index in projectPicker.nextBatch"
                  :key="'wire-' + index"
                  size="small"
                  aria-hidden="true"
                >
                  <Item.Media>
                    <Skeleton
                      variant="rectangle"
                      width="2rem"
                      height="2rem"
                    />
                  </Item.Media>
                  <Item.Content>
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Skeleton
                        :width="wireWidths[(index - 1) % wireWidths.length]"
                        height="0.875rem"
                      />
                      <Skeleton
                        :width="wireSubWidths[(index - 1) % wireSubWidths.length]"
                        height="0.75rem"
                      />
                    </div>
                  </Item.Content>
                </Item>
              </template>
            </Item.List>

            <div
              v-if="projectPicker.remaining"
              class="border-t border-(--border-default) p-(--spacing-2xs)"
            >
              <Button
                type="button"
                :label="'Load ' + projectPicker.nextBatch + ' more'"
                variant="ghost"
                size="small"
                class="w-full"
                :loading="projectPicker.loading"
                @click="projectPicker.loadMore"
              />
            </div>

            <p
              v-if="!projectPicker.matches.length"
              class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)"
            >
              No project matches “{{ projectPicker.query }}”. Create one instead, or clear the
              search.
            </p>

            <span
              class="sr-only"
              role="status"
              >{{ projectPicker.summary }}</span
            >
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
