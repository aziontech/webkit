<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, reactive, ref } from 'vue'

  const projectModes = [
    { label: 'Existing project', value: 'existing' },
    { label: 'New project', value: 'new' }
  ]
  const projects = [
    { value: 'web-app', label: 'web-app', description: 'Astro · acme/web-app' },
    {
      value: 'black-friday-2025',
      label: 'black-friday-2025',
      description: 'Next.js · acme/black-friday-2025'
    },
    {
      value: 'black-friday-2026',
      label: 'black-friday-2026',
      description: 'Next.js · acme/black-friday-2026'
    },
    { value: 'docs-site', label: 'docs-site', description: 'Astro · acme/docs-site' },
    { value: 'docs-next', label: 'docs-next', description: 'Next.js · acme/docs-next' },
    { value: 'vue-sample', label: 'vue-sample', description: 'Vue · jane-doe/vue-sample' },
    { value: 'hello-world', label: 'hello-world', description: 'JavaScript · ' },
    { value: 'company-site', label: 'company-site', description: 'HTML · acme/company-site' },
    { value: 'company-docs', label: 'company-docs', description: 'HTML · ' },
    { value: 'analytics-pro', label: 'analytics-pro', description: 'Next.js · acme/analytics-pro' },
    { value: 'analytics-api', label: 'analytics-api', description: 'Next.js · ' },
    {
      value: 'react-dashboard',
      label: 'react-dashboard',
      description: 'React · acme/react-dashboard'
    },
    { value: 'docs-portal', label: 'docs-portal', description: 'Vue · ' },
    { value: 'ecommerce-v2', label: 'ecommerce-v2', description: 'Nuxt · shopco/ecommerce-v2' },
    { value: 'ecommerce-storefront', label: 'ecommerce-storefront', description: 'Nuxt · ' },
    {
      value: 'marketing-site',
      label: 'marketing-site',
      description: 'Astro · acme/marketing-site'
    },
    { value: 'blog-platform', label: 'blog-platform', description: 'Astro · ' },
    { value: 'status-page', label: 'status-page', description: 'Svelte · acme/status-page' },
    { value: 'mobile-app', label: 'mobile-app', description: 'Svelte · ' }
  ]
  const PAGE_SIZE = 5
  const wireWidths = ['62%', '48%', '70%', '54%', '44%']
  const wireSubWidths = ['84%', '66%', '78%', '58%', '72%']

  const usePicker = (options, noun, initial = {}) => {
    const query = ref('')
    const chosen = ref(initial.chosen ?? '')
    const message = ref(initial.message ?? '')
    const shown = ref(PAGE_SIZE)
    const loading = ref(initial.loading ?? false)

    const chosenIndex = options.findIndex((option) => option.value === chosen.value)
    if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE

    const paged = computed(() => options.length > PAGE_SIZE)
    const matches = computed(() => {
      const text = query.value.trim().toLowerCase()
      if (!text) return options
      return options.filter(
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
        ? matches.value.length + ' of ' + options.length + ' ' + noun + 's'
        : options.length + ' ' + noun + 's'
    })

    const loadMore = () => {
      if (loading.value || !remaining.value) return
      loading.value = true
      setTimeout(() => {
        shown.value += PAGE_SIZE
        loading.value = false
      }, 420)
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

  const mode = ref('existing')
  const name = ref('')
  const projectPicker = usePicker(projects, 'project', {
    chosen: 'web-app',
    loading: false,
    message: ''
  })
</script>

<template>
  <div class="layout-column-form">
    <Card
      :padded="false"
      title="Project"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
          <p class="text-body-sm text-(--text-muted)">
            What this service serves on each environment, so one service can serve different
            projects on Production and Preview.
          </p>
          <ToggleGroup
            v-model="mode"
            :options="projectModes"
            size="large"
            fluid
            aria-label="Where the project comes from"
          />

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
            <Field :required="!!projectPicker.message">
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
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>

            <HelperText
              v-if="projectPicker.message"
              kind="required"
              >{{ projectPicker.message }}</HelperText
            >
          </div>

          <div class="border-t border-(--border-default)">
            <Item.List>
              <Item
                v-for="option in projectPicker.visible"
                :key="option.value"
                as-child
                size="small"
              >
                <button
                  type="button"
                  class="w-full text-left data-[selected]:bg-(--bg-selected)"
                  :data-selected="option.value === projectPicker.chosen || null"
                  :aria-pressed="option.value === projectPicker.chosen"
                  @click="projectPicker.chosen = option.value"
                >
                  <Item.Media>
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <i
                        class="pi pi-box text-body-md leading-none text-(--text-default)"
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
                      class="pi pi-check shrink-0 text-(--text-default)"
                      aria-hidden="true"
                    />
                  </Item.Actions>
                </button>
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
                      kind="shape"
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
              class="border-t border-(--border-default) p-(--spacing-xxs)"
            >
              <Button
                type="button"
                :label="'Load ' + projectPicker.nextBatch + ' more'"
                kind="text"
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
