<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import { computed, ref } from 'vue'

  import type { CreateHubTemplate, CreateHubTemplateSection } from '../types'

  export interface TemplateGalleryProps {
    /** The template sections. */
    sections: CreateHubTemplateSection[]
  }

  const props = defineProps<TemplateGalleryProps>()

  const templateSearch = ref('')

  const templateMatches = (item: CreateHubTemplate, query: string) =>
    item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)

  const filteredSections = computed(() => {
    const q = templateSearch.value.trim().toLowerCase()
    if (!q) return props.sections
    return props.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => templateMatches(item, q))
      }))
      .filter((section) => section.items.length > 0)
  })

  const clear = () => {
    templateSearch.value = ''
  }

  const templateHref = (item: CreateHubTemplate) => `/create/templates/${item.slug}`

  const TEMPLATE_GLOW_CLASS =
    'pointer-events-none absolute inset-0 -z-1 overflow-hidden rounded-(--shape-card) opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance ' +
    'group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none'

  const TEMPLATE_ICON_CLASS =
    'text-body-lg leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance ' +
    'group-focus-within:grayscale-0 group-hover:grayscale-0 motion-reduce:transition-none'
</script>

<template>
  <section class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1">
    <div class="flex flex-col gap-(--spacing-sm)">
      <div class="flex min-h-(--size-8) flex-wrap items-center justify-between gap-(--spacing-md)">
        <h2 class="text-title-sm text-(--text-default)">Start from template</h2>

        <div class="flex w-full shrink-0 items-center sm:w-(--container-3xs)">
          <Input
            v-model="templateSearch"
            size="medium"
            placeholder="Search templates"
            aria-label="Search templates"
            class="w-full"
          >
            <template #leading>
              <i class="az az-search" />
            </template>
          </Input>
        </div>
      </div>
    </div>

    <div class="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      <div class="flex lg:min-h-0 lg:flex-1">
        <ScrollArea
          fade
          aria-label="Start from template results"
          class="w-full"
        >
          <div class="pb-(--spacing-2xs) pe-(--spacing-2xs)">
            <EmptyState
              v-if="!filteredSections.length"
              size="small"
              icon="az az-search"
              title="No templates match"
              :description="`Nothing is named like “${templateSearch}”.`"
            >
              <template #actions>
                <Button
                  label="Clear search"
                  variant="outline"
                  size="small"
                  @click="clear"
                />
              </template>
            </EmptyState>
            <div
              v-else
              class="flex flex-col gap-(--layout-section-gap)"
            >
              <section
                v-for="section in filteredSections"
                :key="section.id"
                class="flex flex-col gap-(--layout-group-gap)"
              >
                <h3 class="text-label-sm text-(--text-muted)">
                  {{ section.label }}
                </h3>

                <div
                  v-if="section.kind === 'list'"
                  class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2"
                >
                  <IntegrationCard
                    v-for="item in section.items"
                    :key="item.slug"
                    :title="item.title"
                    :logo="`${item.icon} ${item.markClass}`.trim()"
                    :vendor="item.vendor ?? ''"
                    :description="item.description"
                    :href="templateHref(item)"
                  />
                </div>

                <div
                  v-else
                  class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
                >
                  <div
                    v-for="item in section.items"
                    :key="item.slug"
                    class="flex group relative min-h-(--size-44)"
                  >
                    <Card
                      :href="templateHref(item)"
                      class="w-full"
                    >
                      <template #default>
                        <div class="isolate flex flex-1 flex-col">
                          <span
                            aria-hidden="true"
                            :class="TEMPLATE_GLOW_CLASS"
                          >
                            <i
                              :class="[item.icon, item.markClass]"
                              class="absolute start-(--spacing-xl) top-(--spacing-xl) scale-600 text-body-lg leading-none text-(--primary) opacity-25 blur-sm"
                            />
                          </span>
                          <div
                            class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-start"
                          >
                            <span
                              class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                            >
                              <i
                                :class="[TEMPLATE_ICON_CLASS, [item.icon, item.markClass]]"
                                aria-hidden="true"
                              />
                            </span>
                            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                              <h4 class="text-label-md text-(--text-default)">
                                {{ item.title }}
                              </h4>
                              <p class="text-pretty text-body-sm text-(--text-muted)">
                                {{ item.description }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </template>
                    </Card>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  </section>
</template>
