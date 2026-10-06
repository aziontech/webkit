<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import SuccessMark from '../../../components/page/SuccessMark.vue'
  import { applyFilters } from '../../../lib/behavior/filter-bar'
  import { useScrollFade } from '../../../lib/behavior/scroll-fade'
  import { FRAMEWORKS, templateSlugForTech, useCaseOptions } from '../../../lib/data/frameworks'
  import {
    AZION_TEMPLATES,
    getTemplate,
    PARTNER_TEMPLATES,
    templateKindOptions,
    templateSource
  } from '../../../lib/data/templates.js'

  interface Props {
    source?: Record<string, unknown>
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    source: null,
    disabled: false
  })

  const emit = defineEmits<{
    'update:source': [value: unknown]
  }>()

  const search = ref('')

  const { scroller, fadeStyle } = useScrollFade({ max: 32 })

  const catalogRow = (template) => ({
    key: template.slug,
    title: template.title,
    description: template.description,
    icon: template.icon,
    vendor: template.vendor,
    kind: template.kind,
    tech: template.framework,
    useCases: template.useCases ?? [],
    template
  })

  const azionRows = AZION_TEMPLATES.map(catalogRow)
  const partnerRows = PARTNER_TEMPLATES.map(catalogRow)

  const listedAbove = new Set([...azionRows, ...partnerRows].map((row) => row.template.slug))

  const frameworkRows = FRAMEWORKS.map((framework, index) => ({
    key: framework.tech,
    title: framework.title,
    label: framework.label,
    description: framework.description,
    icon: framework.icon,
    kind: 'framework',
    tech: framework.tech,
    useCases: framework.useCases ?? [],
    featured: index < 3,
    template: getTemplate(templateSlugForTech(framework.tech))
  })).filter((row) => !listedAbove.has(row.template.slug))

  const matches = (row, q) =>
    [row.title, row.label ?? '', row.description].some((field) => field.toLowerCase().includes(q))

  const fields = [
    {
      id: 'kind',
      label: 'Type',
      kind: 'options',
      options: templateKindOptions,
      match: (row, values) => values.includes(row.kind)
    },
    {
      id: 'useCases',
      label: 'Use Case',
      kind: 'options',
      options: useCaseOptions,
      match: (row, values) => row.useCases.some((useCase) => values.includes(useCase))
    }
  ]

  const filters = ref({})
  const clearFilters = () => {
    filters.value = {}
  }

  const groups = computed(() => {
    const q = search.value.trim().toLowerCase()
    return [
      { id: 'azion', label: 'Azion', rows: azionRows },
      { id: 'partners', label: 'Partners', rows: partnerRows },
      { id: 'frameworks', label: 'Frameworks', rows: frameworkRows }
    ]
      .map((group) => ({
        ...group,
        rows: applyFilters(
          q ? group.rows.filter((row) => matches(row, q)) : group.rows,
          fields,
          filters.value
        )
      }))
      .filter((group) => group.rows.length)
  })

  const resultCount = computed(() =>
    groups.value.reduce((total, group) => total + group.rows.length, 0)
  )

  const chosenSlug = computed(() => (props.source?.kind === 'template' ? props.source.slug : ''))

  const choose = (row) => emit('update:source', templateSource(row.template, row.icon))
</script>

<template>
  <CardBox
    :padded="false"
    title="Select a template"
  >
    <template #content>
      <div
        class="flex flex-col gap-(--spacing-sm) border-b border-(--border-default) p-(--spacing-md)"
      >
        <div class="flex items-center gap-(--spacing-sm)">
          <FilterButton
            v-model="filters"
            :fields="fields"
          />

          <InputText
            v-model="search"
            size="large"
            class="min-w-0 flex-1"
            placeholder="Search templates"
            aria-label="Search templates"
            :disabled="disabled"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </div>

        <FilterChips
          v-model="filters"
          :fields="fields"
        />
      </div>

      <div
        ref="scroller"
        :style="fadeStyle"
        class="max-h-(--container-sm) overflow-y-auto overscroll-contain"
      >
        <template v-if="resultCount">
          <section
            v-for="group in groups"
            :key="group.id"
          >
            <h3
              class="sticky top-0 z-1 border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) text-label-sm text-(--text-muted)"
            >
              {{ group.label }}
            </h3>

            <Item.List>
              <Item
                v-for="row in group.rows"
                :key="row.key"
                as-child
                size="small"
              >
                <button
                  type="button"
                  class="w-full text-left"
                  :disabled="disabled"
                  :aria-pressed="row.template.slug === chosenSlug"
                  @click="choose(row)"
                >
                  <Item.Media>
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <AzionLogoMin
                        v-if="row.vendor === 'Azion'"
                        class="h-4 w-auto shrink-0"
                        aria-hidden="true"
                      />
                      <i
                        v-else
                        :class="row.icon"
                        class="text-body-md leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </span>
                  </Item.Media>
                  <Item.Content>
                    <Item.Title>{{ row.title }}</Item.Title>
                    <Item.Description>{{ row.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <Tag
                      v-if="row.featured"
                      label="Featured"
                      severity="primary"
                      size="small"
                    />
                    <SuccessMark
                      v-if="row.template.slug === chosenSlug"
                      key="chosen"
                    />
                    <i
                      v-else
                      class="pi pi-chevron-right text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </Item.Actions>
                </button>
              </Item>
            </Item.List>
          </section>
        </template>

        <div
          v-else
          class="flex flex-col items-center gap-(--spacing-xs) px-(--spacing-md) py-(--spacing-lg) text-center"
        >
          <p class="text-body-sm text-(--text-muted)">
            {{
              search.trim()
                ? `No templates match “${search.trim()}”.`
                : 'No templates match your filters.'
            }}
          </p>
          <Button
            v-if="Object.values(filters).some((values) => values?.length)"
            type="button"
            label="Clear filters"
            kind="text"
            size="small"
            @click="clearFilters"
          />
        </div>
      </div>
    </template>
  </CardBox>
</template>
