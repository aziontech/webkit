<script setup lang="ts">
  import { useId } from 'vue'

  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import RadioGroup from '../../../input/radio-group/radio-group.vue'
  import RadioGroupItem from '../../../input/radio-group/radio-group-item/radio-group-item.vue'
  import Tag from '../../tag/tag.vue'
  import {
    WORKLOAD_OVERVIEW_ENVIRONMENTS,
    WORKLOAD_OVERVIEW_SELECTED_ENVIRONMENT
  } from '../lib/workload-overview-data'

  defineOptions({ name: 'WorkloadDeployDrawer' })

  const environmentHeadingId = useId()

  const DEPLOY_DRAWER_CLASS =
    'absolute inset-y-0 end-0 flex w-[47%] translate-x-full flex-col border-s border-(--border-default) bg-(--bg-surface) transition-[translate] duration-slow-01 ' +
    'ease-productive-entrance ' +
    'data-[state=open]:translate-x-0 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <aside :class="DEPLOY_DRAWER_CLASS">
    <div
      class="flex shrink-0 items-start gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-md)"
    >
      <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
        <h2 class="m-0 text-heading-xs text-(--text-default)">Deploy</h2>
        <p class="m-0 text-body-sm text-(--text-muted)">
          Publish storefront-prod. Review what this release carries and where it lands.
        </p>
      </div>
      <IconButton
        class="ms-auto shrink-0"
        icon="az az-x"
        variant="outline"
        size="small"
        ariaLabel="Close"
      />
    </div>

    <div
      class="flex min-h-0 flex-1 flex-col gap-(--spacing-xl) px-(--spacing-lg) py-(--spacing-lg)"
    >
      <div class="flex flex-col gap-(--spacing-sm)">
        <h3 class="m-0 flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)">
          Resources
          <i
            class="az az-circle-info text-body-xs text-(--text-muted)"
            aria-hidden="true"
          />
        </h3>
        <div
          class="flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
        >
          <div class="flex items-center gap-(--spacing-sm) p-(--spacing-sm)">
            <span
              class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-default)"
            >
              <i
                class="az az-applications text-body-md leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
            <span class="flex min-w-0 flex-col">
              <span class="flex items-center gap-(--spacing-xs) text-body-sm">
                <span class="text-(--text-muted)">Application</span>
                <span class="text-(--text-default)">storefront-prod</span>
                <Tag
                  label="Ready"
                  severity="success"
                  size="small"
                />
              </span>
              <span class="text-body-sm text-(--text-muted)">AWFBBZ1Q</span>
            </span>
            <span
              class="ms-auto flex h-8 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) px-(--spacing-sm) text-label-sm text-(--text-default)"
            >
              Change Version
              <i
                class="az az-chevron-down text-(--text-muted)"
                aria-hidden="true"
              />
            </span>
          </div>
          <div
            class="flex items-center border-y border-(--border-default) bg-(--bg-canvas) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default)"
          >
            Dependencies
            <i
              class="az az-chevron-down ms-auto text-(--text-muted)"
              aria-hidden="true"
            />
          </div>
          <div class="flex items-center gap-(--spacing-sm) p-(--spacing-sm)">
            <span
              class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-default)"
            >
              <i
                class="az az-object-storage text-body-md leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
            <span class="flex min-w-0 flex-col">
              <span class="flex items-center gap-(--spacing-xs) text-body-sm">
                <span class="text-(--text-muted)">Object Storage</span>
                <span class="text-(--text-default)">storefront-prod-storage</span>
              </span>
              <span class="text-body-sm text-(--text-muted)">Not versioned</span>
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-(--spacing-sm)">
        <h3
          :id="environmentHeadingId"
          class="m-0 flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)"
        >
          Environment
          <i
            class="az az-circle-info text-body-xs text-(--text-muted)"
            aria-hidden="true"
          />
        </h3>
        <RadioGroup
          :model-value="WORKLOAD_OVERVIEW_SELECTED_ENVIRONMENT"
          variant="card"
          :aria-labelledby="environmentHeadingId"
        >
          <RadioGroupItem
            v-for="environment in WORKLOAD_OVERVIEW_ENVIRONMENTS"
            :key="environment.name"
            :value="environment.name"
            :description="environment.description"
          >
            {{ environment.name }}
            <template
              v-if="environment.tag"
              #tag
            >
              <Tag
                :label="environment.tag"
                severity="info"
                size="small"
              />
            </template>
          </RadioGroupItem>
        </RadioGroup>
      </div>
    </div>

    <div
      class="flex shrink-0 items-center justify-end border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md)"
    >
      <Button
        label="Deploy"
        variant="primary"
        size="medium"
      />
    </div>
  </aside>
</template>
