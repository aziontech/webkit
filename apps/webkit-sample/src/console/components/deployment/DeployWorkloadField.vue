<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import DeployWorkloadDomains from './DeployWorkloadDomains.vue'

  export type DeployWorkloadMode = 'existing' | 'new'

  interface WorkloadOption {
    id: string
    name: string
    domain?: string
    environments?: string[]
    open?: string[]
    serves?: string
  }

  interface Props {
    workloads?: WorkloadOption[]
    newWorkload?: WorkloadOption | null
    applicationName?: string
    domains?: { domain: string; environment: string; generated?: boolean }[]
  }

  const props = withDefaults(defineProps<Props>(), {
    workloads: () => [],
    newWorkload: null,
    applicationName: '',
    domains: () => []
  })

  const mode = defineModel<DeployWorkloadMode>('mode', { default: 'existing' })

  const model = defineModel<string>({ default: '' })

  const MODES = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]

  const existing = computed(
    () => props.workloads.find((entry) => entry.id === model.value) ?? props.workloads[0] ?? null
  )

  const workload = computed(() => (mode.value === 'new' ? props.newWorkload : existing.value))

  const environmentCount = (entry) => {
    const count = entry.environments?.length ?? 0
    return `${count} ${count === 1 ? 'environment' : 'environments'}`
  }

  const groups = computed(() =>
    [
      {
        key: 'serving',
        label: `Serving ${props.applicationName}`,
        workloads: props.workloads.filter((entry) => !entry.serves),
        detail: environmentCount
      },
      {
        key: 'flexible',
        label: 'Flexible',
        workloads: props.workloads.filter((entry) => entry.serves),
        detail: (entry) =>
          entry.open?.length < entry.environments?.length
            ? `Serves ${entry.serves} · ${entry.open.join(', ')} only`
            : `Serves ${entry.serves}`
      }
    ].filter((group) => group.workloads.length)
  )

  const changeable = computed(() => props.workloads.length > 1)

  const pick = (event, id) => {
    model.value = String(id)
  }
</script>

<template>
  <CardBox :padded="false">
    <template #header>
      <SegmentedButton
        v-model="mode"
        :options="MODES"
        size="medium"
        fluid
        aria-label="Workload"
        class="w-full"
      />
    </template>
    <template #content>
      <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
        <p
          v-if="mode === 'existing' && !workloads.length"
          class="text-body-sm text-(--text-muted)"
        >
          No workload can serve {{ applicationName }} yet.
        </p>

        <Item
          v-if="workload"
          kind="outline"
          size="small"
        >
          <Item.Media>
            <span
              class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <i
                class="ai ai-workloads text-body-xs text-(--text-default)"
                aria-hidden="true"
              />
            </span>
          </Item.Media>
          <Item.Content>
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <Item.Title class="truncate">{{ workload.name }}</Item.Title>
              <Tag
                v-if="mode === 'new'"
                label="New"
                severity="success"
                size="small"
                class="shrink-0"
              />
            </span>
            <Item.Description v-if="mode === 'new'">
              Gets its Azion domains on the first deploy.
            </Item.Description>
            <DeployWorkloadDomains
              v-else
              :domains="domains"
            />
          </Item.Content>
          <Item.Actions v-if="mode === 'existing' && changeable">
            <Dropdown
              placement="bottom-end"
              @select="pick"
            >
              <Dropdown.Trigger>
                <Button
                  label="Change"
                  kind="outlined"
                  size="small"
                  icon="pi pi-chevron-down"
                  icon-position="trailing"
                />
              </Dropdown.Trigger>
              <Dropdown.Group
                v-for="group in groups"
                :key="group.key"
                :label="group.label"
              >
                <Dropdown.Option
                  v-for="entry in group.workloads"
                  :key="entry.id"
                  :value="entry.id"
                  :label="entry.name"
                  :selected="entry.id === workload.id"
                >
                  <template #right>
                    <span class="truncate text-body-xs text-(--text-muted)">
                      {{ group.detail(entry) }}
                    </span>
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
            </Dropdown>
          </Item.Actions>
        </Item>
      </div>
    </template>
  </CardBox>
</template>
