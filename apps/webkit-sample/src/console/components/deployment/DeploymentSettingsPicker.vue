<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { bindingPolicyLabel, deploymentPolicyLabel } from '../../lib/data/deployment-strategies'

  interface Props {
    groups?: unknown[]
    selected?: unknown[]
    total?: number
    impactLoading?: boolean
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    groups: () => [],
    selected: () => [],
    total: 0,
    impactLoading: false,
    disabled: false
  })

  const emit = defineEmits<{
    toggle: [id: unknown]
    'select-all': []
    clear: []
    'group-action': []
  }>()

  const search = defineModel('search', { type: String, default: '' })

  const ENV_LIMIT = 3

  const selectableCount = computed(() =>
    props.groups
      .filter((group) => group.selectable)
      .reduce((total, group) => total + group.items.length, 0)
  )

  const isSelected = (id) => props.selected.includes(id)

  const onKeydown = (event, id) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    emit('toggle', id)
  }

  const envNames = (settings) => settings.environmentNames
  const extraEnvs = (settings) => envNames(settings).slice(ENV_LIMIT)

  const policyLine = (settings) =>
    `${bindingPolicyLabel(settings.bindingPolicy)} · ${deploymentPolicyLabel(settings.deploymentPolicy)}`

  const workloadsLine = (settings) => {
    const count = settings.workloadsCount
    if (!count) return 'No workloads deploy with it yet'
    return `${count} ${count === 1 ? 'workload' : 'workloads'} affected`
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
    <p class="text-body-sm text-(--text-muted)">
      A Deployment setting binds an application, and optionally a firewall and a custom page.
      Selecting one deploys into every environment and workload that uses it.
    </p>

    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
      <InputText
        v-model="search"
        size="large"
        :placeholder="`Search ${total} Deployment settings`"
        aria-label="Search Deployment settings"
        class="min-w-36 grow basis-(--container-2xs)"
      >
        <template #iconLeft>
          <i
            class="pi pi-search"
            aria-hidden="true"
          />
        </template>
      </InputText>

      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
        <span class="text-body-sm text-(--text-muted)">{{ selected.length }} selected</span>
        <Button
          label="Select all"
          kind="text"
          size="small"
          :disabled="disabled || selected.length === selectableCount"
          @click="emit('select-all')"
        />
        <Button
          label="Clear"
          kind="text"
          size="small"
          :disabled="disabled || !selected.length"
          @click="emit('clear')"
        />
      </div>
    </div>

    <div
      v-if="!groups.length"
      class="flex min-w-0 flex-col items-start gap-(--spacing-xs) rounded-(--shape-elements) border border-(length:--border-width-default) border-dashed border-(--border-muted) p-(--spacing-md)"
    >
      <p class="text-body-sm text-(--text-muted)">No Deployment settings match this search.</p>
      <Button
        label="Clear search"
        kind="text"
        size="small"
        @click="search = ''"
      />
    </div>

    <div
      v-else
      class="flex max-h-(--container-2xs) min-w-0 flex-col gap-(--spacing-md) overflow-y-auto"
    >
      <section
        v-for="group in groups"
        :key="group.key"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <p class="text-label-sm text-(--text-muted)">{{ group.label }}</p>

        <template v-if="group.selectable">
          <div
            v-for="settings in group.items"
            :key="settings.id"
            role="checkbox"
            :tabindex="disabled ? -1 : 0"
            :aria-checked="isSelected(settings.id)"
            :aria-disabled="disabled || undefined"
            :data-selected="isSelected(settings.id) || null"
            class="flex min-w-0 cursor-pointer items-start justify-between gap-(--spacing-sm) rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm) transition-colors duration-150 ease-out hover:border-(--border-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-selected:border-(--primary) data-selected:bg-(--bg-selected) motion-reduce:transition-none"
            @click="emit('toggle', settings.id)"
            @keydown="onKeydown($event, settings.id)"
          >
            <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="ai ai-deploy-pillar shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-label-md text-(--text-default)">
                  {{ settings.name }}
                </span>
                <Tag
                  v-if="settings.shared"
                  label="Shared"
                  severity="warning"
                  size="small"
                />
              </span>

              <span class="truncate text-body-xs text-(--text-muted)">
                {{ policyLine(settings) }}
              </span>

              <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xxs)">
                <Tag
                  v-for="name in envNames(settings).slice(0, ENV_LIMIT)"
                  :key="name"
                  :label="name"
                  severity="secondary"
                  size="small"
                />
                <Tooltip
                  v-if="extraEnvs(settings).length"
                  :text="extraEnvs(settings).join(', ')"
                >
                  <Tag
                    :label="`+${extraEnvs(settings).length}`"
                    severity="secondary"
                    size="small"
                  />
                </Tooltip>
              </span>

              <Skeleton
                v-if="impactLoading"
                width="var(--size-32)"
                height="var(--size-4)"
              />
              <span
                v-else
                class="text-body-xs text-(--text-muted)"
              >
                {{ workloadsLine(settings) }}
              </span>
            </span>

            <Tag
              v-if="settings.system"
              label="Azion"
              severity="secondary"
              size="medium"
              class="shrink-0"
            />
          </div>
        </template>

        <template v-else>
          <div
            v-for="settings in group.items"
            :key="settings.id"
            class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-elements) border border-(length:--border-width-default) border-dashed border-(--border-muted) p-(--spacing-sm)"
          >
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="pi pi-exclamation-circle shrink-0 text-(--warning-contrast)"
                aria-hidden="true"
              />
              <span class="truncate text-label-md text-(--text-default)">
                {{ settings.name }}
              </span>
              <Tag
                label="Inactive"
                severity="secondary"
                size="small"
                class="shrink-0"
              />
            </span>
            <p class="text-body-sm text-(--text-muted)">{{ group.notice }}</p>
            <Button
              class="self-start"
              :label="group.action"
              kind="text"
              size="small"
              icon="pi pi-external-link"
              @click="emit('group-action', group.key, settings)"
            />
          </div>
        </template>
      </section>
    </div>
  </div>
</template>
