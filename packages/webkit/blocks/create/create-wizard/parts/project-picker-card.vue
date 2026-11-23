<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  import { type ServiceWizardPicker, wireSubWidths, wireWidths } from '../lib/service-wizard'
  import { projectModes } from '../sample'

  /** Use an existing project or create one. */
  const projectMode = defineModel<string>('projectMode', { required: true })

  /** The name of the project created with the service. */
  const projectName = defineModel<string>('projectName', { required: true })

  /** The project picker. */
  const projectPicker = defineModel<ServiceWizardPicker>('picker', { required: true })
</script>

<template>
  <Card
    :padded="false"
    title="Project"
  >
    <template #default>
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
        <p class="text-body-sm text-(--text-muted)">
          What this service serves on each environment, so one service can serve different projects
          on Production and Preview.
        </p>
        <ToggleGroup
          v-model="projectMode"
          :options="projectModes"
          size="large"
          fluid
          aria-label="Where the project comes from"
        />

        <p
          v-if="projectMode === 'existing'"
          class="text-body-sm text-(--text-muted)"
        >
          The release serves the latest ready version of the selected project, and an older one can
          be pinned from the deployment.
        </p>

        <div
          v-if="projectMode === 'new'"
          class="pb-(--spacing-md)"
        >
          <Field
            required
            :invalid="!!projectPicker.message"
          >
            <Field.Label>Name</Field.Label>
            <Input
              v-model="projectName"
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
        v-if="projectMode === 'existing'"
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

        <div
          class="border-t border-(--border-default)"
          role="radiogroup"
          aria-label="Projects"
        >
          <Item.List>
            <Item
              v-for="option in projectPicker.visible"
              :key="option.value"
              size="small"
              clickable
              role="radio"
              :aria-checked="option.value === projectPicker.chosen"
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
                  class="az az-circle-on shrink-0 text-(--text-default)"
                  aria-hidden="true"
                />
                <i
                  v-else
                  class="az az-circle shrink-0 text-(--text-muted)"
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
            No project matches “{{ projectPicker.query }}”. Create one instead, or clear the search.
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
</template>
